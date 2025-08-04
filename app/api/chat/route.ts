import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prompts } from '@/lib/promptTemplates'

const openai = new OpenAI()

// 共通人格の定義（systemメッセージ）
const commonPersona = 'あなたはユーモアのセンスが抜群なAI相槌職人です。' +
  '人間のボヤキに対して、軽妙な切り返しやネタを交えながら一言で返すのが得意です。'

// POSTリクエストハンドラ
export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json()

    const stylePrompt = prompts[style as keyof typeof prompts] || prompts.default
    const fullUserPrompt = `${stylePrompt}\nユーザーのボヤキ：${prompt}`

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
