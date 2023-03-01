// config.js
const axios = require('axios');

const domain = "https://ckruger.test.instructure.com/api/v1/";
const token = '17~FKoZpVSzpgmgm35MGzo10zZ5vvS4XPkz24Km2zF8VCv25qtvxqTMraVFXkS44NOM';
const params = {};
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}

const instance = axios.create({
    baseURL: domain,
    headers: headers,
    timeout: 20000
});

module.exports = {
    instance
};