import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { programs } from "../data";

export default defineTool({
  name: "list_programs",
  title: "List yoga programs",
  description:
    "List the age-specific yoga programs offered by the studio (Kids, Teens, Adults, Seniors), with age range, duration, capacity and weekly timing.",
  inputSchema: {
    ageGroup: z
      .enum(["kids", "teens", "adults", "seniors"])
      .optional()
      .describe("Optional age group to filter by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ ageGroup }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const rows = ageGroup ? programs.filter((p) => p.id === ageGroup) : programs;
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { programs: rows },
    };
  },
});
