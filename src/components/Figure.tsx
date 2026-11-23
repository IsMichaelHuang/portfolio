import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { countFrame, figureWidth } from "../lib/figure";
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

/** Is at least 30% of the element inside the viewport right now? */
function inView(el: Element) {
  const r = el.getBoundingClientRect();
  const w = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
  const h = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
  return w > 0 && h > 0 && w * h >= 0.3 * r.width * r.height;
}

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
    // Only a figure that is counting shows anything but its value.
    const begin = () => {
      show(countFrame(value, 0));
      raf = requestAnimationFrame(run());
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.intersectionRatio >= 0.3)) return;
        io.disconnect();
        begin();
      },
      { threshold: 0.3 },
    );
    // Already in view at mount: no frame at the final value first.
    if (inView(numeral.current!)) begin();
    else io.observe(numeral.current!);
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
      style={
        size === "row"
          ? ({ "--w": figureWidth(value) } as CSSProperties)
          : undefined
      }
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
