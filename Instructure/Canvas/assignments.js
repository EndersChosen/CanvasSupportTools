// assignments.js
// ---------------
// createAssignments(course,number)
// ------------------------------
// getAssignments(course)
// -------------------------------
// deleteNoSubmissionAssignments(course)
// ----------------------------------

const config = require('./config.js');
const pagination = require('../pagination.js');
const questionAsker = require('../questionAsker');
const readline = require('readline');

//const qAsker = questionAsker.questionDetails;
const axios = config.instance;

async function createAssignments(course, number) {

    console.log(`Creating ${number} assignment(s)`);
    let url = `courses/${course}/assignments`;
    const data = {
        assignment: {
            name: 'Assignment 1',
            submission_types: [
                'online_upload',
            ],
            allowed_extensions: [
            ],
            points_possible: 10,
            grading_type: 'points',
            post_to_sis: false,
            due_at: null,
            lock_at: null,
            unlock_at: null,
            description: 'This is the assignment description',
            published: false,
            anonymous_grading: false,
            allowed_attempts: -1,
        }
    }

    try {
        let counter = 0;
        let startTime = performance.now();
        for (let num = 1; num <= number; num++) {
            data.assignment.name = `Assignment ${num}`;
            const response = await axios.post(url, data);
            counter++;
        }
        let endTime = performance.now();
        console.log(`Created ${counter} assignment(s) in ${Math.floor(endTime - startTime) / 1000} seconds`)
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('A different error', error.message);
        }
    }
}

async function getAssignments(url) {

    let assignmentList = [];

    console.log('Getting assignment(s) from', url);

    try {

        const response = await axios.get(url);
        const nextPage = pagination.getNextPage(response.headers.get('link'));
        if (nextPage != false) {

            assignmentList = await getAssignments(nextPage);
        }

        for (let assignment of response.data) {


            assignmentList.push(assignment);
        }

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('A different error', error.message);
        }
    }
    return assignmentList;
}

async function deleteNoSubmissionAssignments(url) {

    let assignments = [];

    try {
        // getting all assignments to filter later
        assignments = await getAssignments(course);
    } catch (error) {
        console.log('This is the error', error)
    }

    // filtering only unsubmitted assignments
    const noSubmissionAssignments = assignments.filter(assignment => {
        if (!assignment.has_submitted_submissions) {
            return assignment;
        }
    });
    if (noSubmissionAssignments.length === 0) {
        console.log('No assignments to delete');
        return;
    }
    console.log('Total assignments', assignments.length);
    console.log('Total with no submissions', noSubmissionAssignments.length);

    // ------------------------------------
    // Figure out how to prompt user if they're sure
    // ------------------------------------

    // console.log(`Found ${noSubmissionAssignments.length} assignment(s) with no submissions are you sure you want to delete them?`);

    console.log('Deleting assignments with no submissions');
    const startTime = performance.now();
    let deleteCounter = 0;
    for (let assignment of noSubmissionAssignments) {
        try {
            await axios.delete(url + assignment.id);
        } catch (error) {
            console.log('The Error deleting the assignment is ', error);
        }
        deleteCounter++;
    }
    const endTime = performance.now();
    console.log(`Deleted ${deleteCounter} assignment(s) in ${Math.floor(endTime - startTime) / 1000} seconds`);
}

async function deleteAllAssignments(url) {
    let assignments = await getAssignments(url);
    for (const assignment of assignments) {
        try {
            const response = await axios.delete(url + `/${assignment.id}`)
        } catch (error) {
            console.log('There was an error', error.message);
        }
    }
}

// // asks the import questions
// async function questionAsker(question) {
//     return new Promise(resolve => {
//         rl.question(question, answer => {
//             resolve(answer);
//         });
//     });
// }

// the function that does the stuff
// (async () => {

//     let theCourse;
//     let numOfAssignments;
//     let myAssignments;


//     let option = await questionAsker.questionDetails('What do you want to do? ("get", "create", "delete"');
//     let url = '';

//     switch (option) {
//         case 'get':
//             theCourse = await questionAsker.questionDetails('What course?');
//             url = `courses/${theCourse}/assignments`;
//             myAssignments = await getAssignments(url);
//             console.log(myAssignments);
//             console.log(myAssignments.length);
//             break;
//         case 'create':
//             console.log('In the switch create option')
//             numOfAssignments = await questionAsker.questionDetails('How many assignments?');
//             theCourse = await questionAsker.questionDetails('What course?');
//             createAssignments(theCourse, numOfAssignments);
//             break;
//         case 'delete':
//             theCourse = await questionAsker.questionDetails('What course?');
//             url = `courses/${theCourse}/assignments`;
//             deleteNoSubmissionAssignments(url);
//             //deleteAllAssignments(url);
//             console.log('Deleted assignments');
//             break;
//         default:
//             break;
//     }
//     questionAsker.close();
// })();

module.exports = {
    createAssignments, getAssignments, deleteNoSubmissionAssignments, deleteAllAssignments
}