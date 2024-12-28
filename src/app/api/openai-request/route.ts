import { OpenaiRequest } from '@/commons/models/OpenaiModels';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
export async function POST(req: NextRequest) {
    const data: OpenaiRequest = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.',
                },
                {
                    role: 'user',
                    content: data.content,
                },
            ],
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz...' }, { status: 500 });
    }
}