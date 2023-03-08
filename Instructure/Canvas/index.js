// index.js
const questionAsker = require('./questionAsker');
const config = require('./config');
const displayOptions = require('./displayOptions');
const myRequest = require('./myRequest');

const axios = config.instance;

(async () => {
    const dOptions = new displayOptions.Question;
    // const theRequest = new myRequest.Requester(
    //     await questionAsker.questionDetails(dOptions.token),
    //     await questionAsker.questionDetails(dOptions.env),
    //     await questionAsker.questionDetails(dOptions.domain),
    //     await questionAsker.questionDetails(dOptions.action)
    // );



    // console.log(theRequest);
    console.log(axios.defaults.baseURL);

    // switch (env) {
    //     case 'prod':
    //         config.instance.defaults.baseURL = 'https://ckruger.instructure.com/api/v1/';
    //         break;
    //     case 'beta':
    //         config.instance.defaults.baseURL = 'https://ckruger.beta.instructure.com/api/v1/';
    //         break;
    //     case 'test':
    //         config.instance.defaults.baseURL = 'https://ckruger.test.instructure.com/api/v1/';
    //         break;
    //     default:
    //         break;
    // }

})();
