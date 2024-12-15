import axios from "axios";

export const labClient = axios.create({
    baseURL: 'https://laboratorio3-5fc7.restdb.io/rest/',
    withCredentials: false,
    headers: {
      'x-apikey': '64bdbc3386d8c5613ded91e7',
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


