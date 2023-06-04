async function getScheduleData() {
  const res = await fetch("http://localhost:3000/api/conferenceSchedule");
  const data = await res.json();
  return data;
}
async function getpapersData() {
  const res = await fetch("http://localhost:3000/api/papers");
  const data = await res.json();
  // get authors for each paper
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const scheduleFormPage = document.querySelector(".sessions-container");

  // load the schedule data
  if (scheduleFormPage) {
    // get the schedule data
    const sessions = await getScheduleData();

    // get the sessions container
    const sessionsContainer = document.querySelector(".sessions-container");
    const mainContent = document.querySelector(".main-content");

    let index = 1; // initialize index to 1

    // populate the sessions container
    if (sessions.length > 0) {
      sessionsContainer.innerHTML = sessions
        .map((session) => {
          const sessionIndex = index++; // increment index for each item

          return ` 
          <div class="session-card">
          <div class="session-card-header">
            <h2>Session ${sessionIndex}</h2>
          </div>
          <div class="session-card-body">
            <p class="session-title">Paper Title: ${session.title}</p>
            <p class="session-presenter">Presenter: ${session.presenter}</p>
            <p>Location: ${session.location}</p>
            <p>Date: ${session.date}</p>
          </div> <!-- Add this closing div tag -->
          <div class="session-time">
            <p>Time: ${session.fromTime} - ${session.toTime}</p>
          </div>
          <div class="session-card-buttons">
          <button class="delete-session-btn" data-id="${session.id}">Delete</button>
          <button class="update-session-btn" data-id="${session.id}">Update</button>
          </div>
        </div>`;
        })
        .join("");
    } else {
      alert("No sessions found. Please add a session.");
      window.location.href = "add-page.html";
    }

    // add event listener to add session button
    const addSessionButton = document.createElement("button");
    const addButtonDiv = document.querySelector("#add-button");
    addSessionButton.classList.add("add-session-button");
    addSessionButton.innerText = "Add Session";
    addSessionButton.addEventListener("click", () => {
      window.location.href = "add-page.html";
    });
    addButtonDiv.appendChild(addSessionButton);

    // add event listeners to update buttons
    const updateButtons = document.querySelectorAll(".update-session-btn");
    updateButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // get the session title from the DOM
        const sessionTitle =
          button.parentElement.parentElement.querySelector(
            ".session-title"
          ).innerText;
        const extractedTitle = sessionTitle.split(":")[1];

        // get the presenter name from the DOM
        const sessionPresenter =
          button.parentElement.parentElement.querySelector(
            ".session-presenter"
          ).innerText;

        const extractedPresenter = sessionPresenter.split(":")[1].trim();

        // get the session id from the DOM
        const sessionId = e.target.dataset.id;

        // construct the URL to navigate to the update page with query parameters for the title and presenter
        // note the use of '&' to separate the two query parameters, rather than '?'
        const updatePageUrl = `update-page.html?id=${sessionId}&title=${extractedTitle}&presenter=${extractedPresenter}`;
        // navigate to the update page

        window.location.href = updatePageUrl;
      });
    });

    // add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".delete-session-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        // get the session id from the DOM

        const sessionId = e.target.dataset.id;

        // delete the session from the database
        const res = await fetch(
          `http://localhost:3000/api/conferenceSchedule/${sessionId}`,
          {
            method: "DELETE",
            body: JSON.stringify({ id: sessionId }),
          }
        );

        const data = await res.json();
        alert("session deleted successfully");
        window.location.reload();
      });
    });
  }

  // evvent listener for back button
});
