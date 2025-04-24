'use client';
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 10,
      staggerChildren: 0.2
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-black transition-colors">
      <motion.div
        className="max-w-2xl mx-auto text-center relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Background Text */}
        <div className="relative">
          <h1 className="text-[180px] md:text-[250px] font-bold tracking-tighter text-[#e6eaef]  leading-none select-none">
            <span className="inline-block">4</span>
            <span className="inline-block" style={{ marginLeft: "120px" }}>4</span>
          </h1>

          {/* Floating Robot */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            variants={floating}
            animate="animate"
          >
            {/* Robot SVG positioned over the 404 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Robot Head */}
                            <rect x="50" y="20" width="80" height="70" rx="10" fill="#3b66c4" />
                            <rect x="60" y="40" width="20" height="20" rx="10" fill="#ff7043" />
                            <rect x="100" y="40" width="20" height="20" rx="10" fill="#ff7043" />
                            <rect x="80" y="70" width="20" height="5" fill="#333" />
                            <path d="M95 45 L105 55 M105 45 L95 55" stroke="white" strokeWidth="4" />

                            {/* Antenna */}
                            <path d="M90 20 C90 10 100 5 105 0" stroke="#333" strokeWidth="3" />
                            <circle cx="105" cy="0" r="4" fill="#ff5252" />

                            {/* Robot Body */}
                            <rect x="60" y="90" width="60" height="70" rx="10" fill="#3b66c4" />

                            {/* Control Panel */}
                            <rect x="70" y="100" width="40" height="30" rx="5" fill="#e6eaef" />
                            <circle cx="85" cy="115" r="8" fill="#ff7043" />
                            <rect x="95" y="110" width="10" height="10" rx="2" fill="#ff7043" />

                            {/* Gear */}
                            <circle cx="85" cy="115" r="12" stroke="#ff7043" strokeWidth="2" strokeDasharray="2 2" />

                            {/* Arms */}
                            <rect x="40" y="100" width="20" height="10" rx="5" fill="#3b66c4" />
                            <rect x="120" y="100" width="20" height="10" rx="5" fill="#3b66c4" />
                            <path d="M40 105 C30 105 25 115 20 120" stroke="#a0b4d8" strokeWidth="5" />
                            <circle cx="20" cy="120" r="8" fill="#ff7043" />

                            {/* Legs */}
                            <path d="M70 160 C70 180 60 190 50 200" stroke="#a0b4d8" strokeWidth="8" />
                            <path d="M110 160 C110 180 120 190 130 200" stroke="#a0b4d8" strokeWidth="8" />
                            <rect x="40" y="195" width="20" height="10" rx="5" fill="#3b66c4" />
                            <rect x="120" y="195" width="20" height="10" rx="5" fill="#3b66c4" />

                            {/* Shadow */}
                            <ellipse cx="90" cy="210" rx="50" ry="10" fill="#e6eaef" />

                            {/* Stars */}
                            <path d="M140 140 L145 145 M140 145 L145 140" stroke="#ffcdd2" strokeWidth="2" />
                            <path d="M40 60 L45 65 M40 65 L45 60" stroke="#e6eaef" strokeWidth="2" />
                        </svg>
                    </div>
          </motion.div>
        </div>

        {/* Animated Text Content */}
        <motion.h2 className="text-4xl font-bold tracking-tight text-[#b0b8c4] dark:text-[#94a3b8] mt-[-20px] mb-8" variants={childVariants}>
          Lost in the Dev Jungle?
        </motion.h2>

        <motion.p className="text-[#b0b8c4] dark:text-[#64748b] text-xl mb-16" variants={childVariants}>
          Looks like you've taken a wrong turn on your learning path.
        </motion.p>

        <motion.p className="text-[#555] dark:text-[#cbd5e1] text-xl font-medium mb-8" variants={childVariants}>
          No worries — even pros hit dead ends. Let's get you back on track with roadmaps, quizzes, and dev wisdom.
        </motion.p>

        <motion.div variants={childVariants}>
          <Link
            href="/"
            className="inline-block bg-[#3b66c4] text-white font-bold py-4 px-8 rounded-full text-lg tracking-wide hover:bg-[#2c4e9c] transition-colors"
          >
            BACK TO ROADMAPS
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
