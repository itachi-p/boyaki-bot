import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
