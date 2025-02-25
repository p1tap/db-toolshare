import Navbar from "../../components/Navbar";
import Image from "next/image";
import ToolCheckoutClient from "./ToolCheckoutClient";
import { notFound } from "next/navigation";
import { mockTools, Tool } from "@/app/data/mockTools";

interface ToolDetailsProps {
  params: {
    id: string;
  };
}

// Server-side function to fetch tool data
async function getToolData(id: string): Promise<{ tool: Tool | null, isMockData: boolean }> {
  try {
    // First try to get the tool from the database via API
    const res = await fetch(`http://localhost:3000/api/tools/${id}`, {
      cache: 'no-store',
      next: { tags: [`tool-${id}`] }
    });
    
    if (res.ok) {
      const tool = await res.json();
      return { tool, isMockData: false };
    }
    
    // If API fails, fall back to mock data
    console.log("API failed, falling back to mock data");
    const toolId = parseInt(id);
    if (!isNaN(toolId)) {
      const mockTool = mockTools.find(t => t.id === toolId);
      if (mockTool) return { tool: mockTool, isMockData: true };
    }
    
    return { tool: null, isMockData: false };
  } catch (error) {
    console.error("Error fetching tool data:", error);
    
    // Fall back to mock data if API call fails
    const toolId = parseInt(id);
    if (!isNaN(toolId)) {
      const mockTool = mockTools.find(t => t.id === toolId);
      if (mockTool) return { tool: mockTool, isMockData: true };
    }
    
    return { tool: null, isMockData: false };
  }
}

export default async function ToolDetails({ params }: ToolDetailsProps) {
  const { id } = await params;
  
  // Try to get the tool from the API first
  const { tool, isMockData } = await getToolData(id);
  
  if (!tool) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isMockData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              Note: Showing mock data for demonstration purposes.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={tool.image_url || "/images/tools/hammer.jpg"}
                alt={tool.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {tool.name}
            </h1>

            {/* Details Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detail</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Rental Details Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Details</h2>
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600">
                  ${tool.price_per_day}/day
                </p>
              </div>

              <ToolCheckoutClient 
                toolId={tool.id}
                toolName={tool.name}
                pricePerDay={tool.price_per_day}
                useMockData={isMockData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
