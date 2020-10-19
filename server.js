const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connecting to Database
connectDB();

app.get("/", (req, res) => res.send("API working"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
