// listings.js
// --------------
// get orders from a catalog instance
const config = require('./config');
const error_checks = require('../error_check');
const pagination = require('../pagination');

const axios = config.instance;

async function getListings() {
    console.log('inside getListings');
    let nextPage = 'courses?per_page=100';
    const listings = [];

    while (nextPage) {
        const response = await axios.get(nextPage);
        //console.log(response.data.courses.length);
        listings.push(...response.data.courses);
        if (response.headers.get('link')) {
            nextPage = pagination.getNextPage(response.headers.get('link'));
        } else {
            nextPage = false;
        }
        console.log(nextPage);
    }
    console.log(listings.length);
}

(async () => {

    console.log('hello');
    const listings = await getListings();
    //console.log(listings.length);
    console.log('finished');
})()