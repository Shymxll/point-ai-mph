'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Mic, Square, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Web Speech API için TypeScript tipleri
declare global {
    interface Window {
        webkitSpeechRecognition: new () => SpeechRecognition;
        SpeechRecognition: new () => SpeechRecognition;
    }
}

interface SpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface VoiceRecorderProps {
    onTranscription: (text: string) => void
    isDisabled?: boolean
    onStop: () => void
    onStart: () => void
}

export function VoiceRecorder({ onTranscription, isDisabled = false, onStop, onStart }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const recognitionRef = useRef<SpeechRecognition | null>(null)

    const startRecording = async () => {
        try {
            onStart()
            // Web Speech API'yi başlat
            if (!('webkitSpeechRecognition' in window)) {
                toast.error('Tarayıcınız konuşma tanımayı desteklemiyor');
                return;
            }

            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            // Ayarlar
            recognition.continuous = true; // Sürekli dinleme
            recognition.interimResults = true; // Geçici sonuçları da göster
            recognition.lang = 'tr-TR'; // Türkçe dil desteği

            // Sonuçları dinle
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const results = Array.from(Object.values(event.results));
                const transcript = results
                    .map(result => result[0].transcript)
                    .join('');

                onTranscription(transcript);
            };

            // Hata durumunda
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                toast.error('Ses tanıma hatası oluştu');
                stopRecording();
            };

            // Başlat
            recognition.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Speech recognition error:', error);
            toast.error('Ses tanıma başlatılamadı');
        }
    }

    const stopRecording = () => {
        onStop()
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    }

    // Component unmount olduğunda kaydı durdur
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    }, []);

    return (
        <div className="flex items-center gap-2">
            {!isRecording ? (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isDisabled || isProcessing}
                    onClick={startRecording}
                    className="bg-white hover:bg-rose-700 hover:text-white text-primary"
                >
                    {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Mic className="h-4 w-4" />
                    )}
                </Button>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white"
                >
                    <Square className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
} 