const express = require('express');
require('dotenv').config();

const { auth } = require('./services/auth');
const { createAxiosInstance } = require('./services/api');
const { fromPage, fromSearch } = require('./services/scrapers');

const app = express();

let cookie = null;
// let cookie = {
//   name: 'Mdc.FedAuth',
//   value: '77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+MCMuZnx1c2RtZW1iZXJzaGlwcHJvdmlkZXJ8dmxhZGltaXIuYmVzcGVjaG55QHAyaC5jb20sMCMuZnx1c2RtZW1iZXJzaGlwcHJvdmlkZXJ8dmxhZGltaXIuYmVzcGVjaG55QHAyaC5jb20sMTMzMzA2OTM0Mjk5MjI1NDU4LFRydWUsQyswS0pHU2hIQ0k4L1ByWnlmMGtUdGsvM3lhN092WTI2WXdpa1NzSlNwSzlwZUQ4dzJ4bzF4L3NqdmRVdW9CYm14Y3ptYndsdkF2clBiWjF6ekZ4aVF4U1dXRlhIa1BGamZ6MllBa0t0bFlFYjlQU1ZyMHlIZjFvdGtEZHpZVkxKY2YvVDRzaTFNUGZ6b0pTcE5ieERpSnk2OTNyMjlxNC9yd2d3b0RSVEV4aXhZUHVrQ2NUSDN5bWQxZDRiWXhVSzdXRDhtdU5pQVVRbXV5NnN2NmJGSjJhS3Z1dk0wM0tRK2lvWElNOW1mKzlVTUZVRE5FWFhKVVV3VUxiZ1J3aWF6VktvL2xNd1pMV05uSlIzVHNCU3ZpanlhVkdSUi9MUDkyM1ZLSXd3M3k5dHU2LzhvNTU4N3MydVprdk5kclo5RXlianJ5alBMV3NiS0xRUStUSjZ3PT0saHR0cDovL3d3dy5tb29keXMuY29tLzwvU1A+',
// };

app.get('/', async (req, res) => {
  if (!cookie) cookie = await auth();

  const api = createAxiosInstance({Cookie: `${cookie.name}=${cookie.value};`});

  try {
    const s = await fromSearch(api, req.query.ticker);
    // if (s.longTermRating) return res.send(s);
    return res.send(s);

    // const p = await fromPage(api, req.query.ticker);
    // res.send(p);
  } catch (e) {
    console.log(e);
    res.send({message: 'Error'});
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Solver listening on port ${process.env.PORT}`);
});

module.exports = app;
