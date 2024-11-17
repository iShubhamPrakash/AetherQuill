import APIKeyStoreWidget from '@/components/APIKeyStoreWidget';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Feather, Github, Image as ImageIcon, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navigation />
			<main className="flex-1">
				<section className="mx-auto w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-orange-100 dark:from-gray-900 dark:to-gray-800">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Craft Brilliant Blogs with AI
								</h1>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									AetherQuill harnesses the power of AI to help you create
									compelling, informative blog posts in minutes. And the best
									part? It&apos;s completely free to use!
								</p>
							</div>
							<div className="space-x-4">
								<Button asChild>
									<Link href="/write">Get Started for Free</Link>
								</Button>
								<Button variant="outline" asChild>
									<a
										href="https://github.com/nalandatechnology/aetherquill"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Github className="mr-2 h-4 w-4" />
										View on GitHub
									</a>
								</Button>
							</div>
						</div>
					</div>
				</section>

				<section id="features" className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							Unleash Your Creativity
						</h2>
						<div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
							<Card>
								<CardHeader>
									<Zap className="h-8 w-8 text-primary mb-2" />
									<CardTitle>AI-Powered Content</CardTitle>
									<CardDescription>
										Generate engaging blog posts on any topic with the help of
										advanced AI.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<ImageIcon className="h-8 w-8 text-primary mb-2" />
									<CardTitle>Custom Header Images</CardTitle>
									<CardDescription>
										Create unique, eye-catching header images for each of your
										blog posts.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<Feather className="h-8 w-8 text-primary mb-2" />
									<CardTitle>Multiple Title Options</CardTitle>
									<CardDescription>
										Choose from a variety of AI-generated titles to perfectly
										capture your content.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				<section
					id="how-it-works"
					className="w-full py-12 md:py-24 lg:py-32 bg-orange-100 dark:bg-gray-800"
				>
					<div className="container px-4 md:px-6 mx-auto">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							How It Works
						</h2>
						<div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
								<div className="p-3 bg-primary text-primary-foreground rounded-full">
									<span className="text-2xl font-bold">1</span>
								</div>
								<h3 className="text-xl font-bold">Enter Your Topic</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Simply input your desired blog topic, and watch as AetherQuill
									springs into action.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
								<div className="p-3 bg-primary text-primary-foreground rounded-full">
									<span className="text-2xl font-bold">2</span>
								</div>
								<h3 className="text-xl font-bold">Choose a Title</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Select from multiple AI-generated titles that best fit your
									vision.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
								<div className="p-3 bg-primary text-primary-foreground rounded-full">
									<span className="text-2xl font-bold">3</span>
								</div>
								<h3 className="text-xl font-bold">Generate Content</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Our AI creates a well-structured, informative blog post based
									on your chosen title.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
								<div className="p-3 bg-primary text-primary-foreground rounded-full">
									<span className="text-2xl font-bold">4</span>
								</div>
								<h3 className="text-xl font-bold">Add Visual Appeal</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Generate a custom header image that perfectly complements your
									blog post.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Start Creating for Free
								</h2>
								<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
									AetherQuill is completely free to use. All you need are your
									own API keys to get started.
								</p>
							</div>
							<br />
							<div className="space-y-4">
								<APIKeyStoreWidget />
								<Button asChild className="mt-4">
									<Link href="/write">Start Writing</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
