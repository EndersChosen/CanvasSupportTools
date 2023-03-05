// conversations.js
const config = require('./config');
const pagination = require('../pagination');
const csvExporter = require('../csvExporter');

const axios = config.instance;

async function getConversations(user, url = 'conversations', scope = 'inbox', conversations = []) {
    console.log('Getting conversations');

    let myConversations = conversations;
    let myURL = '';
    if (url === 'conversations') {
        myURL = `${url}?scope=${scope}&as_user_id=${user}&per_page=100`;
    } else {
        myURL = url;
    }

    const response = await axios.get(myURL);
    for (let message of response.data) {
        myConversations.push(message);
    }

    let nextPage = pagination.getNextPage(response.headers.get('link'));
    if (nextPage !== false) {
        myConversations = await getConversations(user, nextPage, null, myConversations);
    } else {
        console.log('Last page');
    }

    return myConversations;
}

async function deleteForAll(conversationID) {
    console.log('Deleting conversation: ', conversationID);
    let myURL = `conversations/${conversationID}/delete_for_all`;
    await axios.delete(myURL);
}

async function bulkDelete(userID, messageFilter) {
    let allConversations = await getConversations(userID);
    let filteredConversations = allConversations.filter((conversation) => {
        if (conversation.subject === messageFilter)
            return conversation;
    });
    csvExporter.exportToCSV(filteredConversations, 'deletedConverstations');

    let loops = Math.floor(filteredConversations.length / 40);
    let requests = [];
    let index = 0;


    // adding requests to an array to process in parallel
    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            console.log('adding reqeusts to promise');
            try {
                requests.push(deleteForAll(filteredConversations[index].id));
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
        index++;
    }
    for (let i = 0; i < filteredConversations.length % 40; i++) {
        console.log('adding reqeusts to promise');
        try {
            requests.push(deleteForAll(filteredConversations[index].id));
        } catch (error) {
            console.log(`error adding ${filteredConversations[index]} to array`);
        }
        index++;
    }
    try {
        await Promise.all(requests);
    } catch (error) {
        console.log('There was an error', error.message, error.url);
        return;
    }
    console.log(filteredConversations.length);
}

// (async () => {
//     // let theConversations = await getConversations(26);
//     // console.log('My user had this many', theConversations.length);

//     //await deleteForAll(1466);

//     await bulkDelete(26, 'This is a test')
//     console.log('Finsihed');

// })();

modules.export = {
    getConversations, bulkDelete, deleteForAll
};