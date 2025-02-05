import Link from "next/link";
import Image from "next/image";

interface ToolCardProps {
  id: number;
  name: string;
  cost: number;
}

export default function ToolCard({ id, name, cost }: ToolCardProps) {
  // Map tool names to their image paths
  const getImagePath = (toolName: string) => {
    const nameToPath: { [key: string]: string } = {
      "Power Drill": "/images/tools/powerdrill.jpg",
      Hammer: "/images/tools/hammer.jpg",
      "Wrench Set": "/images/tools/wrench-set.jpg",
      "Circular Saw": "/images/tools/circular-saw.jpg",
      "Measuring Tape": "/images/tools/measuring-tape.jpg",
      "Screwdriver Set": "/images/tools/screwdiver-set.jpg",
      Level: "/images/tools/leveling-tool.jpg",
      Pliers: "/images/tools/piler.jpg",
      "Wire Cutter": "/images/tools/wire-cutter.jpg",
      "Heat Gun": "/images/tools/Heat-gun.jpg",
    };
    return nameToPath[toolName] || "/file.svg"; // Fallback to file.svg if no match
  };

  return (
    <Link href={`/tools/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative h-48 bg-gray-100">
          <Image
            src={getImagePath(name)}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="text-gray-900 font-medium">{name}</div>
          <div className="text-gray-600">${cost}/day</div>
        </div>
      </div>
    </Link>
  );
}
