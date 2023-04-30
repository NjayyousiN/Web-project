async function getsessions() {
  const res = await fetch("http://localhost:3000/api/conferenceSchedule");
  const sessions = await res.json();
  return sessions;
}

async function getdates() {
  const res = await fetch("http://localhost:3000/api/date");
  const dates = await res.json();
  return dates;
}

async function loadSessions(sessionsContainer, sessions) {
  if (sessionsContainer) {
    sessionsContainer.innerHTML = sessions
      .map((session, index) => {
        return loadTemplate(session, index + 1);
      })
      .join("");
  } else {
    sessionsContainer.innerHTML = `<h2>No upcoming sessions in that date</h2>`;
  }
}

function loadTemplate(session, index) {
  return `<div class="session-card">
  <div class="session-card-header">
    <h2>Session ${sessionIndex}</h2>
  </div>
  <div class="session-card-body">
  <p class="session-title">Paper Title: ${session.title}</p>
  <p class="session-presenter">Presenter: ${session.presenter}</p>
  <p>Location: ${session.location}</p>
  <p>Date: ${session.date}</p>
  <p>Start Time: ${session.FromTime}</p>
  <p>End Time: ${session.ToTime}</p>
</div>
<div class="session-card-buttons">
  <button class="delete-session-btn" data-title="${session.title}">Delete</button>
  <button class="update-session-btn" >Update</button>
</div>
</div>`;
}

// function to populate the dropdown with dates
async function loadDates(dateDropdown) {
  const dateData = await getdates();

  if (dateDropdown) {
    dateDropdown.innerHTML = `<option value="" >Select a date</option>`;
    dateDropdown.innerHTML += dateData.map((date) => {
      return `
    <option value="${date.date}">${date.date}</option>
  `;
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // select the dropdown and sessions
  const dateDropdown = document.querySelector("#dates");
  const sessionsContainer = document.querySelector(".available-sessions");

  // display dates
  await loadDates(dateDropdown);

  // display sessions
  const sessionsData = await getsessions();
  await loadSessions(sessionsContainer, sessionsData);

  // add event listener to the dropdown
  if (dateDropdown) {
    dateDropdown.addEventListener("change", async (e) => {
      const selectedDate = e.target.value;

      const sessions = await getsessions();
      const filteredSessions = sessions.filter(
        (session) => session.date === selectedDate
      );

      if (selectedDate !== "") {
        if (filteredSessions.length > 0) {
          await loadSessions(sessionsContainer, filteredSessions);
        } else {
          sessionsContainer.innerHTML = `<h2>No upcoming sessions on that date </h2>`;
        }
      } else {
        await loadSessions(sessionsContainer, sessions);
      }
    });
  }
});
