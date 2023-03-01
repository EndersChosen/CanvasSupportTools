// config.js
const axios = require('axios');

const domain = 'https://ckruger.catalog.instructure.com/api/v1/';
const token = 'ca4538a29a5581737facd1a8a7617ecc';

// const catalogDomains = {
//     usu: {
//         domain: 'https://learn.usu.edu/api/v1/',
//         token: '6184de9dbafcf84e00ccfc45ea280e6d',
//     },
//     ckruger: {
//         domain: 'https://ckruger.catalog.instructure.com/api/v1/',
//         token: 'ca4538a29a5581737facd1a8a7617ecc'
//     }
// };

const params = {};
const headers = {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
}

const instance = axios.create({
    baseURL: domain,
    headers: headers,
    timeout: 10000
});

module.exports = {
    instance
};

