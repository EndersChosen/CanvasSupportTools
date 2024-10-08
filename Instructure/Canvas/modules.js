// modules.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');
const { createRequester, deleteRequester } = require('../utilities');
const { getUsers } = require('./users.js');
const { exportToCSV } = require('../csvExporter');
const questionAsker = require('../questionAsker');

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

async function getUserProgress(CourseId) {
    console.log('Getting list of incomplete users');
    let userList = await getUsers(CourseId);
    let studentList = userList.filter((user) => {
        if (user.enrollments.length > 1) {
            for (let enrollment of user.enrollments) {
                if (enrollment.type === 'StudentEnrollment')
                    return user;
            }
        } else {
            if (user.enrollments[0].type === 'StudentEnrollment') {
                return user;
            }
        }
    });
    console.log(studentList.length);
    let incompleteUsers = [];
    for (let user of userList) {
        console.log('Checking user...');
        try {
            const response = await axios({
                method: 'GET',
                url: `/courses/${CourseId}/users/${user.id}/progress`
            });
            if (response.data.completed_at === null) {
                console.log('Adding user', user.id);
                incompleteUsers.push(user);
            }
        } catch (error) {
            if (error.response.status === 443)
                continue;
        }
    }
    let usefulCSV = incompleteUsers.map((user) => {
        const { id, name } = user;
        return { id: id, name: name };
    });

    exportToCSV(usefulCSV, `incomplete_users_${CourseId}`);

    return incompleteUsers;
}

// (async () => {
//     let curDomain = await questionAsker.questionDetails('What Domain: ');
//     let course = await questionAsker.questionDetails('What course: ');


//     axios.defaults.baseURL = `https://${curDomain}/api/v1`;
//     let myUsers = await getUserProgress(course);
//     console.log('finished');
//     console.log(myUsers.length);
//     questionAsker.close();
//     // let newModules = await createModule(6006, 34);
//     // console.log(newModules);

//     // let myModules = await getModules(6006)
//     // console.log(myModules.length);

//     // await deleteAllModules(6006);
//     // console.log('Completed');

//     // await deleteEmptyModules(6006);
//     // console.log('Completed');
// })();

module.exports = {
    createModule, getModules, deleteAllModules, deleteEmptyModules, getUserProgress
};
