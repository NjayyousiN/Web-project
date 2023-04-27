async function populateDropdown(dropdown, endpoint, property) {
  const res = await fetch(`http://localhost:3000/api/${endpoint}`);
  const data = await res.json();
  dropdown.innerHTML = data
    .map((item) => {
      return `<option value="${item[property]}">${item[property]}</option>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const UpdatedLocationDropdown = document.querySelector(
    ".updated-location-dropdown"
  );
  populateDropdown(UpdatedLocationDropdown, "location", "location");

  const UpdatedDateDropdown = document.querySelector(".date-dropdown-update");
  populateDropdown(UpdatedDateDropdown, "date", "date");

  const UpdatedPaperDropdown = document.querySelector(".paper-dropdown-update");
  populateDropdown(UpdatedPaperDropdown, "papers", "title");

  const UpdateForm = document.querySelector(".update-session-form");
  UpdateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // get the values from the dropdowns
    const location = UpdatedLocationDropdown.value;
    const date = UpdatedDateDropdown.value;
    const paper_title = UpdatedPaperDropdown.value;

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

    console.log(data);

    alert(data.response);
  });
});
