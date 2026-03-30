const express = require('express');
const path = require('path');

const app = express();

// Use process.cwd() to ensure Vercel finds the file in the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'pcb-dashboard.html'));
});

// IMPORTANT: Export the app for Vercel's serverless handler
module.exports = app;

// Only start the server if running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
