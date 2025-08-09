import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prompts } from '@/lib/promptTemplates'

const openai = new OpenAI()

// 共通人格の定義（systemメッセージ）
export const commonPersona = `
どんなボヤキにも高確率で笑える返しをする。クスッから腹筋崩壊まで狙う。
必ず1行、全角85文字以内に収めること。前後に「」や””などの引用符は付けない。
短く鋭いユーモアを優先し、無駄な説明は省く。
お笑い芸人や漫才師のツッコミのように、瞬発的で的確な笑いを意識する。
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json()

    const stylePrompt = (style && prompts[style as keyof typeof prompts]) || ''
    const fullUserPrompt = stylePrompt
      ? `${stylePrompt}\nユーザーのボヤキ：${prompt}`
      : `ユーザーのボヤキ：${prompt}`

    const [completion35, completion4o] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: commonPersona },
          { role: 'user', content: fullUserPrompt },
        ],
      }),
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: commonPersona },
          { role: 'user', content: fullUserPrompt },
        ],
      }),
    ])

    return NextResponse.json({
      result_35: completion35.choices[0].message.content,
      result_4o: completion4o.choices[0].message.content,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
