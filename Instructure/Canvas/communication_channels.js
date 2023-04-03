// communication_channels.js
const { instance } = require('./config');
const { getRegion } = require('../utilities');
const questionAsker = require('../questionAsker');

const axios = instance;

async function getCommunicationChannels() {

}

async function removeFromSuppressionList(region, email) {
    let crrntURL = `${region}${email}`;
    try {
        const response = await axios({
            method: 'DELETE',
            url: crrntURL
        });
        console.log(`Removed ${email} from supression list`, response.status);
    } catch (error) {
        if (error.response.status === 404) {
            console.log('Response status: ', error.response.status);
        } else {
            console.log('ERROR: remove from suppression failed, skipping bounce count reset', error.response.status, error.message);
            return;
        }
    }
    try {
        await axios({
            method: 'POST',
            url: `https://${axios.defaults.baseURL}/api/v1/accounts/self/bounced_communication_channels/reset?pattern=${email}`
        });
        console.log('reset bounce count');
    } catch (error) {
        console.log('ERROR: ', error.response, error.message);
    }
    return
}

(async () => {
    let curDomain = await questionAsker.questionDetails('What domain: ');
    const email = await questionAsker.questionDetails('What email: ');
    questionAsker.close();

    axios.defaults.baseURL = `https://${curDomain}/api/v1`;
    const region = await getRegion();
    if (region)
        removeFromSuppressionList(region, email)
    else
        console.log('error with region');
})();
