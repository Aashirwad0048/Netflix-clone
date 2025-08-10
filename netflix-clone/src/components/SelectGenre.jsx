import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { fetchDataByGenre } from "../store";

export default function SelectGenre({ genres, type }) {
  const dispatch = useDispatch();
  
  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    if (selectedGenre !== "default") {
      dispatch(fetchDataByGenre({ genre: selectedGenre, type }));
    }
  };

  return (
    <Container>
      <select className="flex" onChange={handleGenreChange}>
        <option value="default">Genres</option>
        {genres.map((genre) => {
          return (
            <option value={genre.id} key={genre.id}>
              {genre.name}
            </option>
          );
        })}
      </select>
    </Container>
  );
}

const Container = styled.div`
  select {
    margin-left: 5rem;
    cursor: pointer;
    font-size: 1.4rem;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.2rem;
    
    option {
      background-color: #141414;
      color: white;
    }

    /* Tablet responsiveness */
    @media (max-width: 768px) {
      margin-left: 2rem;
      font-size: 1.2rem;
      padding: 0.4rem;
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
      margin-left: 0.5rem;
      font-size: 0.85rem;
      padding: 0.25rem;
      min-width: 80px;
    }

    /* iPhone SE and smaller screens */
    @media (max-width: 375px) {
      margin-left: 0.3rem;
      font-size: 0.75rem;
      padding: 0.2rem;
      min-width: 70px;
    }
  }
`;
