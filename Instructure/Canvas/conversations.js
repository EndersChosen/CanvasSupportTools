// conversations.js
const config = require('./config');
const pagination = require('../pagination');
const csvExporter = require('../csvExporter');
const questionAsker = require('../questionAsker');
const { deleteRequester } = require('../utilities');

const axios = config.instance;

async function getConversations(user, scope = 'inbox') {
    console.log('Getting conversations: ');


    let nextPage = `conversations?as_user_id=${user}&scope=${scope}&per_page=100`;

    // let pageCounter = pageCount;
    // let myConversations = conversations;
    // let myURL = '';
    // if (url === 'conversations') {
    //     myURL = `${url}?scope=${scope}&as_user_id=${user}&per_page=100`;
    // } else {
    //     myURL = url;
    // }

    while (nextPage) {
        try {
            const response = await axios.get(myURL);
            for (let message of response.data) {
                myConversations.push(message);
            }
            let nextPage = pagination.getNextPage(response.headers.get('link'));
            if (nextPage !== false) {
                console.log('Page: ', pageCount);
                pageCount++;
                myConversations = await getConversations(user, nextPage, null, myConversations, pageCount);
            } else {
                console.log('Last page');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    }



    // try {
    //     const response = await axios.get(myURL);
    //     for (let message of response.data) {
    //         myConversations.push(message);
    //     }
    //     let nextPage = pagination.getNextPage(response.headers.get('link'));
    //     if (nextPage !== false) {
    //         console.log('Page: ', pageCount);
    //         pageCount++;
    //         myConversations = await getConversations(user, nextPage, null, myConversations, pageCount);
    //     } else {
    //         console.log('Last page');
    //     }
    // } catch (error) {
    //     console.log('ERROR: ', error);
    // }

    return myConversations;
}

// deletes a single conversation for all users
async function deleteForAll(conversationID) {
    console.log('Deleting conversation: ', conversationID);
    let myURL = `conversations/${conversationID}/delete_for_all`;
    await axios.delete(myURL);
}

// deletes all messages sent to or from a user based on a filter string (subject)
async function bulkDelete(userID, messageFilter) {
    let allConversations = [];

    // getting all messages in the inbox and sent
    allConversations.push(await getConversations(userID, 'conversations', 'inbox'));
    allConversations.push(await getConversations(userID, 'conversations', 'sent'));
    allConversations = allConversations.flat();

    console.log('done getting converations. Total: ', allConversations.length);
    let myFilter = messageFilter;
    let filteredConversations = [];
    let more = '';


    // continue looping for any exta messages that need to be deleted
    while (true) {
        console.log('filtering converations by ', myFilter);
        let counter = 0;
        filteredConversations = allConversations.filter((conversation) => {
            if (counter % 100 === 0)
                console.log('Done with ', counter);
            // console.log('looking at: ', conversation.id, conversation.subject);
            if (conversation.subject === myFilter) {
                console.log('conversation found', conversation.id)
                return conversation;
            }
            counter++;
        });
        let areYouSure = await questionAsker.questionDetails(`Found ${filteredConversations.length} are you sure you want to delete them?(y/n) `);
        if (areYouSure === 'n') {
            more = await questionAsker.questionDetails('Want to try another filter string?(y/n) ');
            if (more === 'y') {
                myFilter = await questionAsker.questionDetails('What filter do you want to use?');
                continue;
            } else
                break;
        }
        csvExporter.exportToCSV(filteredConversations, `${myFilter}`);

        // let loops = Math.floor(filteredConversations.length / 40);
        // let requests = [];
        // let index = 0;


        // ******************************
        // deleteRequester(filtersConversations, 'conversations)
        // *******************************
        await deleteRequester(filteredConversations, 'conversations', 'delete_for_all');

        // adding requests to an array to process in parallel
        // while (loops > 0) {
        //     console.log('Inside while');
        //     for (let i = 0; i < 40; i++) {
        //         console.log('adding reqeusts to promise');
        //         try {
        //             requests.push(deleteForAll(filteredConversations[index].id));
        //         } catch (error) {
        //             console.log(`Error adding ${url}`, error.message);
        //         }
        //         index++;
        //     }
        //     try {
        //         await Promise.all(requests);
        //     } catch (error) {
        //         console.log('There was an error', error.message, error.url);
        //         return;
        //     }
        //     console.log('Processed requests');
        //     await (function wait() {
        //         return new Promise(resolve => {
        //             setTimeout(() => {
        //                 resolve();
        //             }, 2000);
        //         })
        //     })();
        //     requests = [];
        //     loops--;
        // }
        // for (let i = 0; i < filteredConversations.length % 40; i++) {
        //     console.log('adding reqeusts to promise');
        //     try {
        //         requests.push(deleteForAll(filteredConversations[index].id));
        //     } catch (error) {
        //         console.log(`error adding ${filteredConversations[index]} to array`);
        //     }
        //     index++;
        // }
        // try {
        //     await Promise.all(requests);
        // } catch (error) {
        //     console.log('There was an error', error.message, error.url);
        //     return;
        // }

        if (filteredConversations.length > 0)
            console.log(`Deleted: ${filteredConversations.length} conversations`);
        more = await questionAsker.questionDetails('Do you have more?(y/n) ');
        if (more === 'y') {
            myFilter = await questionAsker.questionDetails('What filter do you want to use? ');
        } else
            break;
    }

    questionAsker.close();
}

async function getConvos2(user1, user2, deleted = true) {
    const user1Convos = await getConversations(user1);

}

// (async () => {
//     // let theConversations = await getConversations(26);
//     // console.log('My user had this many', theConversations.length);

//     //await deleteForAll(1466);

//     // let curDomain = await questionAsker.questionDetails('What Domain: ');
//     // let user1 = await questionAsker.questionDetails('First user: ');
//     // let user2 = await questionAsker.questionDetails('Second user: ');

//     //let user = await questionAsker.questionDetails('What user: ');
//     //let filter = await questionAsker.questionDetails('What subject: ');

//     //axios.defaults.baseURL = `https://${curDomain}/api/v1/`;
//     //await bulkDelete(user, filter)
//     await getConvos2(26, 10);
//     console.log('finished');
//     questionAsker.close();
// })();

module.exports = {
    getConversations, bulkDelete, deleteForAll
};
