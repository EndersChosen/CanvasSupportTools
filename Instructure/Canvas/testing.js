const csvExporter = require('./csvExporter');
const questionAsker = require('./questionAsker');
const assignmentGroups = require('./assignment_groups');
const config = require('./config');
const fs = require('fs');

const axios = config.instance;

// url = 'https://ckruger.test.instructure.com/api/v1/courses/5970/users';


// async function getUsers() {
//     const response = await fetch(url, {
//         headers: {
//             'Authorization': 'Bearer 17~FKoZpVSzpgmgm35MGzo10zZ5vvS4XPkz24Km2zF8VCv25qtvxqTMraVFXkS44NOM'
//         }
//     });
//     const data = await response.json();

//     const csvHeaders = Object.keys(data[0]).toString() + '\n';
//     writer = fs.createWriteStream('./myCSV.csv', { flags: 'a' });

//     await csvExporter.toCSV(writer, csvHeaders);
//     await csvExporter.toCSV(writer, data);

//     //await toCSV(csvHeaders);

//     csvExporter.firstTime = true;
//     writer.end();
// }

// getUsers();

// let theQuestion = 'what course? ';
// let theAnswer;

// const aGroups = assignmentGroups;

// (async () => {
//     theAnswer = await questionAsker.questionDetails(theQuestion);
//     // console.log(theAnswer);

//     const theAssignmentGroups = await aGroups.getAssignmentGroups(theAnswer);
//     console.log(theAssignmentGroups.length);
// })();

let myParams = {
    include: [
        'can_edit'
    ]
};

(async () => {
    // const response = await axios.get('https://ckruger.test.instructure.com/api/v1/courses/5970/assignments', {
    //     params: {
    //         myParams
    //     }
    // });
    // console.log(response.data);
    let users = [{ name: 'myname', skip_registration: true }];
    console.log(users);
})();
