class Question {
    constructor() {
        this.env = 'What environment are you in?\n[prod],[beta],[test]\n> ';
        this.domain = 'What is your canvas domain?\n> ';
        this.token = 'Enter your API token\n> ';
        this.action = 'What do you want to do?\n[create],[udpate],[delete],[get]\n> ';
    }
}

module.exports = {
    Question
};
