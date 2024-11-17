import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	try {
		const { topic, apiKey } = await request.json();

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'OpenAI API key is required' },
				{ status: 400 }
			);
		}

		if (!topic) {
			return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
		}

		const openai = new OpenAI({
			apiKey: apiKey,
		});

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that generates engaging blog post titles.',
				},
				{
					role: 'user',
					content: `Generate 10 creative, engaging, and SEO-friendly blog post titles about "${topic}".
                   Make them diverse in style (how-to, listicles, thought leadership, etc.).
                   Return only the titles, one per line, without numbering or dashes.`,
				},
			],
			model: 'gpt-3.5-turbo',
		});

		const titlesText = completion.choices[0].message.content;
		const titles = titlesText
			?.split('\n')
			.filter((title) => title.trim() !== '');

		return NextResponse.json({ titles });
	} catch (error) {
		console.error('Error generating titles:', error);
		return NextResponse.json(
			{ error: 'Failed to generate titles' },
			{ status: 500 }
		);
	}
}
