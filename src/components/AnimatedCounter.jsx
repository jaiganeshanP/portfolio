import { useState, useEffect } from "react";

export default function AnimatedCounter({ to, duration = 1800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = to / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);

  return <span>{count}</span>;
}
