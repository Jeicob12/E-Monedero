import { labClient } from '../service/client.js'

class LabService {

    constructor() {
        this.client = labClient
    }

    createTransactions(compra) {
        return this.client.post('/transactions', compra);
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
