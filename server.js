const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("API working"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
<<<<<<< HEAD
<<<<<<< HEAD
console.log("Hello");
=======
>>>>>>> 5600914327df97e88c266c38483e1a365ee0a738
=======
>>>>>>> 5600914327df97e88c266c38483e1a365ee0a738
