// orders.js
// --------------
// get orders from a catalog instance
const config = require('./config');
const error_checks = require('../error_check');
const pagination = require('../pagination');

const axios = config.instance;

let url = 'orders';
let searchFilter = 'example@example.com';

const params = {
    from: '2023-01-17T00:00:00.000Z0',
    to: '2023-02-16T23:59:21.434Z0'
};

async function getOrders() {
    let orders = [];
    const response = await error_checks.errorCheck(async () => {
        return await axios.get(url, { params: params });
    });

    //console.log(response.headers);
    if (response.headers.get('link')) {
        let nextPage = pagination.getNextPage(response.headers.get('link'));
        if (nextPage) {
            url = nextPage;
            orders = await getOrders();
            //console.log('Orders after the recursive return', orders);
        }
    }

    for (let order of response.data.orders) {
        orders.push(order);
    }
    //console.log('Orders after push', orders);

    return orders;
}

(async () => {
    const totalOrders = await getOrders();
    //console.log(totalOrders[0].user);
    console.log('Filtering the orders');
    const filteredOrders = totalOrders.filter(order => {
        if (order.user.email) {
            if (order.user.email.toLocaleLowerCase() === searchFilter.toLocaleLowerCase())
                return order;
        }
    });
    console.log('Total orders: ', totalOrders.length);
    console.log(`Total order from ${searchFilter}`, filteredOrders.length);
})();
