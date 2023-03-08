// api from https://randomuser.me/documentation
class Person {
    constructor(firstName, lastName, email, loginID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.loginID = loginID;
        this.password = loginID;
    }
}

async function getRandomPerson() {
    const requestOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('https://randomuser.me/api/', requestOptions);
        if (!response.ok) {
            throw new Error(response.status);
        }
        const dataResponse = await response.json();
        const person1 = new Person(dataResponse.results[0].name.first, dataResponse.results[0].name.last, dataResponse.results[0].email, Math.floor(100000000 + Math.random() * 900000000));
        //console.log(person1);
        return person1;
    } catch (error) {
        console.log('Error fetching name', error);
    }
}

module.exports = {
    getRandomPerson
};
