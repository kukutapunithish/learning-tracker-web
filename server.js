const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, '../learning-tracker/learning_tracker.csv');

// Middleware to serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));  // serving from 'public' directory

// Middleware to parse JSON
app.use(express.json());

// Endpoint to save entry
app.post('/save-entry', (req, res) => {
    const { date, course, topic, subtopic, subtopicDetails, status, timeSpent, courseReference } = req.body;

    if (!date || !course || !topic || !subtopic || !subtopicDetails || !status || !timeSpent || !courseReference) {
        return res.status(400).send('Invalid data');
    }

    const header = 'Date,Course,Topic,Subtopic,Subtopic Details,Status,Time Spent,Course Reference\n';
    const entry = `${date},${course},${topic},${subtopic}, ${subtopicDetails},${status},${timeSpent},${courseReference}\n`;

    // Check if file exists
    if (!fs.existsSync(FILE_PATH)) {
        // Create file with header
        fs.writeFileSync(FILE_PATH, header, 'utf8');
    }

    // Append the new entry
    fs.appendFile(FILE_PATH, entry, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save entry');
        }

        res.status(200).send('Entry saved successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});