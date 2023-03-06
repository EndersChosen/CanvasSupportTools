// modules.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');
const { requester } = require('../utilities');

const axios = config.instance;

async function createModule(courseID, num = 1) {
    console.log('Creating module(s)');

    let myURL = `courses/${courseID}/modules`;
    let params = {
        module: {
            name: `Module Name`
        }
    };

    //const response = await axios.post(myURL, params);
    const response = await requester(myURL, num, 'post', 'module', params);
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