import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";
import Footer from "../components/Footer";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import HQImage from "../assets/hq.jpg";
import HQTitle from "../assets/hq title.png";

function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  
  // Background video/image states
  const [showVideo, setShowVideo] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  
  // Use Aap Jaisa Koi video and audio
  const videoSrc = '/Aap Jaisa Koi.mp4';
  const audioSrc = '/Aap Jaisa Koi _ Official Trailer _ R. Madhavan, Fatima Sana Shaikh _ Netflix India.mp3';
  const backgroundImage = HQImage; // Using HQ image as background

  useEffect(() => {
    if (!genres.length) dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "movie" }));
    }
  }, [genresLoaded]);

  // Audio sync and control functions
  const syncAudioWithVideo = () => {
    if (videoRef.current && audioRef.current && !audioRef.current.muted) {
      const videoTime = videoRef.current.currentTime;
      const audioTime = audioRef.current.currentTime;
      const timeDiff = Math.abs(videoTime - audioTime);
      
      if (timeDiff > 0.05) {
        audioRef.current.currentTime = videoTime;
      }
    }
  };

  const toggleAudioMute = (e) => {
    e.stopPropagation();
    if (audioRef.current && videoRef.current) {
      const newMutedState = !audioMuted;
      audioRef.current.muted = newMutedState;
      setAudioMuted(newMutedState);
      
      if (!newMutedState && showVideo) {
        audioRef.current.currentTime = videoRef.current.currentTime;
        
        if (audioRef.current.paused) {
          audioRef.current.play().catch(e => {
            console.error('Error playing audio:', e);
          });
        }
        
        setTimeout(() => {
          syncAudioWithVideo();
        }, 100);
      }
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowVideo(false);
    
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
    
    setTimeout(() => {
      setVideoEnded(false);
      setShowVideo(true);
    }, 5000);
  };

  // Start video after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle video play when showVideo changes
  useEffect(() => {
    if (showVideo && videoRef.current && audioRef.current) {
      setTimeout(() => {
        if (videoRef.current && audioRef.current) {
          videoRef.current.currentTime = 0;
          audioRef.current.currentTime = 0;
          
          videoRef.current.muted = true;
          audioRef.current.muted = true; // Start muted
          
          Promise.all([
            videoRef.current.play(),
            audioRef.current.play()
          ]).then(() => {
            const syncInterval = setInterval(() => {
              if (videoRef.current && audioRef.current && !videoRef.current.paused && !audioRef.current.paused) {
                syncAudioWithVideo();
              } else {
                clearInterval(syncInterval);
              }
            }, 1000);
          }).catch(e => {
            console.error('Error playing video/audio:', e);
            videoRef.current.play().catch(err => {
              console.error('Video play also failed:', err);
            });
          });
        }
      }, 100);
    }
  }, [showVideo]);

  const [user, setUser] = useState(undefined);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setUser(currentUser.uid);
    else navigate("/login");
  });

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="page-header">
        <div className="header-controls">
          <h1>Movies</h1>
          <SelectGenre genres={genres} type="movie" />
        </div>
      </div>
      <div className="hero">
        <div className="background-wrapper">
          <img 
            src={backgroundImage} 
            alt="Movies Background" 
            className={`background-image ${showVideo ? 'fade-out' : ''}`}
          />
          <video 
            ref={videoRef}
            src={videoSrc} 
            loop={false}
            playsInline
            preload="auto"
            muted={true}
            className={`background-video ${showVideo ? 'fade-in' : ''}`}
            onEnded={handleVideoEnd}
            onTimeUpdate={() => {
              if (audioRef.current && showVideo && !videoRef.current.paused) {
                syncAudioWithVideo();
              }
            }}
          />
          
          <audio 
            ref={audioRef}
            src={audioSrc}
            loop={false}
            preload="auto"
            muted={audioMuted}
          />
          
          {showVideo && (
            <div className="audio-indicator" onClick={toggleAudioMute}>
              {audioMuted ? '🔇' : '🔊'}
            </div>
          )}
        </div>
        
        <div className="container">
          <div className="logo">
            <img src={HQTitle} alt="HQ Movies" />
          </div>
          <div className="movie-info">
            <p>Experience cinema in high quality with stunning visuals and immersive storytelling.</p>
          </div>
          <div className="buttons flex">
            <button className="flex j-center a-center" onClick={() => navigate('/player')}>
              <FaPlay /> Play
            </button>
            <button className="flex j-center a-center">
              <AiOutlineInfoCircle /> More Info
            </button>
          </div>
        </div>
      </div>
      
      <div className="data">
        {movies.length ? (
          <>
            <Slider movies={movies} contentType="movie" />
          </>
        ) : (
          <h1 className="not-available">
            No Movies available for the selected genre. Please select a
            different genre.
          </h1>
        )}
      </div>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  .page-header {
    position: relative;
    z-index: 50;
    padding: 6rem 50px 2rem 50px;
    background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 2rem;
      
      h1 {
        color: white;
        font-size: 1.5rem; /* Reduced from 1.7rem */
        font-weight: bold;
        margin: 0;
      }
    }
  }

  .hero {
    position: relative;
    width: 100vw;
    height: 95vh;
    overflow: hidden;
    margin-top: 0;
    
    .background-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .background-image,
    .background-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(60%);
      transition: opacity 2s ease-in-out;
    }
    
    .background-image {
      opacity: 1;
      z-index: 2;
      
      &.fade-out {
        opacity: 0;
        z-index: 1;
      }
    }
    
    .background-video {
      opacity: 0;
      z-index: 1;
      
      &.fade-in {
        opacity: 1;
        z-index: 2;
      }
    }
    
    .audio-indicator {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      z-index: 10;
      background: rgba(0, 0, 0, 0.6);
      padding: 0.5rem;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
      pointer-events: auto;
      
      &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
        border-color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .container {
      position: absolute;
      bottom: 5rem;
      left: 2rem;
      z-index: 10;
      max-width: 45%;
      
      .logo {
        margin-bottom: 1.5rem;
        margin-left: 1rem;
        
        img {
          width: 100%;
          max-width: 500px;
          height: auto;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
        }
      }
      
      .movie-info {
        margin-bottom: 2rem;
        
        p {
          color: white;
          font-size: 1.2rem;
          line-height: 1.5;
          margin: 0;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
        }
      }
      
      .buttons {
        display: flex;
        gap: 1rem;
        
        button {
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.75rem 2rem;
          border: none;
          cursor: pointer;
          transition: 0.3s ease-in-out;
          font-weight: 600;
          
          &:hover {
            opacity: 0.8;
          }
          
          &:nth-of-type(1) {
            background-color: white;
            color: black;
          }
          
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
          }
        }
      }
    }
  }
  
  .data {
    position: relative;
    z-index: 5;
    padding: 4rem 0;
    margin-top: 2rem;
    
    .not-available {
      text-align: center;
      margin-top: 4rem;
      color: white;
      font-size: 1.5rem;
    }
  }
  
  .flex {
    display: flex;
  }
  
  .j-center {
    justify-content: center;
  }
  
  .a-center {
    align-items: center;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .page-header {
      padding: 5rem 1.5rem 1.5rem 1.5rem;
      
      .header-controls {
        flex-direction: row; /* Keep side by side on tablet */
        gap: 1.5rem;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        
        h1 {
          font-size: 1.2rem; /* Reduced from 1.4rem */
          margin: 0;
          white-space: nowrap;
        }
      }
    }

    .hero {
      height: 45vh; /* Reduced for tablets */
      
      .audio-indicator {
        bottom: 1rem;
        right: 1rem;
        width: 2rem;
        height: 2rem;
        font-size: 0.8rem;
      }
      
      .container {
        bottom: 2rem;
        left: 0.8rem;
        right: 0.8rem;
        max-width: 85%;
        
        .logo {
          margin-left: 0.5rem;
          margin-bottom: 1rem;
          
          img {
            max-width: 220px; /* Reduced from 300px */
          }
        }
        
        .movie-info {
          margin-bottom: 1.2rem;
          
          p {
            font-size: 0.9rem;
            line-height: 1.4;
          }
        }
        
        .buttons {
          gap: 0.5rem;
          flex-direction: row;
          
          button {
            font-size: 0.75rem;
            gap: 0.3rem;
            padding: 0.4rem 0.6rem;
            width: auto;
            min-width: 80px;
          }
        }
      }
    }
    
    .data {
      padding: 2rem 0;
      margin-top: 1rem;
    }
  }

  @media (max-width: 480px) {
    .page-header {
      padding: 4.5rem 0.8rem 1rem 0.8rem;
      
      .header-controls {
        flex-direction: column; /* Stack vertically on mobile */
        gap: 0.8rem;
        align-items: flex-start; /* Move to left for mobile */
        justify-content: flex-start;
        
        h1 {
          font-size: 1rem; /* Reduced from 1.2rem */
          margin: 0;
          text-align: left; /* Explicitly align left */
        }
      }
    }

    .hero {
      height: 35vh; /* Much smaller rectangular format */
      
      .audio-indicator {
        bottom: 0.5rem;
        right: 0.5rem;
        width: 1.5rem;
        height: 1.5rem;
        font-size: 0.6rem;
        padding: 0.1rem;
      }
      
      .container {
        bottom: 1.5rem;
        left: 0.4rem;
        right: 0.4rem;
        max-width: 90%;
        
        .logo {
          margin-left: 0.2rem;
          margin-bottom: 0.8rem;
          
          img {
            max-width: 120px; /* Reduced from 200px */
          }
        }
        
        .movie-info {
          display: none; /* Hide description text for mobile */
        }
        
        .buttons {
          gap: 0.4rem;
          
          button {
            font-size: 0.65rem;
            gap: 0.2rem;
            padding: 0.3rem 0.5rem;
            min-width: 70px;
          }
        }
      }
    }
    
    .data {
      padding: 1.5rem 0;
      margin-top: 0.5rem;
    }
  }

  /* iPhone SE and extra small screens */
  @media (max-width: 375px) {
    .page-header {
      padding: 4rem 0.5rem 0.8rem 0.5rem;
      
      .header-controls {
        flex-direction: column;
        gap: 0.6rem;
        align-items: flex-start;
        
        h1 {
          font-size: 0.9rem; /* Reduced from 1.1rem */
          margin: 0;
          text-align: left; /* Explicitly align left */
        }
      }
    }

    .hero {
      height: 30vh; /* Very compact letterbox format */
      
      .audio-indicator {
        bottom: 0.3rem;
        right: 0.3rem;
        width: 1.2rem;
        height: 1.2rem;
        font-size: 0.5rem;
        padding: 0.05rem;
      }
      
      .container {
        bottom: 1.2rem;
        left: 0.2rem;
        right: 0.2rem;
        max-width: 95%;
        
        .logo {
          margin-left: 0.1rem;
          margin-bottom: 0.6rem;
          
          img {
            max-width: 100px; /* Reduced from 160px */
          }
        }
        
        .movie-info {
          display: none; /* Hide description text for iPhone SE */
        }
        
        .buttons {
          gap: 0.3rem;
          
          button {
            font-size: 0.6rem;
            gap: 0.15rem;
            padding: 0.25rem 0.4rem;
            min-width: 60px;
          }
        }
      }
    }
    
    .data {
      padding: 1rem 0;
      margin-top: 0.3rem;
    }
  }
`;

export default Movies;
