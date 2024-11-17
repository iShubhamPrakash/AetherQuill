'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OPENAI_KEY, REPLICATE_KEY } from '@/congif/constants';

export default function Settings() {
	const [openAIKey, setOpenAIKey] = useState('');
	const [replicateKey, setReplicateKey] = useState('');
	const [open, setOpen] = useState(false);

	useEffect(() => {
		// Load keys from localStorage when component mounts
		const savedOpenAIKey = localStorage.getItem(OPENAI_KEY) || '';
		const savedReplicateKey = localStorage.getItem(REPLICATE_KEY) || '';
		setOpenAIKey(savedOpenAIKey);
		setReplicateKey(savedReplicateKey);
	}, []);

	const handleSave = () => {
		// Save both keys to localStorage
		localStorage.setItem(OPENAI_KEY, openAIKey);
		localStorage.setItem(REPLICATE_KEY, replicateKey);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2 className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Settings</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>API Settings</DialogTitle>
					<DialogDescription>
						Configure your API keys for AI services
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="openai">OpenAI API Key</Label>
						<Input
							id="openai"
							type="password"
							value={openAIKey}
							onChange={(e) => setOpenAIKey(e.target.value)}
							placeholder="sk-..."
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="replicate">Replicate API Key</Label>
						<Input
							id="replicate"
							type="password"
							value={replicateKey}
							onChange={(e) => setReplicateKey(e.target.value)}
							placeholder="r-..."
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
