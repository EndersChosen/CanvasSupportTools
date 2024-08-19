// menu.js

const config = require('./config.js');
const pagination = require('../pagination.js');
const questionAsker = require('../questionAsker');
const axios = config.instance;
const assignmentGroups = require('./assignment_groups.js');
const assignments = require('./assignments.js');
const assignmentOverrides = require('./assignment_overrides.js');
const classicQuizzes = require('./classic_quizzes.js');
const communicationChannels = require('./communication_channels.js');
const conversations = require('./conversations.js');
const courses = require('./courses.js');
const discussions = require('./discussions.js');
const enrollments = require('./enrollments.js');
const modules = require('./modules.js');
const sections = require('./sections.js');
const users = require('./users.js');
const wikiPages = require('./wiki_pages.js');


const fs = require('fs');

const menu = async () => {
    const curDomain = await questionAsker.questionDetails('What domain: ');
    axios.defaults.baseURL = `https://${curDomain}/api/v1`;

    // create a choice menu based on the names of the js files in the current directory
    const skipFiles = ['menu.js', 'config.js', 'index.js', 'testing.js', 'submitter.js'];
    const files = fs.readdirSync(__dirname);
    const jsFiles = files.filter((file) => {
        if (file.endsWith('.js') && skipFiles.indexOf(file) === -1) {
            return file;
        }
    }).map((file) => file.charAt(0).toUpperCase() + file.slice(1, file.length - 3));

    let choiceMenu = '';
    jsFiles.forEach((file, index) => {
        choiceMenu += `${index + 1}. ${file}\n`;
    });

    let choice;
    do {
        choice = await questionAsker.questionDetails(`What would you like to do?\n${choiceMenu}Z. Exit\n`);
        // let choice = await questionAsker.questionDetails(`What would you like to do?\n
        //     1. Create Assignment Groups\n
        //     2.Delete Empty Assignment Groups\n
        //     3.Exit\n`);
        // let course = await questionAsker.questionDetails('What course: ');
        // let number = await questionAsker.questionDetails('How many assignment groups: ');


        switch (choice) {
            case '1':
                // create a prompt based on the function name exported from the file assignments.js
                await subMenu(assignments);
                break;
            case '2':
                await subMenu(assignmentGroups);
                break;
            case '3':
                await subMenu(assignmentOverrides);
                break;
            case '4':
                await subMenu(classicQuizzes);
                break;
            case '5':
                await subMenu(communicationChannels);
                break;
            case '6':
                await subMenu(conversations);
                break;
            case '7':
                await subMenu(courses);
                break;
            case '8':
                await subMenu(discussions);
                break;
            case '9':
                await subMenu(enrollments);
                break;
            case '10':
                await subMenu(modules);
                break;
            case '11':
                await subMenu(sections);
                break;
            case '12':
                await subMenu(users);
                break;
            case '13':
                await subMenu(wikiPages);
                break;
            case 'Z':
            case 'z':
                console.log('Exiting');
                process.exit();
                break;
            default:
                console.log('Invalid choice');
                break;
        }
    } while (choice !== 'Z' || choice !== 'z');
};

// display a menu based on the keys of the passed in object
async function subMenu(options) {
    const subMenu = Object.keys(options).map((key, index) => {
        return `${index + 1}. ${key}\n`;
    }).join('');

    let subMenuChoice = await questionAsker.questionDetails(`Choose an action:\n${subMenu}Z. Go Back\n`);
    if (subMenuChoice === 'Z') {
        menu();
    } else {
        let choice = Object.keys(options)[subMenuChoice - 1];
        await options[choice]();
        subMenu(options);
    }
}

menu();