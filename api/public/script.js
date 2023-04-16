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
            const response = await fetch('http://localhost:3000/api/institutions', {
                method: "GET"
            });

            return this.institutionsData = await response.json();
        } catch (err) {
            console.error('An error occured during fetching institutions data.', err)
        }
    }

//Function to retreive the authors data.
    async getAuthorsData() {
        try {
            const response = await fetch('http://localhost:3000/api/articleAuthors', {
                method: "GET"
            });

            return this.AuthorsData = await response.json();

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
async submitPaper(paper_title, paper_abstract, selectedAuthors, presenter, attachedPdfs) {
  try {
    console.log('Attaching PDFs...');
    const formData = new FormData(); 

     for (let i = 0; i < attachedPdfs.length; i++) {
        formData.append("attachedPdf", attachedPdfs[i]);
    }
    console.log(formData)
    const pdfUpload = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!pdfUpload.ok) {
      console.error('An Error occured while attaching the PDF ');
    console.error("Server response:", await pdfUpload.json());
      return;
    }
    console.log('PDFs attached successfully. Uploading paper details...');

    if (!attachedPdfs || attachedPdfs.length === 0) {
    console.error("No PDFs attached");
    return;
    }
    
    const pdfUrl = await pdfUpload.text();

    const paperDetails = {
      title: paper_title,
      abstract: paper_abstract,
      authors: selectedAuthors,
      presenter: presenter,
      pdfURL: pdfUrl,
    };

    const savePaper = await fetch('http://localhost:3000/api/papers', {
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

    console.log('Paper saved successfully:', paperDetails);
  } catch (err) {
    console.error('An error occured while submitting the paper:', err);
  }

    // Assign reviewers to papers
    // await this.assignReviewers(paperDetails.id);     
}

//Assign 2 random reviewers to each paper
    // async assignReviewers(paperId) {
    //     const reviewers_list = this.getUserData().reviewer;
    //     const selectedReviewers = [];

    //     while (selectedReviewers.length < 2) {
    //     const rdmIndex = Math.floor(Math.random() * reviewers_list.length);
    //     const reviewer = reviewers_list[rdmIndex];

    //     if (!selectedReviewers.includes(reviewer)) {
    //         selectedReviewers.push(reviewer);
    //     }
    //     }

    //     //route still not made
    //     const updateResponse = await fetch(`/api/papers/${paperId}/assign-reviewers`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ reviewers_list: selectedReviewers }),
    //     });

    //     if (!updateResponse.ok) {
    //     console.error('An Error occured while assigning reviewers');
    //     return;
    //     }

    //     console.log('Reviewers assigned successfully');
    // } 

//Fill drop-down lists
    async populateDropList() {

        const institutions = await confPlus.getInstitutionsData();
        document.querySelector("#affiliation").innerHTML = institutions.map((institution) =>
        `<option value ="${institution.institution}"> ${institution.institution}</option>`)
        .join(" ");

        const authors = await confPlus.getAuthorsData();
        document.querySelector("#presenters").innerHTML = authors.map((author) =>
        `<option value ="${author.fname}"> ${author.fname}</option>`)
        .join(" ");

        const presenters = await confPlus.getAuthorsData();
        document.querySelector("#removeAuthor").innerHTML = presenters.map((author) =>
        `<option value ="${author.fname}"> ${author.fname}</option>`)
        .join(" ");
    }

//     async getAssignedPapers(email) {
//         const response = await fetch('http://localhost:3000/api/papers', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email })
//         });

//         const assignedPapers = await response.json();
//         const papersList = document.querySelector('#papers-list');
        
//         assignedPapers.forEach((paper) => {
//         const list = document.createElement('li');
//         list.textContent = paper.title;
//         list.dataset.paperID = paper.id;
//         papersList.appendChild(list);
// });

// }
   

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

    const addedAuthors = [];
    const loginForm = document.querySelector("#login-form");
    const submitPaperForm = document.querySelector("#paperForm");

//Validate that the form exists in the page before adding the event listener
    if (loginForm) {
      // Action to be taken after clicking on "login" button
        loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const login_attempt = await confPlus.login(email, password);

        // If the login was successful, redirect to the referenced pages according to the user type
        if (login_attempt.success) {
            console.log(login_attempt.message);
            const userFound = login_attempt.user;
            let redirectUrl = '';

            if (userFound.role === 'author') {
            redirectUrl = 'submit-paper-page.html';
            }

            if (userFound.role === 'reviewer') {
            redirectUrl = 'review-papers.html';
            }

            if (userFound.role === 'organizer') {
            redirectUrl = 'schedule-editor.html';
            }

            window.location.replace(redirectUrl);

        } else {
            // Log it
            console.log(login_attempt.message);

            // Else, refresh page and send an alert
            await confPlus.loadPage('login-page.html');
            alert('Wrong Email or Password. Retry again.');
        }
        });
    }

//Validate that the form exists in the page before adding the event listener
    if (submitPaperForm) {
        
        //Populate Lists
        await confPlus.populateDropList();
        
        //Actions to be taken after clicking on "Add Author" button
        document.querySelector("#add-author").addEventListener("click", async (e) => {

            e.preventDefault();

            const author_fname = document.querySelector("#first_name").value;
            const author_lname = document.querySelector("#last_name").value;
            const author_email = document.querySelector("#email").value;
            const author_affiliation = document.querySelector("#affiliation").value;

            const authorDetails = await fetch('http://localhost:3000/api/articleAuthors', {
            method: 'POST',

            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            fname: author_fname,
            lname: author_lname,
            email: author_email,
            affiliation: author_affiliation
            }),
        });

          if (authorDetails.ok) {

                //Update the lists
                await confPlus.populateDropList();
                const addedAuthor = await authorDetails.json();
                addedAuthors.push(addedAuthor);

                // temporary code for testing
                console.log(addedAuthors);
                const authorsContainer = document.querySelector("#authors-container");
                const authorDiv = document.createElement("div");
                authorDiv.classList.add("author");
                authorDiv.innerHTML = `
                    <h3>${addedAuthor.fname} ${addedAuthor.lname}</h3>
                    <p>Email: ${addedAuthor.email}</p>
                    <p>Affiliation: ${addedAuthor.affiliation}</p>
                `;
                authorsContainer.appendChild(authorDiv);
                } else {
                    console.error("An Error occured while adding an author");
                }

        });

        //Actions to be taken after clicking on "Remove Author" button
        document.querySelector("#remove-author").addEventListener("click", async (e) => {
            e.preventDefault();

            const author_fname = document.querySelector("#removeAuthor").value;
            const authors = await confPlus.getAuthorsData();
            const selectedAuthor = authors.find((author) => author.fname === author_fname)

            try {
                const response = await fetch(`http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`, {
                method: 'DELETE'
                });               
            } catch (err) {
                console.error('An error occured during fetching institutions data.', err);
            }


          if (selectedAuthor) {
                //Update the lists
                await confPlus.populateDropList();
                } else {
                    console.error("An Error occured while removing an author");
                }
        });

        // Actions to be taken after clicking on "submit" button
        submitPaperForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Attempting to submit form...");
            const selectedAuthors2 = [];
            let presenter;
            const paper_title = document.querySelector("#title").value;
            const paper_abstract = document.querySelector("#abstract").value;
            const selectedAuthors = addedAuthors.map(({ fname, lname }) => {
                return { firstName: fname, lastName: lname };
            });

            const author_fname = document.querySelector("#presenters").value;
            const authors = await confPlus.getAuthorsData();
            const selectedAuthor = authors.find((author) => author.fname === author_fname);

            try {
                const response = await fetch(`http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`, {
                method: "GET",
                });

                presenter = await response.json();
            } catch (err) {
                console.error("An error occured during fetching institutions data.", err);
            }

            const attachedPdfs = document.querySelector("#paper_pdf").files;

            await confPlus.submitPaper(paper_title, paper_abstract, selectedAuthors, presenter, attachedPdfs);

            // let redirectUrl = '';
            // redirectUrl = 'schedule-editor.html';
            // window.location.replace(redirectUrl);
            });
    }
});
