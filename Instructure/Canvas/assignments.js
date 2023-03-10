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
const csvExporter = require('../csvExporter');
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

async function getAssignments(courseID) {
    console.log('Getting assignment(s)');

    let assignmentList = [];
    let myURL;
    if (isNaN(courseID))
        myURL = courseID;
    else
        myURL = `courses/${courseID}/assignments?per_page=100`;

    try {
        const response = await axios.get(myURL);
        const nextPage = pagination.getNextPage(response.headers.get('link'));
        if (nextPage !== false) {
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

async function deleteNoSubmissionAssignments(courseID) {
    console.log('Deleting assignments with no submissions');

    let myURL = `courses/${courseID}/assignments`;
    let assignments = [];

    try {
        // getting all assignments to filter later
        assignments = await getAssignments(courseID);
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
    // ------------------------------------
    // Figure out how to prompt user if they're sure
    // ------------------------------------

    const answer = await questionAsker.questionDetails(`Found ${noSubmissionAssignments.length} assignments with no submissions. \nAre you sure you want to delete them?`);
    questionAsker.close();
    if (answer === 'no') {
        return;
    }

    csvExporter.exportToCSV(noSubmissionAssignments, 'No_Submissions');

    console.log('Total assignments', assignments.length);
    console.log('Total with no submissions', noSubmissionAssignments.length);


    console.log('Deleting assignments with no submissions');
    const startTime = performance.now();
    let deleteCounter = 0;

    //***********************************************
    // Make this better using promise.all()
    //***********************************************
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

async function deleteAllAssignments(courseID) {
    let assignments = await getAssignments(courseID);
    for (const assignment of assignments) {
        try {
            const response = await axios.delete(url + `/${assignment.id}`)
        } catch (error) {
            console.log('There was an error', error.message);
        }
    }
}


// the function that does the stuff
(async () => {
    await deleteNoSubmissionAssignments(2165);
})();

module.exports = {
    createAssignments, getAssignments, deleteNoSubmissionAssignments, deleteAllAssignments
}
