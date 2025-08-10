import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../firebase-config";
import Card from "../components/Card";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getUsersLikedMovies } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function UserListedMovies() {
  const myList = useSelector((state) => state.netflix.myList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setEmail(currentUser.email);
    else navigate("/login");
  });

  useEffect(() => {
    if (email) {
      setLoading(true);
      dispatch(getUsersLikedMovies(email)).finally(() => setLoading(false));
    }
  }, [email, dispatch]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content flex column">
        <h1>My List</h1>
        {loading ? (
          <div className="loading">
            <h2>Loading your saved movies and shows...</h2>
          </div>
        ) : myList && myList.length > 0 ? (
          <div className="movies-grid">
            {myList.map((movie, index) => {
              return (
                <Card
                  movieData={movie}
                  index={index}
                  key={movie.id}
                  isLiked={true}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Your list is empty</h2>
            <p>Movies and TV shows you add to your list will appear here.</p>
            <button onClick={() => navigate('/')} className="browse-btn">
              Browse Content
            </button>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background-color: #141414;
  min-height: 100vh;
  color: white;
  
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    
    h1 {
      margin-left: 3rem;
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    /* Tablet responsiveness */
    @media (max-width: 768px) {
      margin: 1.5rem;
      margin-top: 6rem;
      gap: 2rem;
      
      h1 {
        margin-left: 1.5rem;
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
      margin: 1rem;
      margin-top: 5rem;
      gap: 1.5rem;
      
      h1 {
        margin-left: 1rem;
        font-size: 1.8rem;
        margin-bottom: 1rem;
        text-align: center;
      }
    }

    /* iPhone SE and smaller screens */
    @media (max-width: 375px) {
      margin: 0.8rem;
      margin-top: 4.5rem;
      gap: 1rem;
      
      h1 {
        margin-left: 0.8rem;
        font-size: 1.6rem;
        margin-bottom: 0.8rem;
        text-align: center;
      }
    }
    
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      
      h2 {
        color: #999;
        font-size: 1.5rem;
        text-align: center;
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        min-height: 200px;
        
        h2 {
          font-size: 1.2rem;
          padding: 0 1rem;
        }
      }

      /* iPhone SE and smaller screens */
      @media (max-width: 375px) {
        min-height: 150px;
        
        h2 {
          font-size: 1rem;
          padding: 0 0.5rem;
        }
      }
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
      
      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: white;
      }
      
      p {
        font-size: 1.2rem;
        color: #999;
        margin-bottom: 2rem;
        max-width: 400px;
      }
      
      .browse-btn {
        background-color: #e50914;
        color: white;
        border: none;
        padding: 12px 24px;
        font-size: 1.1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        
        &:hover {
          background-color: #f40612;
        }
      }

      /* Tablet responsiveness */
      @media (max-width: 768px) {
        min-height: 300px;
        
        h2 {
          font-size: 1.8rem;
        }
        
        p {
          font-size: 1.1rem;
          max-width: 350px;
          padding: 0 1rem;
        }
        
        .browse-btn {
          padding: 10px 20px;
          font-size: 1rem;
        }
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        min-height: 250px;
        padding: 0 1rem;
        
        h2 {
          font-size: 1.5rem;
          margin-bottom: 0.8rem;
        }
        
        p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          max-width: 300px;
        }
        
        .browse-btn {
          padding: 8px 16px;
          font-size: 0.9rem;
        }
      }

      /* iPhone SE and smaller screens */
      @media (max-width: 375px) {
        min-height: 200px;
        padding: 0 0.5rem;
        
        h2 {
          font-size: 1.3rem;
          margin-bottom: 0.6rem;
        }
        
        p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          max-width: 250px;
        }
        
        .browse-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
        }
      }
    }
    
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 2rem;
      padding: 0 3rem;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1.5rem;
        padding: 0 1.5rem;
      }

      @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
        padding: 0 1rem;
      }

      @media (max-width: 375px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.8rem;
        padding: 0 0.8rem;
      }
    }
  }
  
  .flex {
    display: flex;
  }
  
  .column {
    flex-direction: column;
  }
`;