import { openai } from "../config/openai";

export const generateAIText = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return (
    completion.choices?.[0]?.message?.content
      ?.trim()
      .replace(/[`"\n]/g, "") || ""
  );
};