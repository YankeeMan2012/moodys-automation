const axios = require('axios');

const createAxiosInstance = (headers) => {
  // delete headers['content-type'];
  return axios.create({
    baseURL: process.env.SITE,
    timeout: 60000,
    headers,
  });
}

module.exports = {
  createAxiosInstance,
};
