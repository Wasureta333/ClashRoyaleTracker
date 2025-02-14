"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center w-full mt-12">
      {/* Contenitore per il testo e l'immagine */}
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Testo animato */}
        <div className="absolute w-[700px] leading-tight mb-80">
          <motion.h1
            initial={{ opacity: 0, x: 230 }} // Arriva da destra
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="text-7xl font-extrabold text-white opacity-70"
          >
            The tracker you
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, x: -250 }} // Arriva da sinistra
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="text-7xl font-extrabold text-white opacity-70"
          >
            were looking for.
          </motion.h1>
        </div>

        {/* Immagine centrata */}
        <Image
          src="/knight.png"
          alt="Royale King"
          width={300}
          height={300}
          className="relative"
        />
      </div>
    </div>
  );
}
