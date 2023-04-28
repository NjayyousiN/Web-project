// Load the accepted papers from papers.json
const papers = "../papers.json";

// Filter the papers based on the sum of overall evaluation >= 2
const acceptedPapers = papers.filter((paper) => paper.overallEvaluation >= 2);

// Group the accepted papers based on the session they belong to
const sessions = {};
acceptedPapers.forEach((paper) => {
  if (!sessions[paper.session]) {
    sessions[paper.session] = {
      papers: [],
      presenters: [],
      fromTime: null,
      toTime: null,
    };
  }
  sessions[paper.session].papers.push(paper);
  sessions[paper.session].presenters.push(paper.presenter);
});

// Assign the papers and their associated presenters to each session
for (const session in sessions) {
  console.log(`Session ${session}:`);
  const sessionData = sessions[session];
  for (let i = 0; i < sessionData.papers.length; i++) {
    const paper = sessionData.papers[i];
    const presenter = sessionData.presenters[i];
    console.log(`  Paper ${paper.id}: ${paper.title}, Presenter: ${presenter}`);
  }

  // Decide the fromTime and toTime for each presentation
  sessionData.fromTime = new Date(); // Set session start time
  for (let i = 0; i < sessionData.papers.length; i++) {
    const paper = sessionData.papers[i];
    const presentationDuration = paper.presentationDuration; // Get presentation duration
    const fromTime = sessionData.toTime || sessionData.fromTime; // Use session start time for the first presentation
    const toTime = new Date(fromTime.getTime() + presentationDuration * 60000); // Add duration to fromTime to get toTime
    console.log(
      `    Paper ${
        paper.id
      }: From ${fromTime.toLocaleTimeString()} to ${toTime.toLocaleTimeString()}`
    );
    sessionData.toTime = toTime; // Update session toTime for the next presentation
  }
}
