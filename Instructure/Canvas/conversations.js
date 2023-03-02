// conversations.js
const config = require('./config');
const pagination = require('../pagination');

const axios = config.instance;

async function getConversations(user, url = 'conversations', scope = 'inbox', conversations = []) {
    let myConversations = conversations;
    let myURL = '';
    if (url === 'conversations') {
        myURL = `${url}?scope=${scope}&as_user_id=${user}&per_page=10`;
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

(async () => {
    // let theConversations = await getConversations(26);
    // console.log('My user had this many', theConversations.length);

    await deleteForAll(1466);
    console.log('Finsihed');

})();