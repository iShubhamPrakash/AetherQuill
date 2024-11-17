'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '../config/constants';

export default function APIKeyStoreWidget() {
	const router = useRouter();
	const { toast } = useToast();
	const [openAIKey, setOpenAIKey] = useState('');
	const [replicateKey, setReplicateKey] = useState('');

	useEffect(() => {
		const savedOpenAIKey = localStorage.getItem(LOCAL_STORAGE_KEYS.OPENAI_KEY);
		const savedReplicateKey = localStorage.getItem(LOCAL_STORAGE_KEYS.REPLICATE_KEY);

		if (savedOpenAIKey) setOpenAIKey(savedOpenAIKey);
		if (savedReplicateKey) setReplicateKey(savedReplicateKey);
	}, []);

	const handleSaveKeys = () => {
		localStorage.setItem(LOCAL_STORAGE_KEYS.OPENAI_KEY, openAIKey);
		localStorage.setItem(LOCAL_STORAGE_KEYS.REPLICATE_KEY, replicateKey);

		toast({
			title: 'API Keys Stored Successfully',
			description:
				"Don't worry! Your API keys are stored securely in your browser's local storage and never leave your device.",
			duration: 5000,
		});

		router.push('/write');
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Get Your API Keys</CardTitle>
				<CardDescription>
					You&apos;ll need these to use AetherQuill:
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						htmlFor="openai-key"
					>
						OpenAI API Key
					</label>
					<Input
						id="openai-key"
						placeholder="Enter your OpenAI API key"
						value={openAIKey}
						onChange={(e) => setOpenAIKey(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						htmlFor="replicate-key"
					>
						Replicate API Key
					</label>
					<Input
						id="replicate-key"
						placeholder="Enter your Replicate API key"
						value={replicateKey}
						onChange={(e) => setReplicateKey(e.target.value)}
					/>
				</div>
				<Button className="w-full" onClick={handleSaveKeys}>
					<Key className="mr-2 h-4 w-4" />
					Save API Keys
				</Button>
			</CardContent>
		</Card>
	);
}
