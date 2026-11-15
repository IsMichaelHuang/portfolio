import styles from "./Figure.module.css";

interface Props {
  value: string;
  unit?: string;
  size: "hero" | "row" | "band";
  /** Hide from assistive tech when the number is repeated nearby. */
  decorative?: boolean;
}

/** One very large number with an optional unit beside it. */
function Figure({ value, unit, size, decorative }: Props) {
  const spoken = value.replace(/^~/, "about ");
  return (
    <p
      className={styles.figure}
      data-figure
      data-size={size}
      aria-hidden={decorative ? "true" : undefined}
    >
      <span className="sr-only">{spoken}</span>
      <span className={styles.numeral} aria-hidden="true">
        {value}
      </span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </p>
  );
}

export default Figure;
