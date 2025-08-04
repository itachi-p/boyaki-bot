import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'promptが無効です' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    const result = completion.choices[0]?.message?.content ?? '(返答なし)'

    return NextResponse.json({ result })
  } catch (error) {
  if (error instanceof Error) {
    // error が Error型 なら message プロパティが使える
    console.error('APIエラー:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // それ以外（型不明）の場合は汎用的なメッセージを返す
    console.error('不明なエラー:', error);
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
}
