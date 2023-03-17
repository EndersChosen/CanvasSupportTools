// communication_channels.js
const { instance } = require('./config');
const { getRegion } = require('../utilities');
const questionAsker = require('../questionAsker');

const axios = instance;

async function getCommunicationChannels() {

}

async function removeFromSuppressionList(region, email) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: `${region}${email}`
        });
        console.log(`Removed ${email} from supression list`, response.status);
        return;
    } catch (error) {
        console.log(error.response.status, error.message);
    }
    try {
        const response = await axios({
            method: 'POST',
            url: `/accounts/self/bounced_communication_channels/reset?pattern=${email}`;
        });
        console.log('reset bounce count');
    } catch (error) {
        console.log('ERROR: ', error.response.status, error.message);
    }
}

(async () => {
    axios.defaults.baseURL = await questionAsker.questionDetails('What domain: ');
    const email = await questionAsker.questionDetails('What email: ');
    questionAsker.close();

    const region = await getRegion(axios.defaults.baseURL);
    if (region)
        removeFromSuppressionList(region, email)
    else
        console.log('error with region');
})();
