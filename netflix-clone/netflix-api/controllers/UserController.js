const User = require('../models/UserModel');

module.exports.addToLikedMovies = async(req,res)=> {
    try{
        const {email, movie} = req.body;
        let user = await User.findOne({email});
        
        // Create user if doesn't exist
        if(!user) {
            user = new User({
                email,
                likedMovies: []
            });
        }
        
        const movieAlreadyLiked = user.likedMovies.find(({id}) => id === movie.id);
        if(!movieAlreadyLiked){
            user.likedMovies.push(movie);
            await user.save();
            return res.json({msg:"Movie added to liked list", success: true});
        } else {
            return res.json({msg:"Movie already in liked list", success: false});
        }
    }catch(error){
        console.error("Error adding movie:", error);
        return res.json({msg:"Error adding movie", success: false});
    }
};

module.exports.getLikedMovies = async(req,res)=> {
    try{
        const {email} = req.params;
        const user = await User.findOne({email});
        if(!user) return res.json({msg:"User not found"});
        return res.json({msg:"Success", movies: user.likedMovies});
    }catch(error){
        return res.json({msg:"Error fetching movies"});
    }
};

module.exports.removeFromLikedMovies = async(req,res)=> {
    try{
        const {email, movieId} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.json({msg:"User not found"});
        
        const movies = user.likedMovies.filter((movie) => movie.id != movieId);
        user.likedMovies = movies;
        await user.save();
        return res.json({msg:"Movie removed successfully", movies});
    }catch(error){
        return res.json({msg:"Error removing movie"});
    }
};

module.exports.likeMovie = async(req,res)=> {
    try{
        const {email, movieId} = req.body;
        let user = await User.findOne({email});
        
        // Create user if doesn't exist
        if(!user) {
            user = new User({
                email,
                likedMovies: [],
                likedMoviesList: [],
                dislikedMovies: []
            });
        }
        
        // Remove from disliked if it was there
        user.dislikedMovies = user.dislikedMovies.filter(id => id !== movieId);
        
        // Add to liked if not already there
        if(!user.likedMoviesList.includes(movieId)) {
            user.likedMoviesList.push(movieId);
        }
        
        await user.save();
        return res.json({msg:"Movie liked successfully", success: true});
    }catch(error){
        console.error("Error liking movie:", error);
        return res.json({msg:"Error liking movie", success: false});
    }
};

module.exports.dislikeMovie = async(req,res)=> {
    try{
        const {email, movieId} = req.body;
        let user = await User.findOne({email});
        
        // Create user if doesn't exist
        if(!user) {
            user = new User({
                email,
                likedMovies: [],
                likedMoviesList: [],
                dislikedMovies: []
            });
        }
        
        // Remove from liked if it was there
        user.likedMoviesList = user.likedMoviesList.filter(id => id !== movieId);
        
        // Add to disliked if not already there
        if(!user.dislikedMovies.includes(movieId)) {
            user.dislikedMovies.push(movieId);
        }
        
        await user.save();
        return res.json({msg:"Movie disliked successfully", success: true});
    }catch(error){
        console.error("Error disliking movie:", error);
        return res.json({msg:"Error disliking movie", success: false});
    }
};