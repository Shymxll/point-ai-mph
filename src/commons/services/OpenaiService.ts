import axios from 'axios';
import { OpenaiRequest, OpenaiResponse } from '../models/OpenaiModels';

export class OpenaiService {
    async sendOpenaiRequest(data: OpenaiRequest): Promise<OpenaiResponse> {
        const response = await axios.post('/api/openai-request' , data);
        console.log("Response:", response.data);
        return response.data;
    }
}

const openaiService = new OpenaiService();
export default openaiService;