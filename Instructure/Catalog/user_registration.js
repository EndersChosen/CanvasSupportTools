// user_registration.js
const { instance } = require('./config');
//const { createRequester } = require('../utilities');
const getRandomPerson = require('../random_user');
const csvExporter = require('../csvExporter');
const pagination = require('../pagination');

const axios = instance;

async function getUserRegistrations(url = null, users = []) {
    console.log('getting user registrations');

    let userList = users;
    let myURL = 'user_registrations?per_page=100';
    if (url !== null)
        myURL = url;


    const response = await axios({
        method: 'GET',
        url: myURL
    });
    //console.log(response.data);
    userList.push(...response.data.user_registrations);
    let nextPage = await pagination.getNextPage(response.headers.get('link'));
    if (nextPage !== false) {
        userList = await getUserRegistrations(nextPage, userList);
    }
    return userList;
}

async function registerUser(name, email, catalog_id = null, custom_fields = null) {
    // name, email, catalog_id,custom_fields
    console.log('registering user');

    const userData = {
        name: name,
        email: email,
        catalog_id: catalog_id,
        custom_fields: {}
    }

    // post to user_registrations
    const response = await axios({
        method: 'POST',
        url: 'user_registrations',
        data: userData
    });
    return response.data;
}

async function multiRegister(num) {
    console.log('registering multiple users');

    for (let i = 0; i < num; i++) {
        let user = await getRandomPerson.getRandomPerson();
        await registerUser(user.firstName + " " + user.lastName, user.email)
    }
}

(async () => {
    csvExporter.exportToCSV(await getUserRegistrations(), 'catalog_registrations');
    console.log('Done getting registrations');

    // let user = await getRandomPerson.getRandomPerson();
    // console.log(await registerUser(user.firstName + " " + user.lastName, user.email));

    // await multiRegister(100);
    // console.log('Done');
})();

// module.exports = {
//     registerUser,multiRegister,getUserRegistrations
// }
