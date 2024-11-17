import { Github } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
			<p className="text-xs text-gray-500 dark:text-gray-400">
				© 2023 AetherQuill. All rights reserved.
			</p>
			<div className="sm:ml-auto flex gap-4 sm:gap-6">
				<a
					className="text-xs hover:underline underline-offset-4"
					href="https://github.com/nalandatechnology/aetherquill"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Github className="inline-block mr-1 h-3 w-3" />
					GitHub
				</a>
			</div>
		</footer>
	);
}
