const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoute");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://aashirwadsingh23:eJmM1eaWp8B23R1i@hms-storing.odbui9g.mongodb.net/?retryWrites=true&w=majority&appName=HMS-storing").then(() => {
    console.log("Connected to MongoDB");
});
app.use("/api/user", userRoutes);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});