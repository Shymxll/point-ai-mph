'use client'

import React, { useState, useRef } from 'react'
import { Button } from './button'
import { Mic, Square, Loader2 } from 'lucide-react'
import speechService from '@/commons/services/SpeechService'
import { toast } from 'sonner'

interface VoiceRecorderProps {
    onTranscription: (text: string) => void
    isDisabled?: boolean
}

export function VoiceRecorder({ onTranscription, isDisabled = false }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
                try {
                    setIsProcessing(true)
                    const text = await speechService.convertSpeechToText(audioBlob)
                    console.log("text", text)
                    onTranscription(text)
                } catch (error) {
                    console.error('Recording error:', error)
                    toast.error('Ses dönüştürme işlemi başarısız oldu')
                } finally {
                    setIsProcessing(false)
                }
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start(200)
            setIsRecording(true)
        } catch (error) {
            console.error('MediaRecorder error:', error)
            toast.error('Mikrofona erişim sağlanamadı')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

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