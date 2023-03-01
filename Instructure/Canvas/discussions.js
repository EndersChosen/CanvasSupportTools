// discussions.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');

const axios = config.instance;

async function getDiscussions(courseID = '', discussions = [], onlyAnnouncements = false) {
    console.log('Getting Discussions');
    let myURL = '';
    let myDiscussions = discussions;

    // check to see if the full url was passed as the course id
    if (typeof courseID === 'number')
        myURL = `/courses/${courseID}/discussion_topics?per_page=100&only_announcements=${onlyAnnouncements}`;
    else
        myURL = courseID;

    const response = await errorCheck.errorCheck(async () => {
        return await axios.get(myURL);
    });
    for (let discussion of response.data) {
        myDiscussions.push(discussion);
    }

    let nextPage = await pagination.getNextPage(response.headers.get('link'));
    if (nextPage != false) {
        myDiscussions = await getDiscussions(nextPage, myDiscussions);
    }

    return myDiscussions;
}

async function createDiscussion(courseID, num, isAnnouncement = false) {
    console.log('Creating a dicussion');
    let url = `courses/${courseID}/discussion_topics`;
    let params = {
        title: 'Dicussion Title',
        message: 'This is the message',
        discussion_type: 'threaded',
        is_announcement: isAnnouncement
    };
    let requests = [];
    let loops = Math.floor(num / 40);

    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            console.log('adding reqeusts to promise');
            try {
                requests.push(axios.post(url, params));
            } catch (error) {
                console.log(`Error adding ${url}`, error.message);
            }
        }
        try {
            await Promise.all(requests);
        } catch (error) {
            console.log('There was an error', error.message, error.url);
            return;
        }
        console.log('Processed requests');
        await (function wait() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            })
        })();
        requests = [];
        loops--;
    }
    console.log('Outside while');
    for (let i = 0; i < num % 40; i++) {
        try {
            requests.push(axios.post(url, params));
        } catch (error) {
            console.log(`Error adding ${url}`, error.message);
        }
    }
    try {
        await Promise.all(requests);
    } catch (error) {
        console.log('There was an error', error.message, error.url);
        return;
    }

    return `Created ${num} discussion(s)`;
}

async function deleteDiscussion(courseID, topicID) {
    console.log('Deleting discussion');

    let url = `courses/${courseID}/discussion_topics/${topicID}`;

    const response = await errorCheck.errorCheck(async () => {
        return await axios.delete(url);
    });

    return response.data;
}

async function deleteAllDiscussions(courseID) {
    console.log(`Deleting dicussions in ${courseID}`);
    let index = 0;
    let discussionList = await getDiscussions(courseID);
    let loops = Math.floor(discussionList.length / 40);
    let requests = [];

    console.log(discussionList.length);
    // let startTime = performance.now();
    // await axios.delete(`courses/${courseID}/discussion_topics/${discussionList[index].id}`)
    // let endTime = performance.now();
    // console.log(`Deleting one discussion took ${Math.floor(endTime - startTime) / 1000} seconds`);

    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            console.log('adding reqeusts to promise');
            console.log(`The index is ${index}, the id is ${discussionList[index].id}`);
            try {
                requests.push(axios.delete(`courses/${courseID}/discussion_topics/${discussionList[index].id}`));
            } catch (error) {
                console.log(`error adding ${discussionList[index]} to array`);
            }
            index++;
        }
        try {
            await Promise.all(requests);
        } catch (error) {
            console.log('There was an error', error.message, error.url);
            return;
        }
        console.log('Processed requests');
        await (function wait() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            })
        })();
        requests = [];
        loops--;
    }
    console.log(index);
    console.log('Outside while');
    for (let i = 0; i < discussionList.length % 40; i++) {
        console.log('adding reqeusts to promise');
        try {
            requests.push(axios.delete(`courses/${courseID}/discussion_topics/${discussionList[index].id}`));
        } catch (error) {
            console.log(`error adding ${discussionList[index]} to array`);
        }
        index++;
    }
    try {
        await Promise.all(requests);
    } catch (error) {
        console.log('There was an error', error.message, error.url);
        return;
    }
    console.log('Finished deleting all discussion topics');


    // for (let discussion of discussions) {
    //     await deleteDiscussion(courseID, discussion.id);
    // }
}

// (async () => {
//     // let startTime = performance.now();
//     // console.log(await createDiscussion(6005, 1, true));
//     // let endTime = performance.now();
//     // console.log(`took ${Math.floor(endTime - startTime) / 1000}`);
//     // console.log(await deleteDiscussion(6005, 4988));
//     // let theDiscussions = await getDiscussions(6005);
//     //console.log(`Announcement: `, await getDiscussions(6005, [], true));


//     // let startTime = performance.now();
//     // await deleteAllDiscussions(6005);
//     // let endTime = performance.now();
//     // console.log(`Deleted all discussions in ${Math.floor(endTime - startTime) / 1000} seconds`);
// })();

module.exports = {
    getDiscussions, createDiscussion, deleteAllDiscussions, deleteDiscussion
};