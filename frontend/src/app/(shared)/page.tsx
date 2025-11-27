import { Code2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			{/* Header */}
			<header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-600 rounded-lg">
							<Code2 className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MENN Stack Boilerplate</h1>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								MongoDB + Express + Next.js + Node.js with TypeScript
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Info Banner */}
				<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
					<h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Welcome to the MENN Stack Boilerplate</h2>
					<p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
						This is a production-ready boilerplate with feature-based architecture. The backend uses MongoDB + Mongoose with
						Express, and the frontend uses Next.js 16 with TypeScript and Shadcn UI.
					</p>
					<Link
						href="/example"
						className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
					>
						View Example Feature
					</Link>
				</div>

				{/* Tech Stack Info */}
				<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Backend</h3>
						<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
							<li>• Express.js + TypeScript</li>
							<li>• MongoDB + Mongoose</li>
							<li>• Zod Validation</li>
							<li>• Feature-based Structure</li>
						</ul>
					</div>

					<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Frontend</h3>
						<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
							<li>• Next.js 16 + React 19</li>
							<li>• TypeScript</li>
							<li>• Tailwind CSS + Shadcn UI</li>
							<li>• Fetch API Service Layer</li>
						</ul>
					</div>

					<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Architecture</h3>
						<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
							<li>• Feature-based Organization</li>
							<li>• Shared Components (Shadcn)</li>
							<li>• Clean Separation</li>
							<li>• Type Safety</li>
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
}
