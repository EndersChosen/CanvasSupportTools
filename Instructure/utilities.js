// utilities.js
const { instance } = require('./Canvas/config');

const axios = instance;
// add utilities here

async function createRequester(method, url, params, num, endpoint) {
    let index = 0;
    let loops = Math.floor(num / 40);
    let requests = [];
    let newParams = params;
    let arrayOfResults = [];
    let results = [];

    // loops is the number of item / 40 to add to a Promise.all()
    // I use / 40 to make sure I don't get rate limited when doing 
    // all the requests in parallel
    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            console.log('adding requests to promise');
            newParams[endpoint].name = `${endpoint} ${index + 1}`;
            // console.log(`The index is ${ index }, the id is ${ discussionList[index].id }`);
            try {
                requests.push(axios({
                    method: method,
                    url: url,
                    data: newParams
                }));
            } catch (error) {
                console.log(`error adding request ${i} url ${url} to array`);
            }
            index++;
        }
        try {
            results = await Promise.all(requests);
            arrayOfResults.push(...results.map((result) => {
                return result.data;
            }));
        } catch (error) {
            console.log('There was an error', error.message, error.url);
            return;
        }
        console.log('Processed requests');
        // after processing the requests wait for 2 seconds to all the 
        // api rate limit to calm down before doing any more requests
        holdPlease(2000);
        // reset the requests array and lower loop value by 1
        requests = [];
        loops--;
    }
    console.log('Outside while');
    // after doing all mulitple of 40 finishe the remainder of the requests
    for (let i = 0; i < num % 40; i++) {
        console.log('adding requests to promise');
        newParams[endpoint].name = `${endpoint} ${index + 1}`;
        try {
            requests.push(axios({
                method: method,
                url: url,
                data: newParams
            }));
        } catch (error) {
            console.log(`error adding request ${i} url ${url} to array`);
        }
        index++;
    }
    try {
        results = await Promise.all(requests);
        arrayOfResults.push(...results.map((result) => {
            return result.data;
        }));
    } catch (error) {
        console.log('There was an error', error.message, error.url, error);
        return;
    }
    return arrayOfResults;
}

function holdPlease(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    createRequester
};

