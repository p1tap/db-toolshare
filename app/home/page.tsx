import { getTools } from "@/db/utils";
import CategoryNav from "../components/CategoryNav";
import ToolCard from "../components/ToolCard";

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

export default async function HomePage() {
  const tools = await getTools();

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryNav initialCategories={categories} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tools.map((tool) => (
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
