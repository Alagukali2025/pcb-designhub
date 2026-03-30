const express = require('express');
const path = require('path');
const app = express();

// Root route to serve your dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'pcb-dashboard.html'));
});

// Export for Vercel
module.exports = app;
