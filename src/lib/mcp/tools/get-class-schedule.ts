import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { schedule, weekDays, type WeekDay } from "../data";

export default defineTool({
  name: "get_class_schedule",
  title: "Get class schedule",
  description:
    "Get the weekly yoga class timetable: class name, time, audience, duration, instructor and available spots. Optionally filter by day and audience.",
  inputSchema: {
    day: z
      .enum(weekDays)
      .optional()
      .describe("Optional day of the week, e.g. 'Monday'. Omit for the whole week."),
    audience: z
      .string()
      .trim()
      .optional()
      .describe("Optional audience filter, e.g. 'Kids', 'Teens', 'Adults', 'Seniors'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ day, audience }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const days: WeekDay[] = day ? [day] : [...weekDays];
    const result = days.map((d) => ({
      day: d,
      classes: schedule[d].filter(
        (c) => !audience || c.audience.toLowerCase().includes(audience.toLowerCase()),
      ),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { schedule: result },
    };
  },
});
