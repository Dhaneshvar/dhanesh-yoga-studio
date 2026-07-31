import { defineTool } from "@lovable.dev/mcp-js";
import { studioInfo } from "../data";

export default defineTool({
  name: "get_studio_info",
  title: "Get studio info",
  description:
    "Get an overview of Dhanesh Yoga Center: what it offers, the pages available on the site, and how to get in touch.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(studioInfo, null, 2) }],
      structuredContent: { studio: studioInfo },
    };
  },
});
