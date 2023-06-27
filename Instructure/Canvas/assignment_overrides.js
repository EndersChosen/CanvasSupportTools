// assignment_overrides.js

const config = require('./config.js');
const questionAsker = require('../questionAsker');
const { getAssignments } = require('./assignments.js');
const { getUsers } = require('./users.js');

const axios = config.instance;

(async function assignOverride() {
    const curDomain = await questionAsker.questionDetails('What domain: ');
    const courseID = await questionAsker.questionDetails('What course: ');


    axios.defaults.baseURL = `https://${curDomain}/api/v1`;

    const assignments = await getAssignments(courseID);
    console.log(assignments.length);

    const users = await getUsers(courseID);
    console.log(users.length);

    for (let assignment of assignments) {
        const rDate = getRandomDay();
        for (let user of users) {
            await createStudentOverride(courseID, assignment.id, user.id, rDate);
        }
    }

    console.log('done');
})();

async function createStudentOverride(courseID, assignmentID, userID, date) {
    let url = `/courses/${courseID}/assignments/${assignmentID}/overrides`;
    console.log(date);
    //console.log(url);
    // let params = {
    //     "assignment_override": {
    //         "student_ids": [userID],
    //         "due_at": '2023-06-22'
    //     }
    // }

    console.log(axios.defaults.baseURL + url);
    try {
        const data = await axios({
            method: 'post',
            url: url,
            data: {
                "assignment_override": {
                    "student_ids": [userID],
                    "due_at": `2023-06-${date}`
                }
            }
        })
        //console.log(data);
    } catch (error) {
        console.log(error.message);
    }
    console.log('added');
}

function getRandomDay() {
    const curDate = new Date();
    const year = curDate.getFullYear();
    const month = curDate.getMonth();
    const daysinMonth = new Date(year, month + 1, 0).getDate();

    const randomDay = Math.floor(Math.random() * daysinMonth) + 1;

    const randomDate = new Date(year, month, randomDay);

    return randomDate;
}
