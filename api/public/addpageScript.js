// populate dropdown lists
async function populateDropdown(dropdown, endpoint, property) {
  const res = await fetch(`http://localhost:3000/api/${endpoint}`);
  const data = await res.json();
  if (data.length > 0) {
    dropdown.innerHTML = data
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
  populateDropdown(paperDropdown, "papers", "title");

  // event listener for submit btn
  const addForm = document.querySelector("#add-session-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // get the values from the dropdowns

      const location = locationDropdown.value;
      const date = dateDropdown.value;
      const paper_title = paperDropdown.value;

      // checking the values
      console.log(location, date, paper_title);

      // post the values to the database
      const res = await fetch("http://localhost:3000/api/conferenceSchedule", {
        method: "POST",
        body: JSON.stringify({
          title: paper_title,
          location: location,
          date: date,
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
