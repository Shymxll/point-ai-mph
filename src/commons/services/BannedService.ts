import { BannedMainManager } from "../models/BannedModels";
import api from "../utils/Api";

class BannedService {
    async getBannedList(): Promise<BannedMainManager[]> {
        const response = await api.get<BannedMainManager[]>("/banned/banned-manager-get-list");
        return response.data;
    }

    async getBannedById(bannedId: number): Promise<BannedMainManager> {
        const response = await api.get<BannedMainManager>(`/banned/banned-manager-get-by-id/${bannedId}`);
        return response.data;
    }

    async addBanned(data: BannedMainManager) {
        const response = await api.post("/banned/banned-manager-insert", data);
        return response;
    }

    async updateBanned(data: BannedMainManager) {
        const response = await api.post(`/banned/banned-manager-update`, data);
        return response;
    }

}

const bannedService = new BannedService();
export default bannedService;

