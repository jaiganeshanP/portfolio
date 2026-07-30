import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px", amount: threshold });
  return { ref, isInView };
}
