class ConfPlus {

//Constructor intialize values
    constructor() {
        this.usersData ={};
        this.fetchUserData();
}

//Function to retreive the user email and password from the database (users.json)
    async getUserData() {
        try {
            const response = await fetch('users.json');
            this.usersData = await response.json();
        } catch (err) {
            console.error('An error occured during fetching user data.', err);
        }
    }

//Email format validation
    isEmailValid(email) {
        var validChrs = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(email.match(validChrs)) {
            console.log('Valid Format');
            return true;
        } else {
            console.log('Invalid Format!');
            return false;
        }

    }

//Password format validation
    isPasswordValid(password) {
        var validChrs=  /^[A-Za-z]\w{7,14}$/;

        if(password.match(validChrs)) {
            console.log('Valid Format');
            return true;
        } else {
            console.log('Invalid Format');
            return false;
        }
    }

//Login function
    login() {
        //First, validate email/pass formats
        if(!this.isEmailValid(email) || !this.isPasswordValid(password)) {
            return { success: false, message: 'Incorrect email or password.' };
        }

        const allUsers = [
            ...this.usersData.organizers,
            ...this.usersData.reviewers,
            ...this.usersData.authors,
        ];
        
        //Find the user with the corresponding email & pass
        const userFound = allUsers.find((u) => u.email === email && u.password === password);

        //When user is found, change the style of the specified ids.
        if(userFound) {
            document.querySelector("#login").style.display = 'none';
            document.querySelector("#submit-paper").style.display = 'block';
            return { success: false, message: 'Login was successful.' };

        } else {
            return { success: false, message: 'Logn was unsuccessful.' };
        }
    }



}

const confPlus = new ConfPlus();
    
//Action to be taken after clicking on "login" button 
    document.querySelector('#login-container').addEventListener("submit", (e) =>{
        e.preventDefault();

        const email = document.querySelector('#email_input').value;
        const password = document.querySelector('#password_input').value;
        const login_attempt = confPlus.login(email, password);

        if(login_attempt.success) {
            console.log(login_attempt.message);
        } else {
            console.log(login_attempt.message);
        }
});

    