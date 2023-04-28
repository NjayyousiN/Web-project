//  populate dropdown lists
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
// get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

document.addEventListener("DOMContentLoaded", async () => {
  // populate the dropdown list of locations
  const UpdatedLocationDropdown = document.querySelector(
    ".updated-location-dropdown"
  );
  populateDropdown(UpdatedLocationDropdown, "location", "location");

  // call the function to populate the date dropdown
  const UpdatedDateDropdown = document.querySelector(".date-dropdown-update");
  populateDropdown(UpdatedDateDropdown, "date", "date");

  // call the function to populate the paper dropdown
  const UpdatedPaperDropdownTitle = document.querySelector(
    ".paper-dropdown-update"
  );

  // extract the title parameters from the URL
  const sessionTitle = urlParams.get("title");

  // add the paper title to the dropdown
  UpdatedPaperDropdownTitle.innerHTML = `<option value="${sessionTitle}">${sessionTitle}</option>`;

  // populate the presenter dropdown
  const UpdatedPresenterDropdown = document.querySelector(
    ".presenter-dropdown-update"
  );

  // extract the presenter parameters from the URL
  const sessionPresenter = urlParams.get("presenter");
  console.log("INFO", sessionPresenter);

  // add the presenter to the dropdown

  UpdatedPresenterDropdown.innerHTML = `<option value="${sessionPresenter}">${sessionPresenter}</option>`;

  const UpdateForm = document.querySelector(".update-session-form");
  UpdateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // get the values from the dropdowns
    const location = UpdatedLocationDropdown.value;
    const date = UpdatedDateDropdown.value;
    const paper_title = UpdatedPaperDropdownTitle.value;
    const presenter = UpdatedPresenterDropdown.value;
    const FromTime = document.querySelector(".fromTime").value;
    const ToTime = document.querySelector(".toTime").value;
    console.log(
      "INFO: values from the dropdowns:",
      location,
      date,
      paper_title,
      presenter,
      FromTime,
      ToTime
    );

    // checking the values

    // post the values to the database
    const res = await fetch(
      `http://localhost:3000/api/conferenceSchedule/${paper_title}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: paper_title,
          location: location,
          date: date,
          presenter: presenter,
          FromTime: FromTime,
          ToTime: ToTime,
        }),
      }
    );

    const data = await res.json();

    if (data.status !== 400 && data.status !== 500) {
      console.log("[INFO] updated data: ", data);
      alert(data.message ?? "Successfully updated data");
      window.location.href = "schedule-editor.html";
    } else {
      console.log("[ERROR] failed to update data: ", data, date.status);
      alert("Failed to update data");
      window.location.href = "schedule-editor.html";
    }
  });
});

//add the event listener to the back button

document.querySelector(".back-btn").addEventListener("click", (e) => {
  e.preventDefault();
  alert("back to  conference schedule page");
  window.location.href = "schedule-editor.html";
});
