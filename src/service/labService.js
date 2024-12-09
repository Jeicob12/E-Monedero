import { labClient } from '../service/client.js'
import { store } from '../store/index.js';



class LabService {

    constructor() {
        this.client = labClient
    }

    createTransactions(action, crypto_code, crypto_amount, money) {
        const globalStore = store();

        const data = {
            user_id: globalStore.getProfile.username,
            action: action,
            crypto_code: crypto_code,
            crypto_amount: crypto_amount,
            money: money,
            datetime: Date.now()

        }
        return this.client.post('/transactions', data);
    };
    getTransactions(id) {
        return this.client.get(`/transactions?q={"user_id": "${id}"}`);
    };
    deleteTransactions(id) {
        return apiClient.delete(`/transactions/${id}`);
    };
    updateTransactions(id, editar) {
        return apiClient.patch(`/transactions/${id}`, editar);
    };

}


export default new LabService;
