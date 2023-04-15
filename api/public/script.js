// import { nanoid } from "nanoid";

class ConfPlus {

//Constructor intialize values
    constructor() {
        this.usersData ={};
        this.institutionsData = [];
    }

//Function to retreive the user email and password from the database (users.json)
    async getUserData() {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: "GET"
            });
            const data = await response.json();
            this.usersData = {
                organizers : data.filter(u => u.role === 'organizer'),
                reviewers : data.filter(u => u.role === 'reviewer'),
                authors: data.filter(u => u.role === 'author')
            };
        } catch (err) {
            console.error('An error occured during fetching user data.', err);
        }
    }

//Function to retreive the author affiliations.
    async getInstitutionsData() {
        try {
            const response = await fetch('http://localhost:3000/api/institutions');
            this.institutionsData = await response.json();
        } catch (err) {
            console.error('An error occured during fetching institutions data.', err)
        }
    }

//Initiating get functions
    async init() {
        await this.getUserData();
        await this.getInstitutionsData();
    }

/*                                       CASE 1 STARTS HERE                                       */

//Email format validation
    isEmailValid(email) {
        var validChrs = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(email.match(validChrs)) {
            console.log('Valid Email Format');
            return true;
        } else {
            console.log('Invalid Email Format!');
            return false;
        }
    }

//Password format validation
    isPasswordValid(password) {
        var validChrs=  /^[A-Za-z]\w{7,14}$/;

        if(password.match(validChrs)) {
            console.log('Valid Password Format');
            return true;
        } else {
            console.log('Invalid Password Format');
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

        //When user is found, change directURL and the page itself, return the user
        if(userFound) {
            const redirectUrl = `/${userFound.role}-page.html`;
            window.location.href = redirectUrl;
            return { success: true, message: 'Login was successful.', user: userFound };

        } else {
            return { success: false, message: 'Logn was unsuccessful.' };
        }
    }
    
//Loads the selected page
    async loadPage(pageUrl) {
        window.location.replace(pageUrl);
    }

/*                                       CASE 2 STARTS HERE                                       */

//Submit the paper
    async submitPaper(paper_title, paper_abstract, selectedAuthors, presenterIndex, attachedPdfs) {
        
        const pdfUpload = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: attachedPdfs,
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
        // reviewers: [],
    };

        const savePaper = await fetch('http://localhost:3000/api/papers', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        body: JSON.stringify(paperDetails),
    });

        if (!savePaper.ok) {
        console.error('An Error occured while saving the paper details');
        return;
    }

        // Assign reviewers to papers
        await this.assignReviewers(paperDetails.id);
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
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        body: JSON.stringify({ reviewers_list: selectedReviewers }),
        });

        if (!updateResponse.ok) {
        console.error('An Error occured while assigning reviewers');
        return;
        }

        console.log('Reviewers assigned successfully');
    } 

//Populate the selection list of authors with values from 'users.json'
    // async populateAuthors() {
    //     await confPlus.init();
    //     const authorsSelect = document.querySelector('#authors');
    //     const presenterSelect = document.querySelector('#presenter');
    //     const affiliationsSelect = document.querySelector('#affiliations');

    //     this.usersData.authors.forEach((author, index) => {
    //         const option = document.createElement('option');
    //         option.value = index;
    //         option.textContent = `${author.firstName} ${author.lastName} (${author.email})`;
    //         authorsSelect.appendChild(option);

    //         const presenterOption = option.cloneNode(true);
    //         presenterSelect.appendChild(presenterOption);
    //     });

    //     this.institutionsData.forEach((institution, index) => {
    //         const option = document.createElement('option');
    //         option.value = index;
    //         option.textContent = institution;
    //         affiliationsSelect.appendChild(option);
    //     });
    // }      
    
        async getAssignedPapers(email) {
            const response = await fetch('http://localhost:3000/api/papers', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const assignedPapers = await response.json();
            const papersList = document.querySelector('#papers-list');
            
            assignedPapers.forEach((paper) => {
            const list = document.createElement('li');
            list.textContent = paper.title;
            list.dataset.paperID = paper.id;
            papersList.appendChild(list);
    });

}
   

//case 3
    showReviewForm(paper) {
        const reviewForm = document.querySelector('#review-form');
        
        const overallEvaluation = reviewForm.querySelector('#overall-evaluation');
        const paperContribution = reviewForm.querySelector('#paper-contribution');
        const paperStrengths = reviewForm.querySelector('#paper-strengths');
        const paperWeaknesses = reviewForm.querySelector('#paper-weaknesses');

        overallEvaluation.value = paper.review ? paper.review.overallEvaluation : '';
        paperContribution.value = paper.review ? paper.review.paperContribution : '';
        paperStrengths.value = paper.review ? paper.review.paperStrengths : '';
        paperWeaknesses.value = paper.review ? paper.review.paperWeaknesses : '';

        reviewForm.style.display = 'block';
}    

}

//Instantiation 
const confPlus = new ConfPlus();
confPlus.init();

/*                                       EVENT LISTENERS                                       */

document.addEventListener("DOMContentLoaded", async () => {

//Action to be taken after clicking on "login" button 
    document.querySelector('#login-form').addEventListener("submit", async (e) =>{
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const login_attempt = await confPlus.login(email, password);

        //If the login was successful, redirect to the referenced pages according to the user type
        if(login_attempt.success) {
            console.log(login_attempt.message);
            const userFound = login_attempt.user;
            let redirectUrl = '';

            if(userFound.role === 'author') {
                redirectUrl = 'submit-paper-page.html';
            }
        
            if(userFound.role === 'reviewer') {
                redirectUrl = 'review-papers.html';
            }

            if(userFound.role === 'organizer') {
                redirectUrl = 'schedule-editor.html';
            }

            window.location.replace(redirectUrl);

        } else {
            //Log it
            console.log(login_attempt.message);

            //else, refresh page and send an alert
            await confPlus.loadPage('login-page.html');
            alert('Wrong Email or Password. Retry again.');
        }
});


//Actions to be taken after clicking on "submit" button
    document.querySelector('#submit-paper').addEventListener('submit', async (e) => {
        e.preventDefault();

        const paper_title = document.querySelector('#title').value;
        const paper_abstract = document.querySelector('#abstract').value;

        const author_fname = document.querySelector("#first_name").value;
        const author_lname = document.querySelector("#last_name").value;
        const author_email = document.querySelector("#email").value;
        const author_affiliation = document.querySelector("#affiliation").value;



        const authorsSelect = document.querySelector('#add-author');

        const presenterIndex = document.querySelector('#presenter').value;
        const attachedPdfs = document.querySelector('#paper_pdf').files;

        await confPlus.submitPaper(paper_title, paper_abstract, presenterIndex, attachedPdfs);
    });



    
        const res = await fetch('http://localhost:3000/api/institutions', {
            method: 'GET',
        });
        const institutions = await res.json();
        document.querySelector("#affiliation").innerHTML = institutions
        .map((i) => `<option value ="${i.institution}"> ${i.institution}</option>`).join(" ")
    });



// const selectedAuthors = Array.from(authorsSelect.selectedOptions).map(option => confPlus.usersData.authors[option.value]);
//selectedAuthors