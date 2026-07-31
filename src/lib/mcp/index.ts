import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProgramsTool from "./tools/list-programs";
import getClassScheduleTool from "./tools/get-class-schedule";
import searchAsanasTool from "./tools/search-asanas";
import getStudioInfoTool from "./tools/get-studio-info";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "dhanesh-yoga-studio",
  title: "Dhanesh Yoga Studio",
  version: "0.1.0",
  instructions:
    "Tools for Dhanesh Yoga Center. Use `get_studio_info` for an overview, `list_programs` for age-specific programs, `get_class_schedule` for the weekly timetable, and `search_asanas` to look up yoga poses with instructions and benefits.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getStudioInfoTool, listProgramsTool, getClassScheduleTool, searchAsanasTool],
});
