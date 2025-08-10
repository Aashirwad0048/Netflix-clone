import {
    configureStore,
    createAsyncThunk,
    createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    myList: [],
};

const API_KEY = "3d39d6bfe362592e6aa293f01fbcf9b9"; // Updated TMDB API key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const getGenres = createAsyncThunk("netflix/genres", async () => {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        console.log('Genres API response:', data);
        
        if (!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch genres');
        }
        
        return data.genres || [];
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  "netflix/genre",
  async ({ genre, type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
      genres
    );
  }
);

export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

// API functions for interacting with our backend
export const getUsersLikedMovies = createAsyncThunk(
  "netflix/getUsersLikedMovies",
  async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
      return response.data.movies || [];
    } catch (error) {
      console.error("Error fetching liked movies:", error);
      return [];
    }
  }
);

export const addMovieToLiked = createAsyncThunk(
  "netflix/addMovieToLiked",
  async ({ email, movie }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/add", {
        email,
        movie,
      });
      console.log(response.data.msg);
      return movie;
    } catch (error) {
      console.error("Error adding movie to liked list:", error);
      throw error;
    }
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "netflix/removeMovieFromLiked",
  async ({ movieId, email }) => {
    try {
      const response = await axios.put("http://localhost:5000/api/user/remove", {
        email,
        movieId,
      });
      console.log(response.data.msg);
      return movieId;
    } catch (error) {
      console.error("Error removing movie from liked list:", error);
      throw error;
    }
  }
);

const NetflixSlice = createSlice({
    name: 'netflix',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload || [];
            state.genresLoaded = true;
        });
        builder.addCase(getGenres.rejected, (state, action) => {
            console.error('Failed to fetch genres:', action.error.message);
            state.genres = [];
            state.genresLoaded = false;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload || [];
        });
        builder.addCase(fetchMovies.rejected, (state, action) => {
            console.error('Failed to fetch movies:', action.error.message);
            state.movies = [];
        });
        builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
            state.movies = action.payload || [];
        });
        builder.addCase(fetchDataByGenre.rejected, (state, action) => {
            console.error('Failed to fetch data by genre:', action.error.message);
            state.movies = [];
        });
        builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
            state.myList = action.payload || [];
        });
        builder.addCase(getUsersLikedMovies.rejected, (state, action) => {
            console.error('Failed to fetch user liked movies:', action.error.message);
            state.myList = [];
        });
        builder.addCase(addMovieToLiked.fulfilled, (state, action) => {
            const movieExists = state.myList.find(movie => movie.id === action.payload.id);
            if (!movieExists) {
                state.myList.push(action.payload);
            }
        });
        builder.addCase(addMovieToLiked.rejected, (state, action) => {
            console.error('Failed to add movie to liked list:', action.error.message);
        });
        builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
            state.myList = state.myList.filter(movie => movie.id !== action.payload);
        });
        builder.addCase(removeMovieFromLiked.rejected, (state, action) => {
            console.error('Failed to remove movie from liked list:', action.error.message);
        });
    },
});

export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer,
    },
});