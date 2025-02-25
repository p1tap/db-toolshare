export interface Tool {
  id: number;
  name: string;
  price_per_day: number;
  description: string;
  image_url: string;
  owner_id: number;
  status: "active" | "inactive";
  created_at: string;
  owner_name?: string;
}

export const mockTools: Tool[] = [
  {
    id: 1,
    name: "Power Drill",
    price_per_day: 15,
    description: "High-powered drill perfect for home projects. Includes multiple drill bits.",
    image_url: "/images/tools/powerdrill.jpg",
    owner_id: 1,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "John Doe"
  },
  {
    id: 2,
    name: "Hammer",
    price_per_day: 5,
    description: "Standard claw hammer for general use.",
    image_url: "/images/tools/hammer.jpg",
    owner_id: 1,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "John Doe"
  },
  {
    id: 3,
    name: "Wrench Set",
    price_per_day: 10,
    description: "Complete set of wrenches in various sizes.",
    image_url: "/images/tools/wrench-set.jpg",
    owner_id: 2,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "Jane Smith"
  },
  {
    id: 4,
    name: "Circular Saw",
    price_per_day: 20,
    description: "Powerful circular saw for cutting wood and other materials.",
    image_url: "/images/tools/circular-saw.jpg",
    owner_id: 2,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "Jane Smith"
  },
  {
    id: 5,
    name: "Measuring Tape",
    price_per_day: 3,
    description: "25-foot measuring tape with both imperial and metric measurements.",
    image_url: "/images/tools/measuring-tape.jpg",
    owner_id: 3,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "Bob Johnson"
  },
  {
    id: 11,
    name: "Hammer XL",
    price_per_day: 8,
    description: "Extra large hammer for heavy-duty projects.",
    image_url: "/images/tools/hammer.jpg",
    owner_id: 1,
    status: "active",
    created_at: new Date().toISOString(),
    owner_name: "John Doe"
  }
];

export function getMockToolById(id: number): Tool | undefined {
  return mockTools.find(tool => tool.id === id);
} 