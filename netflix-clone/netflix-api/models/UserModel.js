const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    likedMovies: { type: Array, default: [] },
    likedMoviesList: { type: Array, default: [] }, // For thumbs up
    dislikedMovies: { type: Array, default: [] }   // For thumbs down
});

const User = mongoose.model("User", UserSchema);

module.exports = User;