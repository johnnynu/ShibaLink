const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connecting to Database
connectDB();

app.get("/", (req, res) => res.send("API working"));

// Initialize Middleware
app.use(express.json());

// Routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
