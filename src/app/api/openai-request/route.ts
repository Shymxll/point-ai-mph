import { OpenaiRequest } from '@/commons/models/OpenaiModels';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { encode } from 'gpt-tokenizer';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const MAX_TOKENS =  16000; // GPT-4 için maksimum token limiti

// GPT-4 için token sayma
function countTokens(messages: ChatCompletionMessageParam[]): number {
    let totalTokens = 0;

    for (const message of messages) {
        // Her mesaj için 3 token (rol ve format için)
        totalTokens += 3;

        // Mesaj içeriğindeki tokenları say
        if (typeof message.content === 'string') {
            totalTokens += encode(message.content).length;
        }
    }

    // Formatlamalar için ek 3 token
    totalTokens += 3;

    return totalTokens;
}

// Mesajları token limitine göre kırp
function trimMessages(messages: ChatCompletionMessageParam[]): ChatCompletionMessageParam[] {
    let currentTokens = countTokens(messages);

    // Token sayısı limiti aşmıyorsa mesajları olduğu gibi döndür
    if (currentTokens <= MAX_TOKENS) {
        return messages;
    }

    // İlk mesaj (system prompt) ve son mesajı (kullanıcının son sorusu) koru
    const systemMessage = messages.find(msg => msg.role === 'system');
    const lastMessage = messages[messages.length - 1];
    let trimmedMessages: ChatCompletionMessageParam[] = systemMessage ? [systemMessage] : [];

    // Geriye kalan mesajları sondan başa doğru ekle
    const remainingMessages = messages
        .filter(msg => msg !== systemMessage && msg !== lastMessage)
        .reverse();

    for (const message of remainingMessages) {
        const potentialMessages = [...trimmedMessages, message, lastMessage];
        const potentialTokens = countTokens(potentialMessages);

        // Eğer bu mesajı eklemek limiti aşmayacaksa ekle
        if (potentialTokens <= MAX_TOKENS) {
            trimmedMessages.splice(1, 0, message);
        } else {
            break;
        }
    }

    // Son mesajı ekle
    trimmedMessages.push(lastMessage);

    return trimmedMessages;
}

export async function POST(req: NextRequest) {
    const data: OpenaiRequest[] = await req.json();

    let messages = data.map((item: OpenaiRequest) => ({
        role: item.role,
        content: item.content
    })) as ChatCompletionMessageParam[];

    // Mesajları token limitine göre kırp
    messages = trimMessages(messages);

    // Token sayısını hesapla ve logla
    const estimatedTokens = countTokens(messages);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: messages,
            store: true,
        });


        return NextResponse.json(response);
    } catch (error) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz...' }, { status: 500 });
    }
}

//tokenizer kullanılacak
