// modules.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');
const { createRequester, deleteRequester } = require('../utilities');

const axios = config.instance;

async function createModule(courseID, num = 1) {
    console.log('Creating module(s)');

    let myURL = `courses/${courseID}/modules`;
    const method = 'post';
    let params = {
        module: {
            name: `API Module`
            // position: 1 // HAD TO REMOVE POSITION AS IT WAS CAUSING DEADlOCKS
        }
    };
    let requests = [];
    let loops = Math.floor(num / 40);

    //const response = await axios.post(myURL, params);
    await createRequester('post', myURL, params, num, 'module');

    return 'Finished';
}

async function getModules(courseID, modules = []) {
    console.log('Getting modules');

    let theModules = modules;
    let myURL = `courses/${courseID}/modules?per_page=100`;
    if (isNaN(courseID)) {
        myURL = courseID;
    }

    const response = await errorCheck.errorCheck(async () => {
        return await axios.get(myURL);
    });
    theModules.push(...response.data);

    let nextPage = pagination.getNextPage(response.headers.get('link'));
    if (nextPage !== false) {
        theModules = await getModules(nextPage, theModules);
    }

    return theModules;
}

async function deleteAllModules(courseID) {
    console.log('Deleting all modules');

    const allModules = await getModules(courseID);
    await deleteRequester(allModules, courseID, 'modules');
    console.log('Finished');
}

async function deleteEmptyModules(courseID) {
    console.log('Deleting empty modules');

    const allModules = await getModules(courseID);
    const emptyModules = allModules.filter((module) => {
        if (module.items_count === 0) {
            return module;
        }
    });
    await deleteRequester(emptyModules, courseID, 'modules');
    console.log('Finished');
}

(async () => {
    // let newModules = await createModule(6006, 34);
    // console.log(newModules);

    // let myModules = await getModules(6006)
    // console.log(myModules.length);

    // await deleteAllModules(6006);
    // console.log('Completed');

    await deleteEmptyModules(6006);
    console.log('Completed');
})();
