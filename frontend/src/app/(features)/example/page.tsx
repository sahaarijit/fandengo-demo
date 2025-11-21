import { ExampleList } from './components/ExampleList'
import { Code2 } from 'lucide-react'
import Link from 'next/link'

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Example Feature
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Feature-based CRUD demonstration
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Feature-Based Architecture
          </h2>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This example feature demonstrates the feature-based folder structure with colocated components,
            services, and types. All feature-specific code lives together in the{' '}
            <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs">
              app/(features)/example/
            </code>{' '}
            directory.
          </p>
        </div>

        <ExampleList />
      </main>
    </div>
  )
}
