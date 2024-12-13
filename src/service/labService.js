import { labClient } from '../service/client.js'



class LabService {

    constructor() {
        this.client = labClient
    }

    createTransactions(data) {

        return this.client.post('/transactions', data);
    };
    getTransactions(id) {
        return this.client.get(`/transactions?q={"user_id": "${id}"}`);
    };
    deleteTransactions(id) {
        return this.client.delete(`/transactions/${id}`);
    };
    updateTransactions(id, edit) {
        return this.client.patch(`/transactions/${id}`, edit);
    };

}


export default new LabService;
