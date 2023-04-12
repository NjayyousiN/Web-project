class ConfPlus {

//Constructor intialize values
    constructor() {
        this.usersData ={};
        this.institutionsData = [];
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

//Function to retreive the author affiliations.
    async getInstitutionsData() {
        try {
            const response = await fetch('institutions.json');
            this.institutionsData = await response.json();
        } catch (err) {
            console.error('An error occured during fetching institutions data.', err)
        }
    }

    async init() {
        await this.getUserData();
        await this.getInstitutionsData();
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
    login(email, password) {
        //First, validate email/pass formats
        if(!this.isEmailValid(email) || !this.isPasswordValid(password)) {
            return { success: false, message: 'Incorrect email or password.' };
        }

        //Group all users in 1 array
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
            return { success: true, message: 'Login was successful.' };

        } else {
            return { success: false, message: 'Logn was unsuccessful.' };
        }
    }
    
    //Loads the selected page
    async loadPage(pageUrl) {
        const mainContent = document.querySelector("#main-content");
        const page = await fetch(pageUrl);
        const pageHTMLContent = await page.text();
        mainContent.innerHTML = pageHTMLContent;
    }

    //Submit the paper
    async submitPaper(paper_title, paper_abstract, selectedAuthors, presenterIndex, attachedPDFs) {
        
        const pdfUpload = await fetch('/api/upload', {

        method: 'POST',
        body: attachedPDFs,
    });

        if (!pdfUpload.ok) {

        console.error('An Error occured while attaching the PDF ');
        return;
    }

        const pdfUrl = await pdfUpload.text();

        // Save paper details
        const paperDetails = {
        id: Date.now(),
        paper_title,
        paper_abstract,
        authors: selectedAuthors,
        presenter: selectedAuthors[presenterIndex],
        pdfUrl,
        reviewers: [],
    };

        const savePaper = await fetch('/api/papers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paperDetails),
    });

        if (!savePaper.ok) {
        console.error('An Error occured while saving the paper details');
        return;
    }

        // Assign reviewers to papers
        await this.assignReviewers(paperDetails.id);
    }

    //Populate the selection list of authors with values from 'users.json'
    async populateAuthors() {
        await confPlus.init();
        const authorsSelect = document.querySelector('#authors');
        const presenterSelect = document.querySelector('#presenter');
        const affiliationsSelect = document.querySelector('#affiliations');

        this.usersData.authors.forEach((author, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${author.firstName} ${author.lastName} (${author.email})`;
            authorsSelect.appendChild(option);

            const presenterOption = option.cloneNode(true);
            presenterSelect.appendChild(presenterOption);
        });

        this.institutionsData.forEach((institution, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = institution;
            affiliationsSelect.appendChild(option);
        });
    }


    //Assign 2 random reviewers to each paper
    async assignReviewers(paperId) {
        const reviewers_list = this.usersData.reviewers;
        const selectedReviewers = [];

        while (selectedReviewers.length < 2) {
        const rdmIndex = Math.floor(Math.random() * reviewers_list.length);
        const reviewer = reviewers_list[rdmIndex];

        if (!selectedReviewers.includes(reviewer)) {
            selectedReviewers.push(reviewer);
        }
        }

        const updateResponse = await fetch(`/api/papers/${paperId}/assign-reviewers`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewers_list: selectedReviewers }),
        });

        if (!updateResponse.ok) {
        console.error('An Error occured while assigning reviewers');
        return;
        }

        console.log('Reviewers assigned successfully');
    }
            

}

//Instantiation 
const confPlus = new ConfPlus();
confPlus.init();

//Action to be taken after clicking on "login" button 
    document.querySelector('#login-container').addEventListener("submit", (e) =>{
        e.preventDefault();

        const email = document.querySelector('#email_input').value;
        const password = document.querySelector('#password_input').value;
        const login_attempt = confPlus.login(email, password);

        //If the login was successful, redirect to the referenced pages according to the user type
        if(login_attempt.success) {
            console.log(login_attempt.message);

            if(userFound.authors) {
                loadPage('authors-page.html');
            }
        
            if(userFound.reviewers) {
                loadPage('reviewers-page.html');
            }

            if(userFound.organizers) {
                loadPage('organizers-page.html');
            }
        } else {
            console.log(login_attempt.message);
            //else, refresh page
            loadPage('login-page.html');
        }
});


//Actions to be taaken after clicking on "submit" button
    document.querySelector('#submit-paper').addEventListener('submit', async (e) => {
        e.preventDefault();

        const paper_title = document.querySelector('#title').value;
        const paper_abstract = document.querySelector('#abstract').value;
        const authorsSelect = document.querySelector('#authors');
        const selectedAuthors = Array.from(authorsSelect.selectedOptions).map(option => confPlus.usersData.authors[option.value]);
        const presenterIndex = document.querySelector('#presenter').value;
        const attachedPDFs = document.querySelector('#pdf-file').files;

        await confPlus.submitPaper(paper_title, paper_abstract, selectedAuthors, presenterIndex, attachedPDFs);
    });

    