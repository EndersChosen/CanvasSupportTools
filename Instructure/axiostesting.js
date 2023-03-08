const axios = require('axios');

const data = {
    assignment: {
        name: "From data"
    }
};

(async () => {
    const newAssignment = await axios.put('/courses/5970/assignments/14051', data);
    console.log(newAssignment.data);
})();
