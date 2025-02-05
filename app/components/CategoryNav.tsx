import { motion } from "framer-motion";

const categories = [
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
    items: [
      "Tape Measure",
      "Caliper",
      "Spirit Level",
      "Protractor",
      "Multimeter",
    ],
  },
  {
    name: "Cutting Tools",
    items: ["Utility Knife", "Hacksaw", "Wire Cutter", "Tin Snips", "Scissors"],
  },
  // First repeat
  {
    name: "Power Tools",
    items: ["Hammer", "Screwdriver", "Wrench", "Pliers", "Chisel"],
  },
  {
    name: "Measuring",
    items: ["Circular Saw", "Angle Grinder", "Impact Driver", "Heat Gun"],
  },
  {
    name: "Cutting Tools",
    items: [
      "Tape Measure",
      "Caliper",
      "Spirit Level",
      "Protractor",
      "Multimeter",
    ],
  },
  {
    name: "Hand Tools",
    items: ["Utility Knife", "Hacksaw", "Wire Cutter", "Tin Snips", "Scissors"],
  },
  // Second repeat
  {
    name: "Hand Tools",
    items: ["Circular Saw", "Angle Grinder", "Impact Driver", "Heat Gun"],
  },
  {
    name: "Power Tools",
    items: [
      "Tape Measure",
      "Caliper",
      "Spirit Level",
      "Protractor",
      "Multimeter",
    ],
  },
  {
    name: "Measuring",
    items: ["Utility Knife", "Hacksaw", "Wire Cutter", "Tin Snips", "Scissors"],
  },
  {
    name: "Cutting Tools",
    items: ["Hammer", "Screwdriver", "Wrench", "Pliers", "Chisel"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export default function CategoryNav() {
  return (
    <div className="w-full bg-white border-b">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex space-x-8 overflow-x-auto py-4">
          {categories.map((category, index) => (
            <motion.div
              key={`${category.name}-${index}`}
              className="flex-none"
              variants={itemVariants}
            >
              <motion.div
                className="font-medium text-gray-900 mb-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.name}
              </motion.div>
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <motion.li
                    key={`${item}-${index}-${itemIndex}`}
                    variants={listItemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <button className="text-gray-600 hover:text-gray-900 text-sm">
                      {item}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
