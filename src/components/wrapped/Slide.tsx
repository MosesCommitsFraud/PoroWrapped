'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideProps {
      children: ReactNode;
      isActive: boolean;
      direction: number;
}

export default function Slide({ children, isActive, direction }: SlideProps) {
      const variants = {
            enter: (direction: number) => ({
                  x: direction > 0 ? 1000 : -1000,
                  opacity: 0,
            }),
            center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1,
            },
            exit: (direction: number) => ({
                  zIndex: 0,
                  x: direction < 0 ? 1000 : -1000,
                  opacity: 0,
            }),
      };

      return (
            <motion.div
                  className="absolute inset-0 w-full h-full flex items-center justify-center p-8"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate={isActive ? "center" : "exit"}
                  exit="exit"
                  transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                  }}
                  style={{ display: isActive ? 'flex' : 'none' }} // Simple optimization
            >
                  {children}
            </motion.div>
      );
}
