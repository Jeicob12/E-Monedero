import CryptoService from './cryptoService'


const bitcoin = 'btc';
const ethereum = "eth";
const usdc = "usdc";

export const CRYPTO_MAPPER = {

    [bitcoin]: CryptoService.getBitcoin,
    [usdc]: CryptoService.getUSDC,
    [ethereum]: CryptoService.getEtherum



};