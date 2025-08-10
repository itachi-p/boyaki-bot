import { NextResponse } from "next/server";
import OpenAI from "openai";
import { commonPersona } from "@/lib/commonPersona";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const models = ["gpt-5", "gpt-5-mini"] as const;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const results = await Promise.all(
      models.map(async (model) => {
        const start = Date.now();
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: commonPersona.trim() },
            { role: "user", content: message }
          ],
          max_completion_tokens: 150,
        });
        const end = Date.now();
        const usage = completion.usage;
        console.log(
          `[${model}] Time: ${end - start}ms, Tokens:`,
          usage
            ? `input=${usage.prompt_tokens}, output=${usage.completion_tokens}, total=${usage.total_tokens}`
            : "N/A"
        );
        return {
          model,
          response: completion.choices[0]?.message?.content || ""
        };
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
