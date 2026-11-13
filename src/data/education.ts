/**
 * Education Data
 *
 * One degree, one honor, one certification, rendered by the About
 * section as a ledger row. Edit the strings here; no JSX changes.
 */

export interface Education {
  school: string;
  degree: string;
  /** Left column of the ledger row */
  detail: string;
  honor: string;
  certification: { name: string; issuer: string };
}

export const education: Education = {
  school: "California Polytechnic State University, San Luis Obispo",
  degree: "Bachelor of Science in Computer Science, Minor in Philosophy",
  detail: "Graduated Aug 2025",
  honor: "Dean's List — Fall 2024 & Spring 2025 (Senior Year)",
  certification: {
    name: "AWS Academy Cloud Security Foundations",
    issuer: "Amazon Web Services, Dec 2024",
  },
};
