import { Clipboard, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { ActionList } from "./components/ActionList";
import { detectContent } from "./detection";
import { ContentResult } from "./detection/types";

export default function SmartPaste() {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState<string>("");
  const [detection, setDetection] = useState<ContentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClipboard() {
      try {
        const clipboardText = await Clipboard.readText();
        if (!clipboardText) {
          setError("Clipboard is empty");
          await showToast({
            style: Toast.Style.Failure,
            title: "Nothing to process",
            message: "Clipboard is empty",
          });
          setIsLoading(false);
          return;
        }

        setText(clipboardText);
        const result = await detectContent(clipboardText);
        setDetection(result);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to read clipboard");
        setIsLoading(false);
      }
    }

    loadClipboard();
  }, []);

  if (isLoading) {
    return <List isLoading={true} />;
  }

  if (error || !detection) {
    return <List><List.EmptyView title={error || "Failed to process"} /></List>;
  }

  return <ActionList text={text} detection={detection} source="clipboard" />;
}
