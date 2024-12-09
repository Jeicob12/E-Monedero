import { defineStore } from "pinia";


export const store = defineStore('store', {
  state: () => ({
    profile: {},
    transaction: [],
    purchaseAction: {
      crypto_code: "",
      crypto_amount: "",
      money: "",
    },
    saleAction: {},
  }),
  actions: {
    setProfile(profile) {
      this.profile = profile;
    },
    setPurchaseAction(crypto_code, crypto_amount, money) {
      this.purchaseAction = {
        crypto_code: crypto_code,
        crypto_amount: crypto_amount,
        money: money
      }
    },
    setTransactions(transaction) {
      this.transaction = transaction;

      const cryptoCant = {};

      this.transaction.forEach((tr) => {
        if (tr.actions = "purchase") {

          const crypto = tr.crypto_code;
          const crypto_amount = tr.crypto_amount;

          if (!cryptoCant[crypto]) {
            cryptoCant[crypto] = 0;
          }
          cryptoCant[crypto] += crypto_amount;
        }
        if (tr.actions = "sale") {
          const crypto = tr.crypto_code;
          const crypto_amount = tr.crypto_amount;

          if (!cryptoCant[crypto]) {
            cryptoCant[crypto] = 0;
          }
          cryptoCant[crypto] -= crypto_amount;
        }
      })
    }
  },
  getters: {
    getProfile: (state) => state.profile
  }
});


