class Requester {
    constructor(token, env, domain, action) {
        this.env = env;
        this.action = action;
        this.token = token;
        this.domain = domain;
        if (action === 'create') {
            this.method = 'post';
        } else if (action === 'update') {
            this.method = 'put';
        } else {
            this.method = action;
        }
    }
}

module.exports = {
    Requester
};