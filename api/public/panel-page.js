async function loadSessions(sessions) {
  const sessionsRes = await fetch("http://localhost:3000/api/conferenceSchedule");
  const sessionsData = await sessionsRes.json();
  let index = 1; // initialize index to 1
  if (sessions) {

    sessions.innerHTML = sessionsData.map((session) => {
      const sessionIndex = index++; // increment index for each item
      return ` <div class="session-card" style="border : 2px solid black">
      <div class="session-card-header">
        <h2>Session </h2>
      </div>
      <div class="session-card-body">
      <label for="session-title">Title:</label>
      <p class="session-title">${session.title}</p>

      <label for="session-presenter">Presenter:</label>
      <p class="session-presenter">${session.presenter}</p>

      <label for="session-location">Location:</label>
      <p>${session.location}</p>
      
      <label for="session-date">Date:</label>
      <p>${session.date}</p>
      
      <label for="session-start">Start Time:</label>
      <p>${session.FromTime}</p>

      <label for="session-end">End Time:</label>
      <p>${session.ToTime}</p>
      </div>
   
    </div>`;
    })
      .join("");
  } else {
    sessions.innerHTML = `<h2>No upcoming sessions</h2>`;
  }

}


document.addEventListener("DOMContentLoaded", async () => {

  // load sessions
  // populate the dropdown with the data
  // display dates
  const dateDropdown = document.querySelector("#date-dropdown");
  const dateres = await fetch("http://localhost:3000/api/date");
  const datedata = await dateres.json();
  console.log("DATA", datedata);
  if (dateDropdown) {
    dateDropdown.innerHTML = `<option value="" >Select a date</option>`;

    dateDropdown.innerHTML += datedata.map((date) => {
      return `
    <option value="${date.date}">${date.date}</option>
  `;
    });
  }


  // display sessions
  const sessions = document.querySelector(".sessions-container");
  await loadSessions(sessions);



  // add event listener to the dropdown
  if (dateDropdown) {
    dateDropdown.addEventListener("change", async (e) => {
      const selectedDate = e.target.value;

      const sessionsRes = await fetch("http://localhost:3000/api/conferenceSchedule");
      const sessionsData = await sessionsRes.json();
      const filteredSessions = sessionsData.filter(
        (session) => session.date === selectedDate
      );
      console.log("filteredSessions", filteredSessions);

      if (selectedDate !== "") {
        if (filteredSessions.length > 0) {
          sessions.innerHTML = filteredSessions.map((session) => {
            return `
        <div class="session">
          <div class="session-info">
            <div class="session-title">${session.location}</div
            <div class="session-title">${session.date}</div>
          </div>
        </div>
      `;
          });
        }
        else {
          sessions.innerHTML = `<h2>No upcoming sessions</h2>`;
        }
      } else {
        await loadSessions(sessions);

      }
    });
  }

});