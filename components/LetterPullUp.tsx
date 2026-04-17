"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import * as React from "react";

export function LetterPullUp({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split("");

  const pullupVariant = {
    initial: { y: 40, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // cubic-bezier bouncy easing
      },
    }),
  };

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} style={{ display: "contents" }}>
      {splittedText.map((current, i) => (
        <motion.span
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          custom={i}
          className={cn("inline", className)}
          style={{ display: "inline" }}
        >
          {current === " " ? "\u00A0" : current}
        </motion.span>
      ))}
    </span>
  );
}
