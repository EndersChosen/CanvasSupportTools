// modules.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');

async function createModule(course, num = 1) {

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

(async () => {
    let myModules = await getModules()
})