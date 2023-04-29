class ConfPlus {
  // Initialize values in the constructor
  constructor() {
    this.usersData = {};
    this.institutionsData = [];
  }

  // Retrieve user email and password from the database (users.json)
  async getUserData() {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
      });
      const data = await response.json();
      this.usersData = {
        organizers: data.filter((u) => u.role === "organizer"),
        reviewers: data.filter((u) => u.role === "reviewer"),
        authors: data.filter((u) => u.role === "author"),
      };
    } catch (err) {
      console.error(
        `[ERROR] An error occurred during fetching user data. ${err}`
      );
    }
  }

  // Retrieve author affiliations
  async getInstitutionsData() {
    try {
      const response = await fetch("http://localhost:3000/api/institutions", {
        method: "GET",
      });

      return (this.institutionsData = await response.json());
    } catch (err) {
      console.error(
        `[ERROR] An error occurred during fetching institutions data. ${err}`
      );
    }
  }

  // Retrieve author's data
  async getAuthorsData() {
    try {
      const response = await fetch("http://localhost:3000/api/articleAuthors", {
        method: "GET",
      });

      return (this.AuthorsData = await response.json());
    } catch (err) {
      console.error(
        `[ERROR] An error occurred during fetching authors data. ${err}`
      );
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
    const validChrs =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(validChrs)) {
      console.log("[INFO] Valid Email Format");
      return true;
    } else {
      console.log("[INFO] Invalid Email Format");
      return false;
    }
  }

  // Password format validation
  isPasswordValid(password) {
    const validChrs = /^[A-Za-z]\w{7,14}$/;

    if (password.match(validChrs)) {
      console.log("[INFO] Valid Password Format");
      return true;
    } else {
      console.log("[INFO] Invalid Password Format");
      return false;
    }
  }

  // Login function
  login(email, password) {
    // Validate email/pass formats
    if (!this.isEmailValid(email) || !this.isPasswordValid(password)) {
      return { success: false, message: "[INFO] Incorrect email or password." };
    }

    // Group all users in 1 array
    const allUsers = [
      ...this.usersData.organizers,
      ...this.usersData.reviewers,
      ...this.usersData.authors,
    ];

    // Find the user with the corresponding email & pass
    const userFound = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    // Return the user
    if (userFound) {
      return {
        success: true,
        message: "[INFO] Login was successful.",
        user: userFound,
      };
    } else {
      return { success: false, message: "[INFO] Login was unsuccessful." };
    }
  }

  /*                                       CASE 2 STARTS HERE                                       */

  // Submit the paper form
  async submitPaper(
    paper_title,
    paper_abstract,
    selectedAuthors,
    presenter,
    attachedPdfs
  ) {
    try {
      console.log("[INFO] Attaching PDFs...");
      const formData = new FormData();

      // For loop in case there's multiple pdfs being submitted
      for (let i = 0; i < attachedPdfs.length; i++) {
        formData.append("attachedPdf", attachedPdfs[i]);
      }

      // Save the pdf content to "/uplaod"
      const pdfUpload = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!pdfUpload.ok) {
        console.error("[ERROR] An Error occurred while attaching the PDF");
        console.error("[ERROR] Server response:", await pdfUpload.json());
        return;
      }
      console.log(
        "[INFO] PDFs attached successfully. Uploading paper details..."
      );

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
      const pdfBlob = new Blob([bytes.buffer], { type: "application/pdf" });

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
        reviewers: assignedReviewers.map((reviewer) => ({
          id: reviewer.id,
          first_name: reviewer.first_name,
        })),
      };

      // Save paper details to "/papers"
      const savePaper = await fetch("http://localhost:3000/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paperDetails),
      });

      console.log("[INFO] Paper saved successfully:", paperDetails);
    } catch (err) {
      console.error(
        "[ERROR] An error occurred while submitting the paper:",
        err
      );
    }
  }

  // Fill drop-down lists
  async populateDropList() {
    const institutions = await confPlus.getInstitutionsData();
    document.querySelector("#affiliation").innerHTML = institutions
      .map(
        (institution) =>
          `<option value ="${institution.institution}"> ${institution.institution}</option>`
      )
      .join(" ");

    const authors = await confPlus.getAuthorsData();
    document.querySelector("#presenters").innerHTML = authors
      .map(
        (author) => `<option value ="${author.fname}"> ${author.fname}</option>`
      )
      .join(" ");

    const presenters = await confPlus.getAuthorsData();
    document.querySelector("#removeAuthor").innerHTML = presenters
      .map(
        (author) => `<option value ="${author.fname}"> ${author.fname}</option>`
      )
      .join(" ");
  }

  /*                                       CASE 3 STARTS HERE                                       */

  ///********************************** error  HERE ******************************/
  async fetchAssignedPapers(reviewerId) {
    console.log(
      `[INFO] Fetching assigned papers for reviewerId: ${reviewerId}`
    );

    try {
      const response = await fetch("http://localhost:3000/api/papers", {
        method: "GET",
      });

      console.log("[INFO] Server response:", response);
      const papers = await response.json();

      const assignedPapers = papers.filter(
        (paper) =>
          paper.reviewers &&
          paper.reviewers.some((reviewer) => reviewer.id === reviewerId)
      );

      console.log(`[INFO] Assigned Papers: ${JSON.stringify(assignedPapers)}`);

      const assignedPapersContainer =
        document.querySelector("#assigned-papers");
      assignedPapersContainer.innerHTML = "";

      assignedPapers.forEach((paper) => {
        assignedPapersContainer.innerHTML += `
      <input type="hidden" id="paper-id" value="${paper.id}">
        <div class="paper">
        <h4>Title: ${paper.title}</h4>
        <p>Authors: ${paper.authors
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(", ")}</p>
        <div class="abstract">
          <h4 class="abstract-header">Abstract: <span class="collapse-icon">+</span></h4>
          <p class="abstract-content">${paper.abstract}</p>
        </div>
        <p>Article link: <a href="${paper.pdfURL}" download>${paper.title
          }</a></p>
        <button class="select" data-paper-id="${paper.id}">Select</button>
        </div>
      `;
      });

      document.querySelectorAll(".select").forEach((button) =>
        button.addEventListener("click", () => {
          const paperId = button.dataset.paperId;
          confPlus.loadReviewForm(paperId, reviewerId);
        })
      );
    } catch (err) {
      console.error(
        `[ERROR] An error occurred during fetching the papers data. ${err}`
      );
    }
  }
  /*************************************************error above **************************** */

  async loadReviewForm(paperId, reviewerId) {
    const response = await fetch(
      `http://localhost:3000/api/papers/${paperId}`,
      {
        method: "GET",
      }
    );

    const paper = await response.json();
    // Check if the paper already has a review or not
    const reviews = paper.reviews ? paper.reviews : [];
    const review = reviews.find((r) => r.reviewerId === reviewerId);

    if (review) {
      document.querySelector(
        `input[name="overall-evaluation"][value="${review.evaluation}"]`
      ).checked = true;
      document.querySelector(
        `input[name="paper-contribution"][value="${review.contribution}"]`
      ).checked = true;
      document.querySelector("#paper-strengths").value = review.strengths;
      document.querySelector("#paper-weaknesses").value = review.weaknesses;
    } else {
      document
        .querySelectorAll('input[name="overall-evaluation"]')
        .forEach((input) => (input.checked = false));
      document
        .querySelectorAll('input[name="paper-contribution"]')
        .forEach((input) => (input.checked = false));
      document.querySelector("#paper-strengths").value = "";
      document.querySelector("#paper-weaknesses").value = "";
    }

    document.querySelector("#paper-id").value = paper.id;
  }

  /*         *****************************            CASE 4 STARTS HERE                  *********************************                     */

  // retrive schedules from the server
}

//Instantiation of ConfPlus Class
const confPlus = new ConfPlus();
confPlus.init();

/*                                       EVENT LISTENERS                                       */

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`[INFO] DOM Content Loaded`);

  let addedAuthors = [];
  const loginForm = document.querySelector("#login-form");
  const submitPaperForm = document.querySelector("#paperForm");
  const assignedPapersDiv = document.querySelector("#assigned-papers");
  const reviewForm = document.getElementById("review-form");
  const scheduleFormPage = document.querySelector(".sessions-container");

  let reviewerId;

  // Fetching assigned papers
  reviewerId = localStorage.getItem("reviewerId");
  if (reviewerId) {
    confPlus.fetchAssignedPapers(reviewerId);
  } else {
    console.error(`[ERROR] Reviewer ID cannot be found in local storage`);
  }

  // Validate that the form exists in the page before adding the event listener
  if (loginForm) {
    // Action to be taken after clicking on "login" button
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(`[INFO] Login form submitted`);

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const login_attempt = await confPlus.login(email, password);
      reviewerId = login_attempt.user.id;
      console.log(`[INFO] Reviewer ID is: ${reviewerId}`);

      // If the login was successful, redirect to the referenced pages according to the user type
      if (login_attempt.success) {
        console.log(login_attempt.message);
        const userFound = login_attempt.user;
        let redirectUrl = "";

        // Reviewer ID to be used later
        localStorage.setItem("reviewerId", reviewerId);

        if (userFound.role === "author") {
          redirectUrl = "submit-paper-page.html";
        }

        if (userFound.role === "reviewer") {
          redirectUrl = "review-papers.html";
          localStorage.setItem("reviewerId", reviewerId);
        }

        if (userFound.role === "organizer") {
          redirectUrl = "schedule-editor.html";
        }

        window.location.replace(redirectUrl);
      } else {
        // Log it
        console.log(`[ERROR] ${login_attempt.message}`);

        // Else, refresh page and send an alert
        await confPlus.loadPage("login-page.html");
        alert("[ALERT] Wrong Email or Password. Retry again.");
      }
    });
  }

  // Validate that the form exists in the page before adding the event listener
  if (submitPaperForm) {
    // Populate Lists
    await confPlus.populateDropList();

    // Actions to be taken after clicking on "Add Author" button
    document
      .querySelector("#add-author")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const author_fname = document.querySelector("#first_name").value;
        const author_lname = document.querySelector("#last_name").value;
        const author_email = document.querySelector("#email").value;
        const author_affiliation = document.querySelector("#affiliation").value;

        const authorDetails = await fetch(
          "http://localhost:3000/api/articleAuthors",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fname: author_fname,
              lname: author_lname,
              email: author_email,
              affiliation: author_affiliation,
            }),
          }
        );

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
    document
      .querySelector("#remove-author")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const author_fname = document.querySelector("#removeAuthor").value;
        const authors = await confPlus.getAuthorsData();
        const selectedAuthor = authors.find(
          (author) => author.fname === author_fname
        );

        if (selectedAuthor) {
          try {
            const response = await fetch(
              `http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`,
              {
                method: "DELETE",
              }
            );

            // Update the lists
            await confPlus.populateDropList();

            // Remove the "Removed author" from the array
            addedAuthors = addedAuthors.filter(
              (author) => author.id !== selectedAuthor.id
            );
          } catch (err) {
            console.error(
              `[ERROR] An error occurred during fetching institutions data. ${err}`
            );
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
      const selectedAuthor = authors.find(
        (author) => author.fname === author_fname
      );
      console.log("[INFO] Presenter Author:", selectedAuthor.id);

      try {
        const response = await fetch(
          `http://localhost:3000/api/articleAuthors/${selectedAuthor.id}`,
          {
            method: "GET",
          }
        );
        presenter = await response.json();
      } catch (err) {
        console.error(
          `[ERROR] An error occurred during fetching institutions data. ${err}`
        );
      }
      const attachedPdfs = document.querySelector("#paper_pdf").files;

      // Add the presenter to the selectedAuthors array if it is not already in the array
      const presenterAlreadySelected = selectedAuthors.some(
        (author) =>
          author.firstName === selectedAuthor.fname &&
          author.lastName === selectedAuthor.lname
      );
      if (!presenterAlreadySelected) {
        selectedAuthors.push({
          firstName: selectedAuthor.fname,
          lastName: selectedAuthor.lname,
        });
      }

      // Pass the updated selectedAuthors array when submitting the paper
      await confPlus.submitPaper(
        paper_title,
        paper_abstract,
        selectedAuthors,
        presenter,
        attachedPdfs
      );

      // let redirectUrl = '';
      // redirectUrl = 'schedule-editor.html';
      // window.location.replace(redirectUrl);
    });
  }

  // Validate that the div exists in the page,
  if (assignedPapersDiv) {
    const storedReviewerId = localStorage.getItem("reviewerId");
    if (storedReviewerId) {
      await confPlus.fetchAssignedPapers(parseInt(storedReviewerId, 10));
    }
  }

  //    //         ERRORRRRR HERE       //                                          //
  // Event listener for submitting the review

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const storedReviewerId2 = localStorage.getItem("reviewerId");

      const overallEvaluationInput = document.querySelector(
        'input[name="overall-evaluation"]:checked'
      );
      const overallEvaluation = overallEvaluationInput
        ? parseInt(overallEvaluationInput.value)
        : null;
      const paperContribution = parseInt(
        document.querySelector('input[name="paper-contribution"]:checked').value
      );
      const paperStrengths = document.getElementById("paper-strengths").value;
      const paperWeaknesses = document.getElementById("paper-weaknesses").value;

      const paperId = document.getElementById("paper-id").value; // Add this line to get the paper ID from the hidden input field

      const review = {
        reviewerId: storedReviewerId2,
        evaluation: overallEvaluation,
        contribution: paperContribution,
        strengths: paperStrengths,
        weaknesses: paperWeaknesses,
      };

      try {
        const updatedPaper = await fetch("http://localhost:3000/api/papers", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paperId, review }), // Include the paperId property in the request body
        });

        alert("Review submitted successfully!");
        console.log(updatedPaper);
      } catch (error) {
        console.error(error);
        alert("Error submitting review.");
      }
    });
  }
  //                                       ERRORRRRR HERE       //                                          //

  // Event lisener for "select" and loading form. Also handles collapsation of abstract
  const assigned_papers = document.querySelector("#assigned-papers");
  if (assigned_papers) {
    assigned_papers.addEventListener("click", (event) => {
      if (event.target.classList.contains("select")) {
        const paperId = event.target.dataset.paperId;
        const reviewerId = localStorage.getItem("reviewerId");
        confPlus.loadReviewForm(paperId, reviewerId);
      } else if (
        event.target.classList.contains("abstract-header") ||
        event.target.classList.contains("collapse-icon")
      ) {
        const header = event.target.closest(".abstract-header");
        const abstractContainer = header.parentElement;
        abstractContainer.classList.toggle("collapsed");
        const icon = header.querySelector(".collapse-icon");
        icon.textContent = icon.textContent === "+" ? "-" : "+";
      }
    });
  }




});
