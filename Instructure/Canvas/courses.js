// courses.js
const config = require('./config.js');
const questionAsker = require('../questionAsker');

const axios = config.instance;

async function createCourses(number) {

    console.log(`Creating ${number} course(s)`);
    const courseIDs = [];
    const data = {
        course: {
            name: 'Replace Me',
            course_code: 'Replace Me',
            //"start_at": '2011-01-01T01:00Z',
            //'course[end_at]': '2011-01-01T01:00Z',
            license: 'private',
            is_public: false,
            is_public_to_auth_users: false,
            public_syllabus: false,
            public_syllabus_to_auth: false,
            public_description: 'Public Description goes here',
            allow_student_wiki_edits: false,
            allow_wiki_comments: false,
            allow_student_forum_attachments: false,
            open_enrollment: false,
            self_enrollment: false,
            restrict_enrollments_to_course_dates: false,
            term_id: '1',
            //''sis_course_id]': 'SIS Course ID goes here',
            //''integration_id]': 'Course integration Id goes here',
            hide_final_grades: false,
            apply_assignment_group_weights: false,
            time_zone: 'America/Denver',
            default_view: 'feed',
            syllabus_body: 'Syllabus body goes here',
            grading_standard_id: null,
            grade_passback_setting: 'disabled',
            course_format: 'online'
        },
        enable_sis_reactivation: false,
        offer: false,
        enroll_me: false
    };

    try {
        let startTime = performance.now();
        for (let num = 0; num < number; num++) {
            const response = await axios.post('accounts/self/courses', data);
            courseIDs.push(response.data.id);

            // ------------------------------------------------
            // Write something that checks api limit
            // -----------------------------------------------

            console.log(response.headers.get('x-rate-limit-remaining'));
            console.log(response.headers.get('x-request-cost'));
        }
        let endTime = performance.now();
        console.log(`Created ${courseIDs.length} course(s) in ${Math.floor(Math.floor(endTime - startTime)) / 1000} seconds`);
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('A different error', error.message);
        }
    }
    return courseIDs;
}

// (async () => {
//     let numCourses = await questionAsker.questionDetails('How many courses?\n> ');
//     questionAsker.close();
//     console.log(await createCourses(numCourses));
// })();

module.exports = {
    createCourses
};
