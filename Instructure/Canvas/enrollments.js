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
async function enrollUser(course, number, user = null, role = 'StudentEnrollment') {
    let url = `courses/${course}/enrollments`;
    let myRole = role;
    const enrollments = [];


    // checking if a specific user was passed in
    // if not create a new user and enroll them as the 
    // specified role
    if (user === null) {
        for (let i = 0; i < number; i++) {
            const newUser = await error_check.errorCheck(users.createUser);
            updateEnrollParams(newUser.id, myRole);
            //console.log(enrollData);

            console.log(`Enrolling a new user as ${role}...`);
            const newEnroll = await error_check.errorCheck(async () => {
                return await axios.post(url, enrollData)
            });
            if (newEnroll === undefined) {
                return 'There was an error';
            } else {
                enrollments.push(newEnroll.data);
            }
        }

        return enrollments;
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
(async () => {
    const curDomain = await questionAsker.questionDetails('What domain: ');
    const courseID = await questionAsker.questionDetails('What course: ');
    const number = await questionAsker.questionDetails('How many users do you want to enroll: ');
    // const type = await questionAsker.questionDetails('What type of user do you want to enroll (Teacher/Ta/Student): ');
    questionAsker.close();

    axios.defaults.baseURL = `https://${curDomain}/api/v1`;

    const enrolled = await enrollUser(courseID, number);
    console.log('enrolled ', enrolled.length);

    console.log('Done');
})();

// module.exports = {
//     enrollUser
// };
