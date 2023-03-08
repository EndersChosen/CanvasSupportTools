// classic_quizzes.js
const config = require('./config');
const errorCheck = require('../error_check');
const pagination = require('../pagination');

const axios = config.instance;

async function createClassicQuiz(courseID, num = 1) {
    console.log('Creating Classic Quizzes');

    let url = `courses/${courseID}/quizzes`;
    let requests = [];
    let loops = Math.floor(num / 40);

    const params = {
        quiz: {
            title: 'This is a quiz title',
            description: 'This is the quiz description',
            quiz_type: 'assignment',
            allowed_attempts: -1,
            scoring_policy: 'keep_latest'
        }
    };



    // loading the request
    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < 40; i++) {
            requests.push(axios.post(url, params));
        }
        console.log('Sending requests');
        await Promise.all(requests);
        console.log('Done with requests');
        await (function wait() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        })();
        requests = [];
        loops--;
    }
    for (let i = 0; i < num % 40; i++) {
        requests.push(axios.post(url, params));
    }
    console.log('Outside loop, sending final requests');
    await Promise.all(requests);

    return 'Finished creating quizzes';
}

async function editClassicQuiz(quizID, params = {}) {

}

async function getClassicQuiz(course, url, quizzes = [], search_term = null) {
    console.log('Getting classic quizzes');

    let theQuizzes = quizzes;
    let myUrl = '';
    if (course != null) {
        if (search_term != null) {
            myUrl += `courses/${course}/quizzes?per_page=100&search_term=${search_term}`;
        }
        myUrl = `courses/${course}/quizzes?per_page=100`;
    } else {
        myUrl = url;
    }

    const response = await errorCheck.errorCheck(async () => {
        return await axios.get(myUrl);
    });
    for (let quiz of response.data) {
        theQuizzes.push(quiz);
    }

    let nextPage = pagination.getNextPage(response.headers.get('link'));
    if (nextPage != false) {
        theQuizzes = await getClassicQuiz(null, nextPage, theQuizzes);
    }

    return theQuizzes;
}

async function deleteClassicQuiz(courseID, quizID) {
    console.log('Deleting quiz');

    let url = `/courses/${courseID}/quizzes/${quizID}`;
    const response = await errorCheck.errorCheck(async () => {
        return await axios.delete(url);
    });

    return response.data;
}

(async () => {
    // console.log(await createClassicQuiz(6005, 41));
    // console.log('Deleted quiz', await deleteClassicQuiz(6005, 5828));

    // let theQuizzes = await getClassicQuiz(6005);
    // console.log(theQuizzes.length);


})();

// module.exports = {
//     createClassicQuiz,editClassicQuiz,getClassicQuiz,deleteClassicQuiz
// };
