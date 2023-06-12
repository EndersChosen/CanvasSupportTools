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
    let url = `https://mc3.instructure.com/api/v1/courses/5909/assignment_groups?include[]=assignments&per_page=100`;
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
    let url = `https://mc3.instructure.com/api/v1/courses/5909/assignment_groups/`;
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

(async () => {
    //let theCourse = await qa('What course:');
    // await createAssignmentGroups(`courses/${theCourse}/assignment_groups`, {}, 10);
    //let myAssignmentGroups = await getAssignmentGroups(`courses/${theCourse}/assignment_groups`);
    // console.log(myAssignmentGroups.length);
    await deleteEmptyAssignmentGroups(null);

})();

// module.exports = {
//     createAssignmentGroups, getAssignmentGroups, deleteEmptyAssignmentGroups
// }
