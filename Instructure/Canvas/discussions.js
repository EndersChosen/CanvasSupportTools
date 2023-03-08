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
    if (!isNaN(courseID))
        myURL = `/courses/${courseID}/discussion_topics?per_page=100`;
    else
        myURL = courseID;

    console.log(myURL);
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

async function getOnlyDiscussions(courseID = '') {
    console.log('Getting non-assignment discussions with no replies');
    let discussionList = await getDiscussions(courseID);
    console.log(discussionList.length);
    let onlyDiscussions = discussionList.filter((discussion) => {
        if (discussion.assignment_id === null && discussion.last_reply_at === null) {
            return discussion;
        }
    });

    return onlyDiscussions;
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

async function deleteAllDiscussions(courseID, discussionsOnly = false) {
    console.log(`Deleting dicussions in ${courseID}`);
    let index = 0;
    let discussionList = [];
    if (discussionsOnly === false) {
        discussionList = await getDiscussions(courseID);
    } else {
        console.log('getting only discussions');
        discussionList = await getOnlyDiscussions(courseID);
    }
    let loops = Math.floor(discussionList.length / 40);
    let requests = [];

    console.log(discussionList.length);


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
//     // let theDiscussions = await getDiscussions(1987);
//     // console.log(theDiscussions.length);
//     //console.log(`Announcement: `, await getDiscussions(6005, [], true));


//     let startTime = performance.now();
//     await deleteAllDiscussions(37695, true);
//     //let theDiscussions = await getOnlyDiscussions(37695);
//     let endTime = performance.now();
//     console.log(`Time: ${Math.floor(endTime - startTime) / 1000} seconds`);
// })();

module.exports = {
    getDiscussions, createDiscussion, deleteAllDiscussions, deleteDiscussion
};
