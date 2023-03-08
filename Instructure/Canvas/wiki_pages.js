// wiki_pages.js
const config = require('./config');
const pagination = require('../pagination');
const errorCheck = require('../error_check');
const questionAsker = require('../questionAsker');

const axios = config.instance;

// const pageParams = {
//     wiki_page: {
//         title: 'This is my page title',
//         body: 'This is the body'
//     }
// };

async function createWikiPage(course) {
    let url = `courses/${course}/pages`;
    let title = 'This is the page title';
    let body = 'This is the page body';

    console.log('Creating a page');
    const response = await errorCheck.errorCheck(async () => {
        return await axios.post(url, {
            wiki_page: {
                title: title,
                body: body
            }
        });
    });
    return response.data;
}

async function getAllPages(url, pages = []) {
    let thePages = pages;

    console.log('Getting pages');
    const response = await errorCheck.errorCheck(async () => {
        return await axios.get(url);
    });
    for (let page of response.data) {
        thePages.push(page);
    }
    let nextPage = pagination.getNextPage(response.headers.get('link'));

    if (nextPage != false) {
        thePages = await getAllPages(nextPage, thePages);
    }
    return thePages;
}

async function updatePage(theCourse, pageID, pageData = {}) {
    let url = `/courses/${theCourse}/pages/${pageID}`

    console.log('Updating page');
    const response = await errorCheck.errorCheck(async () => {
        return await axios.put(url, pageData);
    });
    return response.data;
}

async function deletePage(pageID) {

}

(async () => {
    // let theCourse = await questionAsker.questionDetails('Which course do you want to get pages from?\n');

    // let myPages = await getAllPages(`courses/${theCourse}/pages?per_page=100`);
    // console.log(myPages.length);

    // let numPages = await questionAsker.questionDetails('How many pages do you want to make?\n');
    // for (let i = 0; i < numPages; i++)
    //     await createWikiPage(6005);
    // console.log('Finished creating pages');

    // console.log(await updatePage(6005, 8788, { wiki_page: { title: 'My updated title' } }));
    questionAsker.close();
})();
