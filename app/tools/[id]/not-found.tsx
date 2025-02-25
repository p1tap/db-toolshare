import Link from 'next/link';

export default function ToolNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h2>
        <p className="text-gray-700 mb-6">
          The tool you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/tools" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Browse Available Tools
        </Link>
      </div>
    </div>
  );
} 