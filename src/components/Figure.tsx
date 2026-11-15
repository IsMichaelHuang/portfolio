import { useLayoutEffect, useRef } from "react";
import { countFrame } from "../lib/figure";
import styles from "./Figure.module.css";

interface Props {
  value: string;
  unit?: string;
  size: "hero" | "row" | "band";
  /** Hide from assistive tech when the number is repeated nearby. */
  decorative?: boolean;
}

const DURATION = 800;
const ease = (t: number) => 1 - (1 - t) ** 3;

/** One very large number with an optional unit beside it. */
function Figure({ value, unit, size, decorative }: Props) {
  const spoken = value.replace(/^~/, "about ");
  const approx = value.startsWith("~");
  const numeral = useRef<HTMLSpanElement>(null);

  // The text node holding the digits is updated directly: the
  // rendered value stays the final one, so React never fights it.
  useLayoutEffect(() => {
    const node = numeral.current?.lastChild;
    if (
      !node ||
      !window.matchMedia ||
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      countFrame(value, 0) === value
    ) {
      return;
    }
    const show = (s: string) => {
      node.textContent = approx ? s.slice(1) : s;
    };
    let raf = 0;
    const run = (start?: number) => (now: number) => {
      const from = start ?? now;
      const t = Math.min(1, (now - from) / DURATION);
      show(countFrame(value, ease(t)));
      if (t < 1) raf = requestAnimationFrame(run(from));
    };
    show(countFrame(value, 0));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.intersectionRatio >= 0.3)) return;
        io.disconnect();
        raf = requestAnimationFrame(run());
      },
      { threshold: 0.3 },
    );
    io.observe(numeral.current!);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      show(value);
    };
  }, [value, approx]);

  return (
    <p
      className={styles.figure}
      data-figure
      data-size={size}
      aria-hidden={decorative ? "true" : undefined}
    >
      <span className="sr-only">{spoken}</span>
      <span
        ref={numeral}
        className={styles.numeral}
        aria-hidden="true"
      >
        {approx && <span className={styles.approx}>~</span>}
        {approx ? value.slice(1) : value}
      </span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </p>
  );
}

export default Figure;
