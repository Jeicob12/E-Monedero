import { defineStore } from "pinia";


export const store = defineStore('store', {
  state: () => ({
    profile: {},
    transaction: [],
  }),
  actions: {
    setProfile(profile){
      this.profile = profile;
    }
  },
  getters: {
    getProfile: (state) => state.profile
  }
});


