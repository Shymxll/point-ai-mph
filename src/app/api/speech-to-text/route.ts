import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const tempFilePath = join(process.cwd(), 'temp-audio.webm');

    try {
        const formData = await req.formData();
        const audioBlob = formData.get('file') as Blob;

        if (!audioBlob) {
            return NextResponse.json(
                { error: 'Ses dosyası bulunamadı' },
                { status: 400 }
            );
        }

        if (audioBlob.size === 0) {
            return NextResponse.json(
                { error: 'Ses dosyası boş' },
                { status: 400 }
            );
        }

        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(tempFilePath, buffer);

        const response = await openai.audio.transcriptions.create({
            file: await import('fs').then(fs => fs.createReadStream(tempFilePath)),
            model: 'whisper-1',
            language: 'tr',
            
        });

        // Geçici dosyayı sil
        unlinkSync(tempFilePath);
        return NextResponse.json({ text: response.text });
    } catch (error) {
        // Hata durumunda da geçici dosyayı silmeyi dene
        try {
            unlinkSync(tempFilePath);
        } catch { }

        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 