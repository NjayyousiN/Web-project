// populate dropdown lists
async function populateDropdown(dropdown, endpoint, property) {
  const res = await fetch(`http://localhost:3000/api/${endpoint}`);
  const data = await res.json();
  if (data.length > 0) {
    dropdown.innerHTML =
      `<option disabled selected value="">Select ${property}</option>` +
      data
        .map((item) => {
          return `<option value="${item[property]}">${item[property]}</option>`;
        })
        .join("");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // populate the dropdown list of locations

  const locationDropdown = document.querySelector("#location-dropdown");
  populateDropdown(locationDropdown, "location", "location");

  // call the function to populate the date dropdown
  const dateDropdown = document.querySelector("#date-dropdown");
  populateDropdown(dateDropdown, "date", "date");

  // call the function to populate the paper dropdown

  const paperDropdown = document.querySelector("#paper-dropdown");
  // populating the dropdown list of papers that have been reviewed and strongly accepted
  const res = await fetch("http://localhost:3000/api/papers");
  const papers = await res.json();
  // console.log("INFO", papers);

  // get the papers that have been reviewed and stongly accepted
  const filterdPapers = papers.filter((paper) => {
    return (
      paper.reviews &&
      paper.reviews.every((review) => {
        return review.evaluation >= 2;
      })
    );
  });
  // add the papers to the dropdown list
  if (filterdPapers.length > 0) {
    paperDropdown.innerHTML = `<option value="" disabled selected>Select Paper</option>`;
    paperDropdown.innerHTML += filterdPapers
      .map((paper) => {
        return `<option value="${paper.title}">${paper.title}</option>`;
      })
      .join("");
  }

  // populate the presenter dropdown
  const presenterDropdown = document.querySelector("#presenter-dropdown");

  // add event listener to paper dropdown
  paperDropdown.addEventListener("change", (e) => {
    const currentPaper = filterdPapers.find(
      (paper) => paper.title === paperDropdown.value
    );
    // console.log("INFO current :", currentPaper);

    // retrieve the authors from the selected paper

    const presenters = currentPaper.authors.map((author) => {
      return author.firstName + " " + author.lastName;
    });
    // console.log("INFO", presenters);

    // add the authors to the dropdown list
    if (presenters.length > 0) {
      presenterDropdown.innerHTML = `<option value="" disabled selected>Select Presenter</option>`;
      presenterDropdown.innerHTML += presenters
        .map((author) => {
          return `<option value="${author}">${author}</option>`;
        })
        .join("");
    }
  });
  // event listener for submit btn
  const addForm = document.querySelector("#add-session-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // get the values from the dropdowns
      const paper_title = paperDropdown.value;
      const presenter = presenterDropdown.value;
      const location = locationDropdown.value;
      const date = dateDropdown.value;
      // console.log("[INFO]: PAPERS :", paperDropdown);

      const FromTime = document.querySelector("#fromTime").value;
      const ToTime = document.querySelector("#toTime").value;
      // console.log(FromTime, ToTime);

      // checking the values
      // console.log(location, date, paper_title);

      // post the values to the database
      const res = await fetch("http://localhost:3000/api/conferenceSchedule", {
        method: "POST",
        body: JSON.stringify({
          title: paper_title,
          presenter: presenter,
          location: location,
          date: date,
          FromTime: FromTime,
          ToTime: ToTime,
        }),
      });

      const data = await res.json();

      if (data.status !== 400 && data.status !== 500) {
        console.log("[INFO] added data: ", data);
        alert(data.message ?? "Successfully added data");
        window.location.href = "schedule-editor.html";
      } else {
        console.log("[ERROR] failed to add data: ", data, date.status);
        alert("Failed to add data");
        window.location.href = "schedule-editor.html";
      }
    });

    // event listener for clear btn

    // addForm.addEventListener("reset", (e) => {

    // });
  }
});

// add event listener to back btn
document.querySelector(".back-btn").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "schedule-editor.html";
});
