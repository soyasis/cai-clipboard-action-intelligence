import { Clipboard, showToast, Toast } from "@raycast/api";
import { ActionList } from "./components/ActionList";
import { detectContent } from "./detection";

export default async function SmartPaste() {
  let text: string;
  let source: "selection" | "clipboard";

  // Try to get text from clipboard
  const clipboardText = await Clipboard.readText();
  if (!clipboardText) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Nothing to process",
      message: "Clipboard is empty",
    });
    return;
  }

  text = clipboardText;
  source = "clipboard";

  // Detect content type
  const detection = await detectContent(text);

  // Show UI with actions
  return <ActionList text={text} detection={detection} source={source} />;
}
