import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white z-50">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_60%)] blur-3xl animate-pulse"></div>

      {/* Loader container */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Glowing rotating ring */}
        <motion.div
          className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-pink-400 p-[3px] shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
            {/* Center icon */}
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-sky-400/20 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="white"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l9-4 9 4M4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Text section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <h1 className="text-xl font-semibold tracking-tight">
            RoomBookKro Admin
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Preparing your dashboard...
          </p>
        </motion.div>

        {/* Progress shimmer bar */}
        <div className="relative w-56 h-1 mt-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-pink-400"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";

// const Loader = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const interval = setInterval(() => {
//       start += 1;
//       setProgress(start);
//       if (start >= 100) clearInterval(interval);
//     }, 20); // 20ms * 100 = 2000ms => 2 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
//       {/* Spinning Ring */}
//       <div className="relative w-20 h-20">
//         <div className="absolute inset-0 rounded-full border-8 border-t-transparent border-b-transparent border-blue-500 animate-spin"></div>
//         <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-b-transparent border-purple-500 animate-spin-slow"></div>
//       </div>

//       {/* Text */}
//       <h2 className="mt-6 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
//         Loading Dashboard...
//       </h2>

//       {/* Progress Bar */}
//       <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
//         <div
//           className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>
//       <span className="mt-2 text-sm text-gray-500 dark:text-gray-300">
//         {progress}%
//       </span>
//     </div>
//   );
// };

// export default Loader;
