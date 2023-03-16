// communication_channels.js

const { instance } = require('./config');

const axios = instance;


async function getCommunicationChannels() {

}

async function removeFromSuppressionList() {
    const response = await axios({
        method: 'DELETE',
        url: ''
    })
}

(async () => {
    // axios.defaults.baseURL = await setDomain();
    // console.log(axios.defaults.baseURL);

    //console.log(await getRegion('ckruger.instructure.com'));
    console.log('test');
})();
