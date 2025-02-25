'use client';

import Link from "next/link";
import Image from "next/image";

interface ToolCardProps {
  id: number;
  name: string;
  cost: number;
  image?: string;
  description?: string;
}

// Move image mapping outside component to avoid recreation
const toolImageMap: { [key: string]: string } = {
  "Power Drill": "/images/tools/powerdrill.jpg",
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

export default function ToolCard({ id, name, cost, image, description }: ToolCardProps) {
  const imageSrc = image || toolImageMap[name] || "/images/tools/hammer.jpg";

  return (
    <Link href={`/tools/${id}`} className="block">
      <div className="bg-white rounded-lg shadow">
        <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
          <Image
            src={imageSrc}
            alt={name}
            fill
            style={{
              objectFit: 'cover',
              borderTopLeftRadius: '0.5rem',
              borderTopRightRadius: '0.5rem',
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
          {description && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-lg font-bold text-blue-700">${cost}/day</p>
        </div>
      </div>
    </Link>
  );
}
