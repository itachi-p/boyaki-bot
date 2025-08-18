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
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: commonPersona.trim() },
            { role: "user", content: message }
          ],
          max_completion_tokens: 128,
          response_format: { type: "text" }, // ← 強制的にテキスト形式で返す
        });

        const raw = completion.choices[0]?.message?.content ?? "";
        const responseText = raw.slice(0, 500);

        // デバッグログ
        console.log("=== API Debug Info ===");
        console.log("Model:", model);
        console.log(
          "Tokens: input=%d, output=%d, total=%d",
          completion.usage?.prompt_tokens,
          completion.usage?.completion_tokens,
          completion.usage?.total_tokens
        );
        console.log("Response text:", responseText);
        if (!responseText) {
          console.warn("⚠️ 空レスポンス（raw出力）");
          // console.dir(completion, { depth: null });
          console.log(JSON.stringify(completion, null, 2));
        }
        return {
          model,
          response: responseText
        };
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
