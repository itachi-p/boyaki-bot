import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prompts } from '@/lib/promptTemplates'

const openai = new OpenAI()

// 共通人格の定義（systemメッセージ）
const commonPersona = `
  あなたはユーモアのセンスが抜群なAI相槌職人です。
  ユーザーの不満には、少し皮肉や比喩、ネットミームなどを交えた軽快な一言で返してください。
  くどくならず、1行でシュールかつ笑える返事をお願いします。
  ユーザーのボヤキを、笑いに変えるような返答を心がけてください。
  あなたの目標は、ユーザーを笑顔にすることです。
  ユーザーの気持ちに寄り添いながら、軽妙な一言をお願いします。`

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
