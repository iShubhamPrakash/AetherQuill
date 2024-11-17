import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	try {
		const { title, apiKey } = await request.json();

		if (!title || !apiKey) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			);
		}

		const openai = new OpenAI({
			apiKey: apiKey,
		});

		const completion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{
					role: 'system',
					content:
						'You are a professional blog writer. Write detailed, well-structured blog posts with proper markdown formatting.',
				},
				{
					role: 'user',
					content: `Write a comprehensive blog post about: ${title}. Include proper markdown formatting with headers, subheaders, and relevant sections. Make it engaging and informative.`,
				},
			],
			temperature: 0.7,
			max_tokens: 2500,
		});

		const content = completion.choices[0]?.message?.content;

		if (!content) {
			return NextResponse.json(
				{ error: 'No content generated' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ content });
	} catch (error) {
		console.error('Blog generation error:', error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Failed to generate blog post',
			},
			{ status: 500 }
		);
	}
}
