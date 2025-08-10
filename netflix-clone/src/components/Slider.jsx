import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";

export default function Slider({movies, contentType = 'movie'}) {
    // Safety check: return early if movies is not an array or is empty
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
        return <LoadingContainer>Loading {contentType === 'tv' ? 'TV shows' : 'movies'}...</LoadingContainer>;
    }

    const getMoviesFromRange=(from, to) => {
        return movies.slice(from, to);
    }
    
    // Define titles based on content type
    const getTitles = () => {
        if (contentType === 'tv') {
            return [
                "Trending TV Shows",
                "New Episodes",
                "Top Rated Shows", 
                "Drama Series",
                "Popular on Netflix",
                "Because You Watched Stranger Things"
            ];
        } else {
            return [
                "Trending Now",
                "New Releases",
                "Top Rated",
                "Action & Adventure", 
                "Popular on Netflix",
                "Because You Watched Stranger Things"
            ];
        }
    };
    
    const titles = getTitles();
    
    return (
        <SliderContainer>
            <CardSlider title={titles[0]} data={getMoviesFromRange(0, 10)}/>
            <CardSlider title={titles[1]} data={getMoviesFromRange(10, 20)}/>
            <CardSlider title={titles[2]} data={getMoviesFromRange(20, 30)}/>
            <CardSlider title={titles[3]} data={getMoviesFromRange(30, 40)}/>
            <CardSlider title={titles[4]} data={getMoviesFromRange(40, 50)}/>
            <CardSlider title={titles[5]} data={getMoviesFromRange(50, 60)}/>
        </SliderContainer>
    );
}

const SliderContainer = styled.div`
  background-color: black;
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    padding: 0 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.4rem;
  }

  @media (max-width: 375px) {
    padding: 0 0.25rem;
  }
`;

const LoadingContainer = styled.div`
  color: #999;
  margin-left: 50px;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    margin-left: 1.5rem;
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    margin-left: 0.8rem;
    padding: 1rem 0;
    font-size: 0.9rem;
  }

  @media (max-width: 375px) {
    margin-left: 0.5rem;
    padding: 0.8rem 0;
    font-size: 0.8rem;
  }
`;
