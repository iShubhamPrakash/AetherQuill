import { Feather } from 'lucide-react';
import Link from 'next/link';
import Settings from './Settings';

export default function Navigation() {
	return (
		<header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center border-b">
			<Link className="flex items-center justify-center" href="/">
				<Feather className="h-6 w-6 text-primary" />
				<span className="ml-2 text-2xl font-bold">AetherQuill</span>
			</Link>
			<nav className="ml-auto flex items-center gap-4 sm:gap-6">
				<Link
					className="text-sm font-medium hover:underline underline-offset-4"
					href="/#features"
				>
					Features
				</Link>
				<Link
					className="text-sm font-medium hover:underline underline-offset-4"
					href="/#how-it-works"
				>
					How It Works
				</Link>
				<Link
					className="text-sm font-medium hover:underline underline-offset-4"
					href="/#get-started"
				>
					Get Started
				</Link>
				<Settings />
			</nav>
		</header>
	);
}
