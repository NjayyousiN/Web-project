class ConfPlus {
    // Initialize values in the constructor
    constructor() {
      this.usersData = {};
      this.institutionsData = [];
    }
  
    // Retrieve user email and password from the database (users.json)
    async getUserData() {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          method: "GET"
        });
        const data = await response.json();
        this.usersData = {
          organizers: data.filter(u => u.role === 'organizer'),
          reviewers: data.filter(u => u.role === 'reviewer'),
          authors: data.filter(u => u.role === 'author')
        };
      } catch (err) {
        	console.error(`[ERROR] An error occurred during fetching user data. ${err}`);
      }
    }
  
    // Retrieve author affiliations
    async getInstitutionsData() {
      try {
        const response = await fetch('http://localhost:3000/api/institutions', {
          method: "GET"
        });
  
        return this.institutionsData = await response.json();
      } catch (err) {
        	console.error(`[ERROR] An error occurred during fetching institutions data. ${err}`);
    	}
    }
  
    // Retrieve author's data
    async getAuthorsData() {
      try {
        const response = await fetch('http://localhost:3000/api/articleAuthors', {
          method: "GET"
        });
  
        return this.AuthorsData = await response.json();
  
      } catch (err) {
					console.error(`[ERROR] An error occurred during fetching authors data. ${err}`);
      }
    }
  
    // Initialize get functions
    async init() {
      await this.getUserData();
      await this.getInstitutionsData();
    }
  
/*                                       CASE 1 STARTS HERE                                       */

		// Loads the selected page
		async loadPage(pageUrl) {
			window.location.replace(pageUrl);
		}

		// Email format validation
		isEmailValid(email) {
			const validChrs = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

			if (email.match(validChrs)) {
					console.log('[INFO] Valid Email Format');
					return true;
			} else {
					console.log('[INFO] Invalid Email Format');
					return false;
			}
		}

		// Password format validation
		isPasswordValid(password) {
			const validChrs = /^[A-Za-z]\w{7,14}$/;

			if (password.match(validChrs)) {
					console.log('[INFO] Valid Password Format');
					return true;
			} else {
					console.log('[INFO] Invalid Password Format');
					return false;
			}
		}

		// Login function
		login(email, password) {
			// Validate email/pass formats
			if (!this.isEmailValid(email) || !this.isPasswordValid(password)) {
					return { success: false, message: '[INFO] Incorrect email or password.' };
			}

			// Group all users in 1 array
			const allUsers = [
					...this.usersData.organizers,
					...this.usersData.reviewers,
					...this.usersData.authors,
			];

			// Find the user with the corresponding email & pass
			const userFound = allUsers.find((u) => u.email === email && u.password === password);

			// Return the user
			if (userFound) {
					return { success: true, message: '[INFO] Login was successful.', user: userFound };

			} else {
					return { success: false, message: '[INFO] Login was unsuccessful.' };
			}
		}

/*                                       CASE 2 STARTS HERE                                       */

		// Submit the paper form
		async submitPaper(paper_title, paper_abstract, selectedAuthors, presenter, attachedPdfs) {
			try {
				console.log('[INFO] Attaching PDFs...');
				const formData = new FormData();

				// For loop in case there's multiple pdfs being submitted
				for (let i = 0; i < attachedPdfs.length; i++) {
						formData.append("attachedPdf", attachedPdfs[i]);
				}

				// Save the pdf content to "/uplaod"
				const pdfUpload = await fetch('http://localhost:3000/api/upload', {
						method: 'POST',
						body: formData,
				});

				if (!pdfUpload.ok) {
						console.error('[ERROR] An Error occurred while attaching the PDF');
						console.error("[ERROR] Server response:", await pdfUpload.json());
						return;
				}
				console.log('[INFO] PDFs attached successfully. Uploading paper details...');

				if (!attachedPdfs || attachedPdfs.length === 0) {
						console.error("[ERROR] No PDFs attached");
						return;
				}

				const pdfUrlJson = await pdfUpload.json();
				console.log("[INFO] Server response:", pdfUrlJson);

				const base64PdfContent = pdfUrlJson.base64Content;

				if (!base64PdfContent) {
						console.error("[ERROR] Base64 PDF content is undefined");
						return;
				}

				// Convert base64 content to Blob
				const binaryPdf = atob(base64PdfContent);
				const len = binaryPdf.length;
				const bytes = new Uint8Array(len);
				for (let i = 0; i < len; i++) {
						bytes[i] = binaryPdf.charCodeAt(i);
				}
				const pdfBlob = new Blob([bytes.buffer], { type: 'application/pdf' });

				// Create a Blob URL
				const pdfUrlGenerated = URL.createObjectURL(pdfBlob);

				console.log("[INFO] PDF URL:", pdfUrlGenerated);

				// Filter out the reviewers from the users
				const reviewers = this.usersData.reviewers;
				// Validate that reviewers list contains 2 reviewers
				if (reviewers.length < 2) {
					console.error("[ERROR] Not enough reviewers available");
					return;
				}

				// Randomly assign two reviewers to the paper
				const assignedReviewers = [];
				for (let i = 0; i < 2; i++) {
					const randomIndex = Math.floor(Math.random() * reviewers.length);
					assignedReviewers.push(reviewers[randomIndex]);
					reviewers.splice(randomIndex, 1);
				}

				// Paper details to be saved
				const paperDetails = {
					title: paper_title,
					abstract: paper_abstract,
					authors: selectedAuthors,
					presenter: presenter,
					pdfURL: pdfUrlGenerated,
					reviewers: assignedReviewers.map(reviewer => ({
						id: reviewer.id,
						first_name: reviewer.first_name
					}))
				};
				
				// Save paper details to "/papers"
				const savePaper = await fetch('http://localhost:3000/api/papers', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify(paperDetails),
				});
				
					console.log('[INFO] Paper saved successfully:', paperDetails);
				} catch (err) {
					console.error('[ERROR] An error occurred while submitting the paper:', err);
				}
		}

	// Fill drop-down lists
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

/*                                       CASE 2 STARTS HERE                                       */

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

//Instantiation of ConfPlus Class
const confPlus = new ConfPlus();
confPlus.init();

/*                                       EVENT LISTENERS                                       */

		document.addEventListener("DOMContentLoaded", async () => {
			let addedAuthors = [];
			const loginForm = document.querySelector("#login-form");
			const submitPaperForm = document.querySelector("#paperForm");

			// Validate that the form exists in the page before adding the event listener
			if (loginForm) {
				// Action to be taken after clicking on "login" button
				loginForm.addEventListener("submit", async (e) => {
					e.preventDefault();
					console.log(`[INFO] Login form submitted`);

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
							console.log(`[ERROR] ${login_attempt.message}`);

							// Else, refresh page and send an alert
							await confPlus.loadPage('login-page.html');
							alert('[ALERT] Wrong Email or Password. Retry again.');
					}
				});
			}

			// Validate that the form exists in the page before adding the event listener
			if (submitPaperForm) {

				// Populate Lists
				await confPlus.populateDropList();

				// Actions to be taken after clicking on "Add Author" button
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
						// Update the lists
						await confPlus.populateDropList();
						const addedAuthor = await authorDetails.json();
						addedAuthors.push(addedAuthor);

						// temporary code for testing. DELETE LATER.
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
							console.error(`[ERROR] An Error occured while adding an author`);
					}
				});

				// Actions to be taken after clicking on "Remove Author" button
				document.querySelector("#remove-author").addEventListener("click", async (e) => {
					e.preventDefault();

					const author_fname = document.querySelector("#removeAuthor").value;
					const authors = await confPlus.getAuthorsData();
					const selectedAuthor = authors.find((author) => author.fname === author_fname);

					if (selectedAuthor) {
							try {
								const response = await fetch(`http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`, {
										method: 'DELETE'
								});

								// Update the lists
								await confPlus.populateDropList();

								// Remove the "Removed author" from the array
								addedAuthors = addedAuthors.filter(author => author.id !== selectedAuthor.id);

							} catch (err) {
									console.error(`[ERROR] An error occurred during fetching institutions data. ${err}`);
							}
					} else {
							console.error("[ERROR] An Error occurred while removing an author");
					}
				});

				// Actions to be taken after clicking on "Submit Paper" button
				submitPaperForm.addEventListener("submit", async (e) => {
					e.preventDefault();
					console.log("[INFO] Attempting to submit form...");
					let presenter;
					const paper_title = document.querySelector("#title").value;
					const paper_abstract = document.querySelector("#abstract").value;
					const selectedAuthors = addedAuthors.map(({ fname, lname }) => {
							return { firstName: fname, lastName: lname };
					});

					const author_fname = document.querySelector("#presenters").value;
					console.log("[INFO] Author:", author_fname);
					const authors = await confPlus.getAuthorsData();
					const selectedAuthor = authors.find((author) => author.fname === author_fname);
					console.log("[INFO] Presenter Author:", selectedAuthor.id);

					try {
						const response = await fetch(`http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`, {
								method: "GET",
						});
						presenter = await response.json();
					} catch (err) {
							console.error(`[ERROR] An error occurred during fetching institutions data. ${err}`);
					}
					const attachedPdfs = document.querySelector("#paper_pdf").files;

					// Add the presenter to the selectedAuthors array if it is not already in the array
					const presenterAlreadySelected = selectedAuthors.some((author) => author.firstName === selectedAuthor.fname && author.lastName === selectedAuthor.lname);
					if (!presenterAlreadySelected) {
						selectedAuthors.push({ firstName: selectedAuthor.fname, lastName: selectedAuthor.lname });
					}

					// Pass the updated selectedAuthors array when submitting the paper
					await confPlus.submitPaper(paper_title, paper_abstract, selectedAuthors, presenter, attachedPdfs);

					// let redirectUrl = '';
					// redirectUrl = 'schedule-editor.html';
					// window.location.replace(redirectUrl);
				});
			}
		});
