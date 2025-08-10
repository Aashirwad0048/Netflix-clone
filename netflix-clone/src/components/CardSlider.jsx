import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

export default React.memo(function CardSlider({ data, title }) {
  const listRef = useRef();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  const handleDirection = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 70;
    
    // Updated responsive scroll distance for bigger card sizes
    let scrollDistance = 230; // Default for desktop (unchanged)
    if (window.innerWidth <= 375) {
      scrollDistance = 135; // Increased for bigger iPhone SE cards
    } else if (window.innerWidth <= 480) {
      scrollDistance = 145; // Increased for bigger mobile cards
    } else if (window.innerWidth <= 768) {
      scrollDistance = 155; // Increased for bigger tablet cards
    }
    
    if (direction === "left" && sliderPosition > 0) {
      listRef.current.style.transform = `translateX(${scrollDistance + distance}px)`;
      setSliderPosition(sliderPosition - 1);
    }
    if (direction === "right" && sliderPosition < 4) {
      listRef.current.style.transform = `translateX(${-scrollDistance + distance}px)`;
      setSliderPosition(sliderPosition + 1);
    }
  };

  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Container className="flex column">
        <h1>{title}</h1>
        <p style={{ color: '#999', marginLeft: '50px' }}>No content available</p>
      </Container>
    );
  }

  return (
    <Container
      className="flex column"
      showControls={showControls}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1>{title}</h1>
      <div className="wrapper">
        <div
          className={`slider-action left ${
            !showControls ? "none" : ""
          } flex j-center a-center`}
        >
          <AiOutlineLeft onClick={() => handleDirection("left")} />
        </div>
        <div className="slider flex" ref={listRef}>
          {data.map((movie, index) => {
            return <Card movieData={movie} index={index} key={movie.id} />;
          })}
        </div>
        <div
          className={`slider-action right ${
            !showControls ? "none" : ""
          } flex j-center a-center`}
        >
          <AiOutlineRight onClick={() => handleDirection("right")} />
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  z-index: 50;
  
  h1 {
    margin-left: 50px;
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .wrapper {
    position: relative;
    z-index: 50;
    
    .slider {
      width: max-content;
      gap: 1rem;
      transform: translateX(0px);
      transition: 0.3s ease-in-out;
      margin-left: 50px;
      z-index: 50;
      position: relative;
    }
    
    .slider-action {
      position: absolute;
      z-index: 999;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      
      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
      
      svg {
        font-size: 2rem;
        color: white;
        
        &:hover {
          color: #e50914;
        }
      }
    }
    
    .none {
      display: none;
    }
    
    .left {
      left: 0;
    }
    
    .right {
      right: 0;
    }
  }
  
  .flex {
    display: flex;
  }
  
  .column {
    flex-direction: column;
  }
  
  .j-center {
    justify-content: center;
  }
  
  .a-center {
    align-items: center;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    padding: 1.2rem 0;
    
    h1 {
      margin-left: 1.5rem;
      font-size: 1.1rem;
      margin-bottom: 0.6rem;
    }
    
    .wrapper {
      .slider {
        margin-left: 1.5rem;
        gap: 0.2rem; /* Further reduced for smaller cards */
      }
      
      .slider-action {
        width: 35px;
        
        svg {
          font-size: 1.3rem;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 0.8rem 0;
    
    h1 {
      margin-left: 0.8rem;
      font-size: 0.95rem;
      margin-bottom: 0.4rem;
    }
    
    .wrapper {
      .slider {
        margin-left: 0.8rem;
        gap: 0.15rem; /* Further reduced for smaller cards */
      }
      
      .slider-action {
        width: 25px;
        
        svg {
          font-size: 1.1rem;
        }
      }
    }
  }

  /* iPhone SE and extra small screens */
  @media (max-width: 375px) {
    padding: 0.6rem 0;
    
    h1 {
      margin-left: 0.5rem;
      font-size: 0.85rem;
      margin-bottom: 0.3rem;
    }
    
    .wrapper {
      .slider {
        margin-left: 0.5rem;
        gap: 0.1rem; /* Further reduced for smaller cards */
      }
      
      .slider-action {
        width: 20px;
        
        svg {
          font-size: 0.9rem;
        }
      }
    }
  }
`;
