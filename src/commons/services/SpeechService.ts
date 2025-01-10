import axios from "axios";

interface SpeechResponse {
    text: string;
}

class SpeechService {
    async convertSpeechToText(audioBlob: Blob): Promise<string> {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-1');

        try {
            const { data } = await axios.post('/api/speech-to-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!data?.text) {
                throw new Error('API yanıtında text alanı bulunamadı');
            }
            return data.text.toString();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Ses dönüştürme hatası: ${error.message}`);
            }
            throw new Error('Ses dönüştürme işlemi başarısız oldu');
        }
    }
}

const speechService = new SpeechService();
export default speechService; 