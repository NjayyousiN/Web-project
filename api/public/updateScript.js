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
  const UpdatedLocationDropdown = document.querySelector(
    ".updated-location-dropdown"
  );
  populateDropdown(UpdatedLocationDropdown, "location", "location");

  const UpdatedDateDropdown = document.querySelector(".date-dropdown-update");
  populateDropdown(UpdatedDateDropdown, "date", "date");

  const UpdatedPaperDropdownTitle = document.querySelector(
    ".paper-dropdown-update"
  );
  populateDropdown(UpdatedPaperDropdownTitle, "conferenceSchedule", "title");

  const UpdateForm = document.querySelector(".update-session-form");
  UpdateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // get the values from the dropdowns
    const location = UpdatedLocationDropdown.value;
    const date = UpdatedDateDropdown.value;
    const paper_title = UpdatedPaperDropdownTitle.value;

    // checking the values
    console.log(location, date, paper_title);

    // post the values to the database
    const res = await fetch(
      `http://localhost:3000/api/conferenceSchedule/${paper_title}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: paper_title,
          location: location,
          date: date,
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
