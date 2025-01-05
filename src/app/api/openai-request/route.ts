import { OpenaiRequest } from '@/commons/models/OpenaiModels';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
export async function POST(req: NextRequest) {
    const data: OpenaiRequest[] = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: data.map((item: OpenaiRequest) => ({
                role: item.role,
                content: item.content
            })) as ChatCompletionMessageParam[]
        });

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz...' }, { status: 500 });
    }
}