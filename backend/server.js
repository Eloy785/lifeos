const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("LifeOS backend is running!");
});

app.get("/api/metrics", (req, res) => {
    const metrics = {
        weight: 83,
        steps: 8421,
        sleep: 7.5,
        study: 3
    };

    res.json(metrics);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});