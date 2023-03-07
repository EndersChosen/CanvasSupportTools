// modules.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');
const { createRequester } = require('../utilities');

const axios = config.instance;

async function createModule(courseID, num = 1) {
    console.log('Creating module(s)');

    let myURL = `courses/${courseID}/modules`;
    const method = 'post';
    let params = {
        module: {
            name: `Module Name`
        }
    };
    let requests = [];
    let loops = Math.floor(num / 40);

    //const response = await axios.post(myURL, params);
    // const response = await createRequester('post', myURL, params, num, 'module');
    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            console.log('adding requests to promise');
            // console.log(`The index is ${ index }, the id is ${ discussionList[index].id }`);
            try {
                requests.push(axios({
                    method: method,
                    url: myURL,
                    data: params
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
        await (function wait() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            })
        })();
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
    console.log(response);
    return 'Finished';
}

async function getModules(url, modules = []) {
    console.log('Getting modules');

    let theModules = modules;
    let myURL = url;
    if (typeof myURL === Number) {
        myURL = `courses/${url}/modules?per_page=100`;
    }
    const reseponse = await errorCheck.errorCheck(async () => {
        return await axios.get(url);
    });
    for (let module of Response.data) {
        theModules.push(module);
    }

    let nextPage = pagination.getNextPage(response.headers.get('link'));
    if (nextPage !== false) {
        theModules = await getModules(nextPage, theModules);
    }

    return theModules;
}

async function deleteAllModules(courseID) {

}

(async () => {
    let newModules = await createModule(6007, 2);
    console.log(newModules);
    // let myModules = await getModules(6005)
    // console.log(myModules.length);
})();