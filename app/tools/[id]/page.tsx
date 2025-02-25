import { getToolById } from "@/db/utils";
import ToolCheckoutClient from "./ToolCheckoutClient";
import Navbar from "../../components/Navbar";
import Image from "next/image";

interface ToolDetailsProps {
  params: {
    id: string;
  };
}

export default async function ToolDetails({ params }: ToolDetailsProps) {
  const { id } = params;
  const tool = await getToolById(parseInt(id));

  if (!tool) {
    return <div className="p-8 text-center text-red-500">Tool not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={tool.image_url}
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
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
