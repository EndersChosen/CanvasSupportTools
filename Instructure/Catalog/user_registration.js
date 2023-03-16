// user_registration.js
const { instance } = require('./config');
//const { createRequester } = require('../utilities');
const getRandomPerson = require('../random_user');

const axios = instance;

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

(async () => {
    let user = await getRandomPerson.getRandomPerson();
    console.log(await registerUser(user.firstName + " " + user.lastName, user.email));
})();

// module.exports = {
//     registerUser
// }
