import axios from "axios";

export const labClient = axios.create({
    baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
    withCredentials: false,
    headers: {
      'x-apikey': '60eb09146661365596af552f',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

export const cryptoClient = axios.create({
    baseURL: 'https://criptoya.com/api/',
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });


