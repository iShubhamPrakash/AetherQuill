'use client';

import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { LOCAL_STORAGE_KEYS } from '@/config/constants';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export default function AIBlogWriter() {
	const [step, setStep] = useState(1);
	const [topic, setTopic] = useState('');
	const [titles, setTitles] = useState<string[]>([]);
	const [selectedTitle, setSelectedTitle] = useState('');
	const [blogPost, setBlogPost] = useState('');
	const [headerImage, setHeaderImage] = useState('');
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
	const [selectedPostIndex, setSelectedPostIndex] = useState<number>(0);
	const [generatedImages, setGeneratedImages] = useState<string[]>([]);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
	const [showRawMarkdown, setShowRawMarkdown] = useState(false);

	const handleStepClick = (stepNumber: number) => {
		// Check if trying to go backwards
		if (stepNumber < step) {
			setStep(stepNumber);
			return;
		}

		// Prevent moving forward if current step isn't completed
		if (stepNumber > step) {
			// Check step completion conditions
			if (step === 1 && !titles.length) return;
			if (step === 2 && !selectedTitle) {
				toast({
					title: 'Selection Required',
					description: 'Please select a title before proceeding.',
					variant: 'destructive',
				});
				return;
			}
			if (step === 3 && !generatedPosts.length) return;
			if (step === 4 && !generatedImages.length) return;

			// Only allow moving to the next immediate step
			if (stepNumber === step + 1) {
				setStep(stepNumber);
			}
		}
	};

	const generateTitlesWithAI = async (topic: string) => {
		const apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.OPENAI_KEY);

		if (!apiKey) {
			toast({
				title: 'API Key Missing',
				description: 'Please add your OpenAI API key in settings first.',
				variant: 'destructive',
			});
			return null;
		}

		try {
			const response = await fetch('/api/generate-titles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					topic,
					apiKey,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to generate titles');
			}

			const data = await response.json();
			return data.titles;
		} catch (error) {
			toast({
				title: 'Error generating titles',
				description: (error as Error).message,
				variant: 'destructive',
			});
			return null;
		}
	};

	const generateBlogWithAI = async (title: string) => {
		const apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.OPENAI_KEY);

		if (!apiKey) {
			toast({
				title: 'API Key Missing',
				description: 'Please add your OpenAI API key in settings first.',
				variant: 'destructive',
			});
			return null;
		}

		try {
			const response = await fetch('/api/generate-blog', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					apiKey,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error ||
						`Failed to generate blog post: ${response.statusText}`
				);
			}

			const data = await response.json();

			if (!data.content) {
				throw new Error('No content received from the API');
			}

			return data.content;
		} catch (error) {
			toast({
				title: 'Error generating blog post',
				description:
					error instanceof Error
						? error.message
						: 'Failed to generate blog post',
				variant: 'destructive',
			});
			console.error('Blog generation error:', error);
			return null;
		}
	};

	const handleTopicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const generatedTitles = await generateTitlesWithAI(topic);

		if (generatedTitles) {
			setTitles(generatedTitles);
			setStep(2);
		}

		setLoading(false);
	};

	const handleTitleSelect = (title: string) => {
		setSelectedTitle(title);
		setGeneratedPosts([]);
		setBlogPost('');
		setSelectedPostIndex(0);
		setStep(3);
	};

	const generateBlogPost = async () => {
		setLoading(true);
		try {
			const generatedContent = await generateBlogWithAI(selectedTitle);

			if (generatedContent) {
				setGeneratedPosts((prev) => [...prev, generatedContent]);
				setBlogPost(generatedContent);
				setSelectedPostIndex(generatedPosts.length);
			}
		} catch (error) {
			console.error('Error in generateBlogPost:', error);
		} finally {
			setLoading(false);
		}
	};

	const generateImageWithAI = async (title: string) => {
		const apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.REPLICATE_KEY);

		if (!apiKey) {
			toast({
				title: 'API Key Missing',
				description: 'Please add your Replicate API key in settings first.',
				variant: 'destructive',
			});
			return null;
		}

		try {
			const response = await fetch('/api/generate-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					apiKey,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.details || data.error || 'Failed to generate image'
				);
			}

			if (!data.imageUrl) {
				throw new Error('No image URL received');
			}

			return data.imageUrl;
		} catch (error) {
			toast({
				title: 'Error generating image',
				description: (error as Error).message,
				variant: 'destructive',
			});
			console.error('Image generation error:', error);
			return null;
		}
	};

	const generateHeaderImage = async () => {
		setLoading(true);

		const imageUrl = await generateImageWithAI(selectedTitle);

		if (imageUrl) {
			setGeneratedImages((prev) => [...prev, imageUrl]);
			setHeaderImage(imageUrl);
			setSelectedImageIndex(generatedImages.length);
		}

		setLoading(false);
	};

	return (
		<div className="flex flex-col min-h-screen relative">
			<div className="h-1/2 w-full absolute  z-0 bg-gradient-to-b from-orange-100 to-white" />
			<Navigation />
			<main className="flex-1 relative z-10">
				<div className="container mx-auto p-4 max-w-6xl mt-8">
					<Card>
						<CardHeader>
							<CardTitle>AI Blog Writer</CardTitle>
							<CardDescription>
								Create amazing blog posts with the help of AI
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between mb-8">
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className={`flex items-center ${i > 1 ? 'ml-2' : ''}`}
									>
										<div
											className={`rounded-full h-8 w-8 flex items-center justify-center border-2
												${
													step >= i
														? 'bg-primary text-primary-foreground border-primary cursor-pointer'
														: 'border-gray-300'
												} ${i === step + 1 ? 'cursor-pointer' : ''}`}
											onClick={() => handleStepClick(i)}
											role="button"
											tabIndex={0}
											style={{
												cursor:
													i <= step || i === step + 1
														? 'pointer'
														: 'not-allowed',
											}}
										>
											{i}
										</div>
										{i < 5 && <ChevronRight className="ml-2" />}
									</div>
								))}
							</div>

							{step === 1 && (
								<form onSubmit={handleTopicSubmit}>
									<div className="space-y-4">
										<Label htmlFor="topic">Enter your blog topic</Label>
										<Input
											id="topic"
											placeholder="e.g., Artificial Intelligence, Climate Change, Space Exploration"
											value={topic}
											onChange={(e) => setTopic(e.target.value)}
											required
										/>
									</div>
									<Button
										type="submit"
										className="mt-4 w-full"
										disabled={loading}
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
												Generating Titles
											</>
										) : (
											'Generate Titles'
										)}
									</Button>
								</form>
							)}

							{step === 2 && (
								<div className="space-y-4">
									<h3 className="text-lg font-medium">
										Select a title for your blog post
									</h3>
									<RadioGroup
										onValueChange={handleTitleSelect}
										value={selectedTitle}
										className="space-y-2"
									>
										{titles.map((title, index) => (
											<div
												key={index}
												className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
											>
												<RadioGroupItem value={title} id={`title-${index}`} />
												<Label
													htmlFor={`title-${index}`}
													className="flex-1 cursor-pointer"
												>
													{title}
												</Label>
											</div>
										))}
									</RadioGroup>

									<Button
										variant="outline"
										className="w-full mt-4"
										onClick={async () => {
											setLoading(true);
											const newTitles = await generateTitlesWithAI(topic);
											if (newTitles) {
												setTitles(newTitles);
												setSelectedTitle(''); // Clear selection when new titles are generated
											}
											setLoading(false);
										}}
										disabled={loading}
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Regenerating Titles
											</>
										) : (
											'Regenerate Titles'
										)}
									</Button>
								</div>
							)}

							{step === 3 && (
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Blog Post Generation</h3>
									<div className="p-4 rounded-lg bg-muted mb-4">
										<p className="font-medium">Selected Title:</p>
										<p className="mt-1">{selectedTitle}</p>
									</div>

									{generatedPosts.length > 0 && (
										<div className="space-y-4">
											{generatedPosts.length > 1 && (
												<div className="flex items-center gap-2 mb-4">
													<p className="text-sm text-muted-foreground">
														Version {selectedPostIndex + 1} of{' '}
														{generatedPosts.length}
													</p>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																const newIndex =
																	(selectedPostIndex -
																		1 +
																		generatedPosts.length) %
																	generatedPosts.length;
																setSelectedPostIndex(newIndex);
																setBlogPost(generatedPosts[newIndex]);
															}}
															disabled={generatedPosts.length <= 1}
														>
															Previous
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																const newIndex =
																	(selectedPostIndex + 1) %
																	generatedPosts.length;
																setSelectedPostIndex(newIndex);
																setBlogPost(generatedPosts[newIndex]);
															}}
															disabled={generatedPosts.length <= 1}
														>
															Next
														</Button>
													</div>
												</div>
											)}

											<div className="flex items-center justify-end space-x-2 mb-2">
												<Label htmlFor="show-markdown" className="text-sm">
													Show Raw Markdown
												</Label>
												<Switch
													id="show-markdown"
													checked={showRawMarkdown}
													onCheckedChange={setShowRawMarkdown}
												/>
											</div>

											{showRawMarkdown ? (
												<div className="font-mono text-sm border rounded-lg p-4 bg-card whitespace-pre-wrap">
													{blogPost}
												</div>
											) : (
												<div className="prose prose-stone dark:prose-invert max-w-none border rounded-lg p-4 bg-card">
													<ReactMarkdown
														remarkPlugins={[remarkGfm, remarkBreaks]}
														rehypePlugins={[rehypeRaw, rehypeSanitize]}
														components={{
															h1: ({ ...props }) => (
																<h1
																	className="text-3xl font-bold mt-8 mb-4"
																	{...props}
																/>
															),
															h2: ({ ...props }) => (
																<h2
																	className="text-2xl font-semibold mt-6 mb-4"
																	{...props}
																/>
															),
															h3: ({ ...props }) => (
																<h3
																	className="text-xl font-semibold mt-4 mb-3"
																	{...props}
																/>
															),
															h4: ({ ...props }) => (
																<h4
																	className="text-lg font-semibold mt-4 mb-2"
																	{...props}
																/>
															),
															p: ({ ...props }) => (
																<p
																	className="text-lg leading-relaxed mb-4"
																	{...props}
																/>
															),
															ul: ({ ...props }) => (
																<ul
																	className="list-disc pl-6 mb-4 space-y-2"
																	{...props}
																/>
															),
															ol: ({ ...props }) => (
																<ol
																	className="list-decimal pl-6 mb-4 space-y-2"
																	{...props}
																/>
															),
															li: ({ ...props }) => (
																<li className="leading-relaxed" {...props} />
															),
															blockquote: ({ ...props }) => (
																<blockquote
																	className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
																	{...props}
																/>
															),
															code: ({
																inline,
																className,
																children,
																...props
															}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
															any) => {
																const match = /language-(\w+)/.exec(
																	className || ''
																);
																return !inline ? (
																	<pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
																		<code
																			className={
																				className
																					? `language-${match?.[1]}`
																					: ''
																			}
																			{...props}
																		>
																			{children}
																		</code>
																	</pre>
																) : (
																	<code
																		className="bg-muted px-1.5 py-0.5 rounded text-sm"
																		{...props}
																	>
																		{children}
																	</code>
																);
															},
															table: ({ ...props }) => (
																<div className="my-4 w-full overflow-x-auto">
																	<table
																		className="w-full border-collapse"
																		{...props}
																	/>
																</div>
															),
															th: ({ ...props }) => (
																<th
																	className="border border-muted px-4 py-2 bg-muted font-semibold text-left"
																	{...props}
																/>
															),
															td: ({ ...props }) => (
																<td
																	className="border border-muted px-4 py-2"
																	{...props}
																/>
															),
															a: ({ ...props }) => (
																<a
																	className="text-primary hover:underline"
																	{...props}
																/>
															),
															img: ({ src, alt }) => (
																<div className="relative w-full h-64 my-4">
																	<Image
																		src={src || ''}
																		alt={alt || 'Blog post image'}
																		fill
																		className="rounded-lg object-cover"
																	/>
																</div>
															),
															hr: () => <hr className="my-8 border-muted" />,
														}}
													>
														{blogPost}
													</ReactMarkdown>
												</div>
											)}
										</div>
									)}

									<div className="flex flex-col gap-2 w-full">
										<Button
											onClick={generateBlogPost}
											disabled={loading}
											className="w-full"
											variant={
												generatedPosts.length > 0 ? 'outline' : 'default'
											}
										>
											{loading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Generating Post
												</>
											) : generatedPosts.length > 0 ? (
												'Generate Another Version'
											) : (
												'Generate Post'
											)}
										</Button>

										{generatedPosts.length > 0 && (
											<Button onClick={() => setStep(4)} className="w-full">
												Next: Generate Images
											</Button>
										)}
									</div>
								</div>
							)}

							{step === 4 && (
								<div className="space-y-4">
									<h3 className="text-lg font-medium">
										Header Image Generation
									</h3>

									<div className="p-4 rounded-lg bg-muted mb-4">
										<p className="font-medium">Blog Title:</p>
										<p className="mt-1">{selectedTitle}</p>
									</div>

									{generatedImages.length > 0 && (
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<h4 className="text-md font-medium">
													Generated Header Images
												</h4>
												{generatedImages.length > 1 && (
													<div className="flex items-center gap-2">
														<p className="text-sm text-muted-foreground">
															Version {selectedImageIndex + 1} of{' '}
															{generatedImages.length}
														</p>
														<div className="flex gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() => {
																	const newIndex =
																		(selectedImageIndex -
																			1 +
																			generatedImages.length) %
																		generatedImages.length;
																	setSelectedImageIndex(newIndex);
																	setHeaderImage(generatedImages[newIndex]);
																}}
																disabled={generatedImages.length <= 1}
															>
																Previous
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() => {
																	const newIndex =
																		(selectedImageIndex + 1) %
																		generatedImages.length;
																	setSelectedImageIndex(newIndex);
																	setHeaderImage(generatedImages[newIndex]);
																}}
																disabled={generatedImages.length <= 1}
															>
																Next
															</Button>
														</div>
													</div>
												)}
											</div>
											<Image
												src={headerImage}
												alt="Blog post header"
												width={800}
												height={400}
												className="w-full rounded-lg"
											/>
										</div>
									)}

									<Button
										onClick={generateHeaderImage}
										disabled={loading}
										className="w-full"
										variant={generatedImages.length > 0 ? 'outline' : 'default'}
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Generating Image
											</>
										) : generatedImages.length > 0 ? (
											'Generate Another Image'
										) : (
											'Generate Header Image'
										)}
									</Button>

									{generatedImages.length > 0 && (
										<Button onClick={() => setStep(5)} className="w-full mt-4">
											Next: Preview Blog Post
										</Button>
									)}
								</div>
							)}

							{step === 5 && (
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-medium">
											Final Blog Post Preview
										</h3>
										<div className="flex items-center space-x-2">
											<Label htmlFor="show-markdown-final" className="text-sm">
												Show Raw Markdown
											</Label>
											<Switch
												id="show-markdown-final"
												checked={showRawMarkdown}
												onCheckedChange={setShowRawMarkdown}
											/>
										</div>
									</div>

									{showRawMarkdown ? (
										<div className="font-mono text-sm border rounded-lg p-4 bg-card whitespace-pre-wrap">
											{blogPost}
										</div>
									) : (
										<div className="prose prose-stone dark:prose-invert max-w-none">
											{/* Header Image */}
											<div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
												<Image
													src={headerImage}
													alt="Blog post header"
													fill
													className="object-cover"
												/>
											</div>

											{/* Metadata */}
											<div className="flex items-center gap-2 text-muted-foreground mb-8">
												<time>{new Date().toLocaleDateString()}</time>
												<span>•</span>
												<span>5 min read</span>
											</div>

											{/* Rendered Markdown Content */}
											<ReactMarkdown
												remarkPlugins={[remarkGfm, remarkBreaks]}
												rehypePlugins={[rehypeRaw, rehypeSanitize]}
												components={{
													h1: ({ ...props }) => (
														<h1
															className="text-3xl font-bold mt-8 mb-4"
															{...props}
														/>
													),
													h2: ({ ...props }) => (
														<h2
															className="text-2xl font-semibold mt-6 mb-4"
															{...props}
														/>
													),
													h3: ({ ...props }) => (
														<h3
															className="text-xl font-semibold mt-4 mb-3"
															{...props}
														/>
													),
													h4: ({ ...props }) => (
														<h4
															className="text-lg font-semibold mt-4 mb-2"
															{...props}
														/>
													),
													p: ({ ...props }) => (
														<p
															className="text-lg leading-relaxed mb-4"
															{...props}
														/>
													),
													ul: ({ ...props }) => (
														<ul
															className="list-disc pl-6 mb-4 space-y-2"
															{...props}
														/>
													),
													ol: ({ ...props }) => (
														<ol
															className="list-decimal pl-6 mb-4 space-y-2"
															{...props}
														/>
													),
													li: ({ ...props }) => (
														<li className="leading-relaxed" {...props} />
													),
													blockquote: ({ ...props }) => (
														<blockquote
															className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
															{...props}
														/>
													),
													code: ({
														inline,
														className,
														children,
														...props
													}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
													any) => {
														const match = /language-(\w+)/.exec(
															className || ''
														);
														return !inline ? (
															<pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
																<code
																	className={
																		className ? `language-${match?.[1]}` : ''
																	}
																	{...props}
																>
																	{children}
																</code>
															</pre>
														) : (
															<code
																className="bg-muted px-1.5 py-0.5 rounded text-sm"
																{...props}
															>
																{children}
															</code>
														);
													},
													table: ({ ...props }) => (
														<div className="my-4 w-full overflow-x-auto">
															<table
																className="w-full border-collapse"
																{...props}
															/>
														</div>
													),
													th: ({ ...props }) => (
														<th
															className="border border-muted px-4 py-2 bg-muted font-semibold text-left"
															{...props}
														/>
													),
													td: ({ ...props }) => (
														<td
															className="border border-muted px-4 py-2"
															{...props}
														/>
													),
													a: ({ ...props }) => (
														<a
															className="text-primary hover:underline"
															{...props}
														/>
													),
													img: ({ src, alt }) => (
														<div className="relative w-full h-64 my-4">
															<Image
																src={src || ''}
																alt={alt || 'Blog post image'}
																fill
																className="rounded-lg object-cover"
															/>
														</div>
													),
													hr: () => <hr className="my-8 border-muted" />,
												}}
											>
												{blogPost}
											</ReactMarkdown>
										</div>
									)}

									{/* Action Buttons */}
									<div className="flex flex-col gap-2 mt-8">
										<Button
											className="w-full"
											variant="default"
											onClick={() => {
												toast({
													title: 'Coming Soon',
													description:
														'The ability to publish blog posts directly will be available in a future update.',
												});
											}}
										>
											Publish Blog Post
										</Button>
										<Button
											className="w-full"
											variant="outline"
											onClick={() => {
												// Create front matter
												const frontMatter = `---
title: '${selectedTitle}'
excerpt: '${blogPost
													.split('\n')
													.find(
														(line) => line.length > 0 && !line.startsWith('#')
													)
													?.slice(0, 150)}...'
coverImage: '${headerImage}'
date: '${new Date().toISOString()}'
author:
  name: 'Shubham Prakash'
  picture: '/blog/authors/shubham.jpg'
ogImage:
  url: '${headerImage}'
---
`;
												// Combine front matter with blog content
												const contentWithFrontMatter = frontMatter + blogPost;

												// Copy to clipboard
												navigator.clipboard.writeText(contentWithFrontMatter);
												toast({
													title: 'Copied to clipboard',
													description:
														'Blog post content with front matter has been copied to your clipboard.',
												});
											}}
										>
											Copy to Clipboard
										</Button>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-between">
							{step > 1 && (
								<Button variant="outline" onClick={() => setStep(step - 1)}>
									Back
								</Button>
							)}
							{step < 5 && step > 1 && (
								<Button
									onClick={() => setStep(step + 1)}
									disabled={
										(step === 2 && !selectedTitle) ||
										(step === 3 && !generatedPosts.length) ||
										(step === 4 && !generatedImages.length)
									}
								>
									Next
								</Button>
							)}
						</CardFooter>
					</Card>
				</div>
			</main>
			<Footer />
		</div>
	);
}
