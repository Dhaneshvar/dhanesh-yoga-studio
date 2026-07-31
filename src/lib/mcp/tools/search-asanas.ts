import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { asanas } from "../data";

export default defineTool({
  name: "search_asanas",
  title: "Search asana library",
  description:
    "Search the studio's asana (yoga pose) library by name, difficulty or category. Returns instructions, benefits and breathing cues.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Free-text match against the Sanskrit name, English name or description."),
    difficulty: z
      .enum(["Beginner", "Intermediate", "Advanced"])
      .optional()
      .describe("Optional difficulty filter."),
    category: z
      .string()
      .trim()
      .optional()
      .describe("Optional category filter, e.g. 'Standing', 'Balance', 'Backbend', 'Resting'."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum results, default 10."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, difficulty, category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const q = query?.toLowerCase();
    const rows = asanas
      .filter((a) => !difficulty || a.difficulty === difficulty)
      .filter((a) => !category || a.category.toLowerCase() === category.toLowerCase())
      .filter(
        (a) =>
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.english.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      )
      .slice(0, limit ?? 10);

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { asanas: rows, count: rows.length },
    };
  },
});
