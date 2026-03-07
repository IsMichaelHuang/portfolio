/**
 * Project Data — Auto-generated
 *
 * This file is written by scripts/fetch-pinned.ts at build time.
 * It pulls pinned repositories from GitHub so the portfolio stays
 * in sync without manual updates.
 *
 * DO NOT EDIT MANUALLY — changes will be overwritten on next build.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "discordbot",
    title: "DiscordBot",
    description:
      "Python Discord bot built with discord.py — supports music playback, custom commands, and server event handling.",
    tags: ["bot", "discord-py", "music", "python3"],
    repoUrl: "https://github.com/IsMichaelHuang/DiscordBot",
  },
  {
    id: "resumebuilder",
    title: "ResumeBuilder",
    description:
      "Modular LaTeX resume system — one master document with four tailored single-page versions for AI/ML, full-stack, backend, and general SWE roles.",
    tags: ["automation", "job-search", "latex", "python3", "resume", "shell"],
    repoUrl: "https://github.com/IsMichaelHuang/resumeBuilder",
  },
];
