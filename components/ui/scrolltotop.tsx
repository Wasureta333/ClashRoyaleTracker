"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra il pulsante quando si scorre oltre 200px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Funzione per tornare in cima
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-5 right-5 z-50"
    >
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          whileTap={{ scale: 0.85 }} // Effetto "pop" quando premuto
          whileHover={{ scale: 1.1 }} // Effetto leggero quando si passa sopra
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="rounded-full p-2 shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
        >
          <ArrowUp className="h-6 w-6 text-black dark:text-white" />
        </motion.button>
      )}
    </motion.div>
  );
}