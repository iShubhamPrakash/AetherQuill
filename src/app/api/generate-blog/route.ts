import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { title, apiKey } = await request.json();

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'OpenAI API key is required' },
				{ status: 400 }
			);
		}

		if (!title) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		const openai = new OpenAI({
			apiKey: apiKey,
		});

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a professional blog writer who creates engaging, well-structured content in markdown format.',
				},
				{
					role: 'user',
					content: `Write a detailed blog post with the title "${title}".
                   Include an introduction, several main points with subheadings, and a conclusion.
                   Format the content in markdown with proper headings (##), paragraphs, and bullet points where appropriate.
                   The content should be engaging, informative, and around 500-800 words.`,
				},
			],
			model: 'gpt-3.5-turbo',
			temperature: 0.7,
			max_tokens: 1500,
		});

		const blogContent = completion.choices[0].message.content;

		return NextResponse.json({ content: blogContent });
	} catch (error) {
		console.error('Error generating blog post:', error);
		return NextResponse.json(
			{ error: 'Failed to generate blog post' },
			{ status: 500 }
		);
	}
}
