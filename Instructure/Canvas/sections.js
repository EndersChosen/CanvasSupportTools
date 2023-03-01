// sections.js
const config = require('./config');
const error_Check = require('../error_check');
const pagination = require('../pagination');

const axios = config.instance;

async function getCourseSection(url, sections = []) {
    let mySections = sections;

    console.log('Getting section(s)');
    const response = await error_Check.errorCheck(async () => {
        return await axios.get(url);
    });
    for (let section of response.data) {
        mySections.push(section);
    }
    let nextPage = pagination.getNextPage(response.headers.get('link'));
    if (nextPage != false) {
        mySections = getCourseSection(nextPage, mySections);
    }
    return mySections;
}

async function createCourseSection(url, num) {
    const requests = [];
    const sections = [];

    console.log(`Creating ${num} new section(s)`);
    for (let i = 0; i < num; i++) {
        requests.push(axios.post(url, {
            course_section: {
                name: `New Section ${num}`
            }
        }));
    }
    console.log(`${requests.length} sections to create`);
    console.log('Making sections');

    startTime = performance.now();
    if (num <= 40) { // if able to perform all requests without be throttled
        await Promise.all(requests);
    } else {
        for (let request of requests) {
            await request;
        }
    }
    endTime = performance.now();

    console.log(`Created ${num} section(s) in ${Math.floor(endTime - startTime) / 1000} seconds`);

    return sections;
}

async function deleteCourseSection(setionID) {
    console.log('Deleting section(s)');

    const response = await error_Check.errorCheck(async () => {
        return await axios.delete(`sections/${setionID}`);
    });
    if (response === false) {
        return response;
    }

    return response.data; // returning info about the section which was deleted
}

async function deleteAllCourseSections(courseID) {
    let sections = await getCourseSection(`courses/${courseID}/sections?per_page=100`);

    // deleting sections 1 at a time, which seems slow...
    for (let section of sections) {
        await deleteCourseSection(section.id);
    }
    console.log('Finished deleting all sections');
}

// (async () => {
//     // let startTime = performance.now();
//     // let theSections = await getCourseSection('courses/6005/sections');
//     // let endTime = performance.now();
//     // console.log(`Got all sections in ${Math.floor(endTime - startTime) / 1000}`);
//     // console.log(theSections);
//     //console.log(await createCourseSection('courses/6005/sections', 10));
//     // console.log(await deleteCourseSection(4807));
//     await deleteAllCourseSections(6005);
// })();

module.exports = {
    getCourseSection, deleteAllCourseSections, deleteCourseSection, createCourseSection
};