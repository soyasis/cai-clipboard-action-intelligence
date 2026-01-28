import { Form, ActionPanel, Action, showToast, Toast, Clipboard, popToRoot } from "@raycast/api";
import { useState } from "react";
import { translate } from "../services/llm";

interface Props {
  text: string;
}

export function TranslateForm({ text }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { language: string }) {
    if (!values.language.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Please enter a language",
      });
      return;
    }

    setIsLoading(true);
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Translating...",
    });

    try {
      const translation = await translate(text, values.language);
      await Clipboard.copy(translation);
      toast.style = Toast.Style.Success;
      toast.title = `Translated to ${values.language}`;
      toast.message = "Copied to clipboard";
      await popToRoot();
    } catch {
      toast.style = Toast.Style.Failure;
      toast.title = "Translation failed";
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Translate" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="language"
        title="Target Language"
        placeholder="e.g., Greek, Hindi, Thai, etc."
        info="Enter any language name - the AI will understand it"
      />
      <Form.Description text={`Translating: "${text.substring(0, 100)}${text.length > 100 ? "..." : ""}"`} />
    </Form>
  );
}
