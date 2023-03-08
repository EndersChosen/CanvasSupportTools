// enrollments.js
const config = require('./config');
const users = require('./users');
const error_check = require('../error_check');
const questionAsker = require('../questionAsker');

const axios = config.instance;

const enrollData = {
    enrollment: {
        user_id: "userid",
        type: "enrollmentType",
        enrollment_state: "active"
    }
}

// if a user id is passed in enrolls that user in the 
// specified role. if no user id is passed in then 
// create a new user first and then enroll them 
// with the specified role (default 'StudentEnrollment')
async function enrollUser(course, user = null, role = 'StudentEnrollment') {
    let url = `courses/${course}/enrollments`;
    let myRole = role;


    // checking if a specific user was passed in
    // if not create a new user and enroll them as the 
    // specified role
    if (user === null) {
        const newUser = await error_check.errorCheck(users.createUser);
        updateEnrollParams(newUser.id, myRole);
        console.log(enrollData);

        console.log(`Enrolling a new user as ${role}...`);
        const newEnroll = await error_check.errorCheck(async () => {
            return await axios.post(url, enrollData)
        });
        if (newEnroll === undefined) {
            return 'There was an error';
        }
        return newEnroll.data;
    } else { // enrolling the specified user
        console.log(`Enrolling an existing user as ${role}...`);
        let url = `courses/${course}/enrollments`
        updateEnrollParams(user, myRole);
        console.log(enrollData);
        const newEnroll = await error_check.errorCheck(async () => {
            return await axios.post(url, enrollData);
        });
        return newEnroll.data;
    }
}

function updateEnrollParams(userID, role) {
    console.log('Updating enrollment data');
    enrollData.enrollment.user_id = userID;
    enrollData.enrollment.type = role;
}

// asking the important questions
// (async () => {
//     let numToEnroll = await questionAsker.questionDetails('How many users do you want to enroll?')
//     let theCourse = await questionAsker.questionDetails('What Course?')

//     for (let i = 0; i < numToEnroll; i++) {
//         await enrollUser(theCourse);
//     }
//     console.log(`Finished enrolling ${numToEnroll} user(s)`);
//     questionAsker.close();
// })();

module.exports = {
    enrollUser
};
