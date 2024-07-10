import { cryptoClient } from '../service/client.js'

class CryptoService {

    constructor() {
        this.client = cryptoClient
    }

    getBitcoin() {
        return this.client.get('argenbtc/btc/ars/1');
    };
    getEtherum() {
        return this.client.get('satoshitango/eth/ars/1');
    };
    getUSDC() {
        return this.client.get('lemoncash/usdc/ars/1');
    }
}


export default new CryptoService;