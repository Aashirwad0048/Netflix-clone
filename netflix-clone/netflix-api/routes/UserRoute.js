const { addToLikedMovies, getLikedMovies, removeFromLikedMovies, likeMovie, dislikeMovie } = require("../controllers/UserController");

const router = require("express").Router();

router.post("/add", addToLikedMovies);
router.get("/liked/:email", getLikedMovies);
router.put("/remove", removeFromLikedMovies);
router.post("/like", likeMovie);
router.post("/dislike", dislikeMovie);

module.exports = router;