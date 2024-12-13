import { defineStore } from "pinia";


export const store = defineStore('store', {
  state: () => ({
    profile: {},
    transaction: [],
    purchaseAction: [],
    saleAction: [],
    cryptoCant: {}, 
  }),
  actions: {
    setProfile(profile) {
      this.profile = profile;
    },
    setPurchaseAction(data) {
      this.purchaseAction.push(data) 
      !this.cryptoCant[data.crypto_code] ? 0 : this.cryptoCant[data.crypto_code] += Number(data.crypto_amount);  
    },
    setSaleAction(data) {
      this.purchaseAction.push(data) 
      !this.cryptoCant[data.crypto_code] ? 0 : this.cryptoCant[data.crypto_code] -= Number(data.crypto_amount);  
    },
    setTransactions(transaction) {
      this.transaction = transaction;
      this.purchaseAction  = [];
      this.saleAction= [];
      this.cryptoCant = {}; 
      
      this.transaction.forEach((tr) => {
        if (tr.action === "purchase") {

          this.purchaseAction.push(tr)
          const crypto = tr.crypto_code;
          const crypto_amount = tr.crypto_amount;

          if (!this.cryptoCant[crypto]) {
            this.cryptoCant[crypto] = 0;
          }
          this.cryptoCant[crypto] += Number(crypto_amount);
        }
        if (tr.action === "sale") {
          this.saleAction.push(tr)
          const crypto = tr.crypto_code;
          const crypto_amount = tr.crypto_amount;

          if (!this.cryptoCant[crypto]) {
            this.cryptoCant[crypto] = 0;
          }
          this.cryptoCant[crypto] -= Number(crypto_amount);
        }
      })
    }
  },
  getters: {
    getProfile: (state) => state.profile
  }
});


