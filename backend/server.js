require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
    res.send("LifeOS backend is running!");
});

app.get("/api/metrics", async (req, res) => {
    const { data, error } = await supabase
        .from("daily_metrics")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});