import { LocationResponse } from "../models/LocationModels";
import api from "../utils/Api"

class GeneralService {

    public async getLocation(): Promise<LocationResponse> {
        return await api.get('location');
    }

}

const generalService = new GeneralService();
export default generalService;


