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
            <p>Time: ${session.FromTime} - ${session.ToTime}</p>
          </div>
          <div class="session-card-buttons">
            <button class="delete-session-btn" data-title="${session.title}">Delete</button>
            <button class="update-session-btn" >Update</button>
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
    const addButtonDiv = document.querySelector("#add-button")
    addSessionButton.classList.add("add-session-button")
    addSessionButton.innerText = "Add Session";
    addSessionButton.addEventListener("click", () => {
      window.location.href = "add-page.html";
    });
    addButtonDiv.appendChild(addSessionButton);

    // add event listeners to update buttons
    const updateButtons = document.querySelectorAll(".update-session-btn");
    updateButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // get the session title from the DOM
        const sessionTitle =
          button.parentElement.parentElement.querySelector(
            ".session-title"
          ).innerText;
        const extractedTitle = sessionTitle.split(":")[0];

        // get the presenter name from the DOM
        const sessionPresenter =
          button.parentElement.parentElement.querySelector(
            ".session-presenter"
          ).innerText;

        const extractedPresenter = sessionPresenter.split(":")[1];

        // construct the URL to navigate to the update page with query parameters for the title and presenter
        // note the use of '&' to separate the two query parameters, rather than '?'
        const updatePageUrl = `update-page.html?title=${extractedTitle}&presenter=${extractedPresenter}`;

        // navigate to the update page
        window.location.href = updatePageUrl;
      });
    });

    // add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".delete-session-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        // get the session title
        const sessionTitle = e.target.dataset.title;

        // delete the session from the database
        const res = await fetch(
          `http://localhost:3000/api/conferenceSchedule/${sessionTitle}`,
          {
            method: "DELETE",
            body: JSON.stringify({ title: sessionTitle }),
          }
        );

        const data = await res.json();
        alert("session deleted successfully");
        window.location.reload();
      });
    });
  }

  // evvent listener for back button

  document.querySelector(".back-btn").addEventListener("click", (e) => {
    e.preventDefault();

    // navigate to the panel page
    alert("Heading to the panel page");

    // ADD THE URL OF THE PANEL PAGE
    window.location.href = "index.html";
  });
});
