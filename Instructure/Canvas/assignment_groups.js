// assignment_groups.js imports
//
// createAssignmentGroups(course, params, number)
// ---------------------
// getAssignmentGroups(course, params)
// ---------------------------------
// deleteEmptyAssignmentGroups(course)
// -------------------------------------

const config = require('./config.js');
const pagination = require('../pagination.js');
const questionAsker = require('../questionAsker');
const { getAssignments } = require('./assignments.js');


const axios = config.instance;
const assignmentGroups = [];


async function createAssignmentGroups(course, params = {}, number) {
    let url = `courses/${course}/assignment_groups/`;
    startTime = performance.now();
    let counter = 0;
    for (let i = 0; i < number; i++) {
        let name = `Assignment Group ${i}`;
        params.name = name;
        try {
            const response = await axios.post(url, params);
        } catch (error) {
            if (error.response) {
                console.log(error.response);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Something else happened');
            }
        }
        counter++;
    }
    endTime = performance.now();
    console.log(`Created ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`);
}

async function getAssignmentGroups(course) {
    let url = `/courses/${course}/assignment_groups?include[]=assignments&per_page=100`;
    let assignmentGroups = [];
    let nextPage = url;

    console.log(nextPage);
    while (nextPage) {
        try {
            const response = await axios.get(nextPage);
            nextPage = pagination.getNextPage(response.headers.get('link'));
            console.log(nextPage);

            for (let group of response.data) {
                assignmentGroups.push(group);
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
    }

    return assignmentGroups;
}

async function deleteEmptyAssignmentGroups(course) {
    let url = `/courses/${course}/assignment_groups/`;
    // let params = {
    //     include: ['assignments']
    // };

    console.log('getting empty assignment groups');
    const theAssignmentGroups = await getAssignmentGroups(course);


    const emptyAssignmentGroups = theAssignmentGroups.filter(assignmentGroup => {
        if (assignmentGroup.assignments.length < 1)
            return assignmentGroup;
    });

    console.log('Number of assignment groups to delete', emptyAssignmentGroups.length);
    try {
        const startTime = performance.now();
        let counter = 0;
        for (let emptyGroup of emptyAssignmentGroups) {
            console.log('deleting assignment group');
            const response = await axios.delete(url + emptyGroup.id)
            counter++;
        }
        const endTime = performance.now();
        console.log(`Deleted ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`)
    } catch (error) {
        console.log('error deleting assignment group');
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

// moves all assignments to the assignment group obtained from the first assignment
async function moveToAssignmentGroupAll(course) {
    // get all assignments in the course
    // move the assignment to the assignment group


    const assignments = await getAssignments(course);
    const firstAssignmentGroup = assignments[0].assignment_group_id; // used as the default assignment group to move all others to

    startTime = performance.now();
    for (let assignment of assignments) {
        console.log(`Moving assignment ${assignment.id} to assignment group ${firstAssignmentGroup}`);
        let url = `/courses/${course}/assignments/${assignment.id}`;
        let params = {
            assignment: {
                assignment_group_id: firstAssignmentGroup
            }
        };

        try {
            const response = await axios.put(url, params);
        } catch (error) {
            if (error.response) {
                console.log(error.response);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Something else happened');
            }
        }
    }
    endTime = performance.now();
    console.log(`Moved ${assignments.length} assignments to the assignemnt group id of ${firstAssignmentGroup} in ${Math.floor(endTime - startTime) / 1000} seconds.`);
}

// (async () => {
//     const curDomain = await questionAsker.questionDetails('What domain: ');
//     const courseID = await questionAsker.questionDetails('What course: ');
//     //const number = await questionAsker.questionDetails('How many assignments do you want to create: ');
//     questionAsker.close();

//     axios.defaults.baseURL = `https://${curDomain}/api/v1`;

//     // await createAssignmentGroups(`courses/${theCourse}/assignment_groups`, {}, 10);
//     // let myAssignmentGroups = await getAssignmentGroups(`courses/${theCourse}/assignment_groups`);
//     // console.log(myAssignmentGroups.length);

//     await deleteEmptyAssignmentGroups(courseID);

//     console.log('Done.');
// })();

module.exports = {
    createAssignmentGroups, getAssignmentGroups, deleteEmptyAssignmentGroups, moveToAssignmentGroupAll
}
