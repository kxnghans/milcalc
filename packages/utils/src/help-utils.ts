import { supabase } from "./supabaseClient";

type HelpTableName =
  | "pt_help_details"
  | "pay_help_details"
  | "retirement_help_details"
  | "best_score_help_details";

export const getHelpContentFromSource = async (
  source: "pt" | "pay" | "retirement" | "best_score",
  contentKey: string,
) => {
  let tableName: HelpTableName;
  switch (source) {
    case "pt":
      tableName = "pt_help_details";
      break;
    case "pay":
      tableName = "pay_help_details";
      break;
    case "retirement":
      tableName = "retirement_help_details";
      break;
    case "best_score":
      tableName = "best_score_help_details";
      break;
    default:
      return null;
  }

  const queryColumn = source === "pay" ? "title" : "content_key";
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(queryColumn, contentKey);

  if (error) {
    console.error(
      `Error fetching help content from ${tableName} for key ${contentKey}:`,
      error,
    );
    return null;
  }

  return data;
};
