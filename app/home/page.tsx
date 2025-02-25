import { getTools } from "@/db/utils";
import CategoryNav from "../components/CategoryNav";
import ToolCard from "../components/ToolCard";
import { Tool } from "@/db/utils";

// Move categories to a shared constant
export const categories = [
  {
    name: "Hand Tools",
    items: ["Hammer", "Screwdriver", "Wrench", "Pliers", "Chisel"],
  },
  {
    name: "Power Tools",
    items: ["Circular Saw", "Angle Grinder", "Impact Driver", "Heat Gun"],
  },
  {
    name: "Measuring",
    items: ["Tape Measure", "Caliper", "Spirit Level", "Protractor", "Multimeter"],
  },
  {
    name: "Cutting Tools",
    items: ["Utility Knife", "Hacksaw", "Wire Cutter", "Tin Snips", "Scissors"],
  }
];

// Map of default images for tool types
const defaultToolImages: { [key: string]: string } = {
  "Power Drill": "/images/tools/powerdrill.jpg",
  "Updated Power Drill": "/images/tools/powerdrill.jpg",
  "Hammer": "/images/tools/hammer.jpg",
  "Wrench Set": "/images/tools/wrench-set.jpg",
  "Circular Saw": "/images/tools/circular-saw.jpg",
  "Measuring Tape": "/images/tools/measuring-tape.jpg",
  "Screwdriver Set": "/images/tools/screwdiver-set.jpg",
  "Level": "/images/tools/leveling-tool.jpg",
  "Pliers": "/images/tools/piler.jpg",
  "Wire Cutter": "/images/tools/wire-cutter.jpg",
  "Heat Gun": "/images/tools/Heat-gun.jpg",
};

// Helper function to get image for a tool
function getToolImage(tool: Tool): string {
  // First try exact match
  if (defaultToolImages[tool.name]) {
    return defaultToolImages[tool.name];
  }
  
  // If no exact match, try to find by partial match
  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes('drill')) {
    return "/images/tools/powerdrill.jpg";
  }
  
  // Default fallback
  return "/images/tools/hammer.jpg";
}

export default async function HomePage() {
  const tools = await getTools();

  // Add default images if not provided
  const toolsWithImages = tools.map(tool => ({
    ...tool,
    image_url: tool.image_url || getToolImage(tool)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryNav initialCategories={categories} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {toolsWithImages.map((tool) => (
            <div key={tool.id}>
              <ToolCard 
                id={tool.id} 
                name={tool.name} 
                cost={tool.price_per_day}
                image={tool.image_url}
                description={tool.description}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
