// checks request for errors and returns the data on successful response
async function errorCheck(checkRequest) {
    try {
        return await checkRequest();
    } catch (error) {
        if (error.response) {
            console.log(`There was a ${error.response.status} "${error.response.statusText}" error making a "${(error.config.method).toUpperCase()}" request to ${error.config.url}`, error.response.data);
            return false;
        } else if (error.request) {
            console.log('There was an error creating the user in the request', error.request);
            return false;
        } else {
            console.log('Some other error in creating the user', error.message);
            return false;
        }
    }
}

module.exports = {
    errorCheck
};
