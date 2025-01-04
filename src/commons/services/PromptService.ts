import { PromptInsert } from "../models/PromptModels";
import api from "../utils/Api";

interface PromptMainManager {
    promptId: number;
    promptName: string;
    promptState: boolean;
}

class PromptService {
    async getPromptList() {
        const response = await api.get<PromptMainManager[]>("/prompt/prompt-manager-get-list");
        return response.data;
    }

    async getPromptById(promptId: number) {
        const response = await api.get<PromptMainManager>(`/prompt/prompt-manager-get-by-id/${promptId}`);
        return response.data;
    }

    async addPrompt(data: PromptInsert) {
        const response = await api.post("/prompt/prompt-manager-insert", data);
        return response;
    }

    async updatePrompt(data: PromptMainManager) {
        const response = await api.post(`/prompt/prompt-manager-update`, data);
        return response;
    }
}

const promptService = new PromptService();
export default promptService;
