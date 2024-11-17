import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	try {
		const { title, apiKey } = await request.json();

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'Replicate API key is required' },
				{ status: 400 }
			);
		}

		if (!title) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		const replicate = new Replicate({
			auth: apiKey,
		});

		// Create a prediction first
		const prediction = await replicate.predictions.create({
			version:
				'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
			input: {
				prompt: `A professional blog header image for an article titled "${title}". Modern, minimalist, high quality, professional photography, 4k resolution, detailed lighting`,
				negative_prompt: 'text, watermark, low quality, blurry, distorted',
				width: 1024,
				height: 576,
				num_outputs: 1,
				num_inference_steps: 50,
				guidance_scale: 7.5,
				scheduler: 'DPMSolverMultistep',
			},
		});

		// Wait for the prediction to complete
		let imageUrl = null;
		while (!imageUrl) {
			const result = await replicate.predictions.get(prediction.id);

			if (result.status === 'succeeded') {
				// The output should be an array with one URL
				imageUrl = result.output?.[0];
				break;
			} else if (result.status === 'failed') {
				throw new Error('Image generation failed');
			}

			// Wait for a second before checking again
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		if (!imageUrl) {
			throw new Error('No image URL in the response');
		}

		console.log('Generated image URL:', imageUrl); // Debug log
		return NextResponse.json({ imageUrl });
	} catch (error) {
		console.error('Detailed error in image generation:', error);
		return NextResponse.json(
			{
				error: 'Failed to generate image',
				details:
					error instanceof Error ? error.message : 'Unknown error occurred',
				debug: error instanceof Error ? error.stack : null,
			},
			{ status: 500 }
		);
	}
}
