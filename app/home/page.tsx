"use client";

import CategoryNav from "../components/CategoryNav";
import ToolCard from "../components/ToolCard";
import { motion } from "framer-motion";

// Mock data for tools
const mockTools = [
  { id: 1, name: "Power Drill", cost: 25 },
  { id: 2, name: "Hammer", cost: 15 },
  { id: 3, name: "Wrench Set", cost: 35 },
  { id: 4, name: "Circular Saw", cost: 45 },
  { id: 5, name: "Measuring Tape", cost: 10 },
  { id: 6, name: "Screwdriver Set", cost: 20 },
  { id: 7, name: "Level", cost: 18 },
  { id: 8, name: "Pliers", cost: 12 },
  { id: 9, name: "Wire Cutter", cost: 15 },
  { id: 10, name: "Heat Gun", cost: 40 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategoryNav />
      </motion.div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {mockTools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <ToolCard id={tool.id} name={tool.name} cost={tool.cost} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
