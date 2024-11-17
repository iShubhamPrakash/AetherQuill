import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Settings2 } from 'lucide-react';
import APIKeyStoreWidget from './APIKeyStoreWidget';

export default function Settings() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2 className="h-5 w-5" />
					<span className="sr-only">Settings</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>API Settings</DialogTitle>
					<DialogDescription>
						Configure your API keys for AetherQuill services
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<APIKeyStoreWidget />
				</div>
			</DialogContent>
		</Dialog>
	);
}
