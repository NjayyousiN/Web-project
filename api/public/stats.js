document.addEventListener('DOMContentLoaded', async function () {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stats`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
  
      const paperStatsElement = document.getElementById('paperStats');
      paperStatsElement.innerHTML = `
        <p>Number of papers submitted: ${data.paperStats.total}</p>
        <p>Number of papers accepted: ${data.paperStats.accepted}</p>
        <p>Number of papers rejected: ${data.paperStats.rejected}</p>
      `;
  
      const authorStatsElement = document.getElementById('authorStats');
      authorStatsElement.innerHTML = `
        <p>Average number of authors per paper: ${data.averageAuthorsPerPaper}</p>
      `;
  
      const sessionStatsElement = document.getElementById('sessionStats');
      sessionStatsElement.innerHTML = `
        <p>Number of conference sessions: ${data.sessionStats.sessionCount}</p>
        <p>Average number of presentations per session: ${data.sessionStats.averagePresentations}</p>
      `;
    } catch (error) {
      console.error('[ERROR] Error retrieving data:', error);
    }
  });
  