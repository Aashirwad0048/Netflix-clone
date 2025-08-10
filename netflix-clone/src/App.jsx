import React from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import TVShows from "./pages/TVShows";
import Movies from "./pages/Movies";
import UserListedMovies from "./pages/UserMyList";

export default function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/signup" element={<Signup/>}/>
      <Route exact path="/player" element={<Player/>}/>
      <Route exact path="/tv" element={<TVShows/>}/>
      <Route exact path="/movies" element={<Movies/>}/>
      <Route exact path="/mylist" element={<UserListedMovies/>}/>
      <Route exact path="/" element={<Netflix/>}/>
    </Routes>
  </BrowserRouter>
  );
}

