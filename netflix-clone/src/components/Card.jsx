import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { removeMovieFromLiked, addMovieToLiked } from "../store";

export default React.memo(function Card({ index, movieData, isLiked = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [isLikedState, setIsLikedState] = useState(false);
  const [isDislikedState, setIsDislikedState] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // Start with image first
  const [audioMuted, setAudioMuted] = useState(true); // Separate audio mute state
  const [userInteracted, setUserInteracted] = useState(false); // Add missing state
  const [showMobileWidget, setShowMobileWidget] = useState(false); // Mobile widget state
  const [isLoading, setIsLoading] = useState(false); // Loading state for mobile actions
  const myList = useSelector((state) => state.netflix.myList);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  // Simple video sources like home page
  const videoSrc = '/Stranger.mp4'; // Use same working video as home page
  const audioSrc = '/Stranger.mp3'; // Audio from public folder
  
  // Check if movie is in user's list
  const isInMyList = myList.find(movie => movie.id === movieData.id) || isLiked;

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setEmail(currentUser.email);
    } else navigate("/login");
  });

  // Simple mouse enter - show video immediately for testing
  const handleMouseEnter = () => {
    // Don't trigger hover video on mobile devices
    if (isMobile()) {
      return;
    }
    
    console.log("🎯 Card hover started");
    setIsHovered(true);
    setShowVideo(true); // Show immediately for testing
    console.log("⚡ Setting showVideo to true immediately");
  };

  const handleMouseLeave = () => {
    // Don't trigger hover events on mobile devices
    if (isMobile()) {
      return;
    }
    
    console.log("👋 Card hover ended");
    setIsHovered(false);
    setShowVideo(false);
    
    // Clear any sync intervals
    if (hoverTimeoutRef.current) {
      clearInterval(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Stop video and audio
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Video play effect with sync like home page
  useEffect(() => {
    if (showVideo && videoRef.current && audioRef.current) {
      console.log('Card video should now be visible, attempting to play...');
      
      // Small delay to ensure the video element is ready
      setTimeout(() => {
        if (videoRef.current && audioRef.current) {
          console.log('Card video and audio elements found, current state:', {
            videoPaused: videoRef.current.paused,
            audioPaused: audioRef.current.paused,
            videoTime: videoRef.current.currentTime,
            audioTime: audioRef.current.currentTime,
            videoReadyState: videoRef.current.readyState,
            audioReadyState: audioRef.current.readyState
          });
          
          // Reset both to beginning
          videoRef.current.currentTime = 0;
          audioRef.current.currentTime = 0;
          
          // Video stays muted, audio handles the sound
          videoRef.current.muted = true;
          audioRef.current.muted = audioMuted; // Use current audio mute state
          
          // Play both simultaneously
          Promise.all([
            videoRef.current.play(),
            audioRef.current.play()
          ]).then(() => {
            console.log('Card video and audio started playing in sync');
            
            // Set up periodic sync checking
            const syncInterval = setInterval(() => {
              if (videoRef.current && audioRef.current && !videoRef.current.paused && !audioRef.current.paused) {
                syncAudioWithVideo();
              } else {
                clearInterval(syncInterval);
              }
            }, 1000); // Check sync every second
            
            // Store interval ref to clear on unmount
            hoverTimeoutRef.current = syncInterval;
            
          }).catch(e => {
            console.error('Error playing card video/audio:', e);
            // If simultaneous play fails, try video only
            videoRef.current.play().catch(err => {
              console.error('Card video play also failed:', err);
            });
          });
        }
      }, 50); // Small delay for element readiness
    }
  }, [showVideo]); // Remove audioMuted dependency to prevent restart

  // Cleanup timeout and intervals on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        clearInterval(hoverTimeoutRef.current); // Also clear intervals
      }
    };
  }, []);

  // Handle click outside mobile widget to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileWidget && !event.target.closest('.mobile-widget-content')) {
        setShowMobileWidget(false);
      }
    };

    if (showMobileWidget) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMobileWidget]);

  // Debug email state
  useEffect(() => {
    console.log("Card component - Email state:", email);
    console.log("Card component - Movie data:", movieData);
  }, [email, movieData]);

  // Handle user interaction to enable autoplay
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      console.log('User interaction enabled for card video');
    }
  };

  // Function to sync audio with video (same as home page)
  const syncAudioWithVideo = () => {
    if (videoRef.current && audioRef.current && !audioRef.current.muted) {
      const videoTime = videoRef.current.currentTime;
      const audioTime = audioRef.current.currentTime;
      const timeDiff = Math.abs(videoTime - audioTime);
      
      // If they're out of sync by more than 0.05 seconds, sync them
      if (timeDiff > 0.05) {
        audioRef.current.currentTime = videoTime;
        console.log('Card audio synced with video at time:', videoTime, 'Time diff was:', timeDiff);
      }
    }
  };

  // Toggle audio mute (same as home page)
  const toggleAudioMute = (e) => {
    e.stopPropagation();
    if (audioRef.current && videoRef.current) {
      const newMutedState = !audioMuted;
      audioRef.current.muted = newMutedState;
      setAudioMuted(newMutedState);
      
      // Enable user interaction when they click the audio button
      if (!userInteracted) {
        setUserInteracted(true);
        console.log('User interaction enabled via card audio button');
      }
      
      // If we're unmuting, sync the audio with the current video position
      if (!newMutedState && showVideo) {
        // Immediately sync audio to current video position
        audioRef.current.currentTime = videoRef.current.currentTime;
        
        // If audio is paused, play it
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => {
            console.log('Card audio resumed and synced with video at time:', videoRef.current.currentTime);
          }).catch(e => {
            console.error('Error playing card audio:', e);
          });
        }
        
        // Additional sync check after a short delay
        setTimeout(() => {
          syncAudioWithVideo();
        }, 100);
      }
      
      console.log('Card audio muted:', newMutedState, 'Video time:', videoRef.current.currentTime);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const addToList = async () => {
    if (!email) {
      console.error("No email found for user");
      alert("Please login to add movies to your list");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Adding movie to list:", { email, movieData });
      const response = await axios.post("http://localhost:5000/api/user/add", {
        email,
        movie: movieData,
      });
      
      if (response.data.success) {
        // Update Redux state for immediate UI feedback
        dispatch(addMovieToLiked({ email, movie: movieData }));
        console.log("Movie added to list successfully");
        // Close mobile widget after successful action
        if (isMobile()) {
          setShowMobileWidget(false);
        }
      } else {
        console.log("Add to list failed:", response.data.msg);
        alert(response.data.msg || "Failed to add movie to list");
      }
    } catch (error) {
      console.error("Error adding movie to list:", error);
      alert("Error adding movie to list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromList = async () => {
    if (!email) {
      console.error("No email found for user");
      alert("Please login to manage your list");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Removing movie from list:", { email, movieId: movieData.id });
      await axios.put("http://localhost:5000/api/user/remove", {
        email,
        movieId: movieData.id,
      });
      // Update Redux state for immediate UI feedback
      dispatch(removeMovieFromLiked({ movieId: movieData.id, email }));
      console.log("Movie removed from list successfully");
      // Close mobile widget after successful action
      if (isMobile()) {
        setShowMobileWidget(false);
      }
    } catch (error) {
      console.error("Error removing movie from list:", error);
      alert("Error removing movie from list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!email) {
      console.error("No email found for user");
      alert("Please login to rate movies");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Liking movie:", { email, movieId: movieData.id });
      await axios.post("http://localhost:5000/api/user/like", {
        email,
        movieId: movieData.id,
      });
      setIsLikedState(true);
      setIsDislikedState(false);
      console.log("Movie liked successfully");
    } catch (error) {
      console.error("Error liking movie:", error);
      alert("Error liking movie. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!email) {
      console.error("No email found for user");
      alert("Please login to rate movies");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Disliking movie:", { email, movieId: movieData.id });
      await axios.post("http://localhost:5000/api/user/dislike", {
        email,
        movieId: movieData.id,
      });
      setIsDislikedState(true);
      setIsLikedState(false);
      console.log("Movie disliked successfully");
    } catch (error) {
      console.error("Error disliking movie:", error);
      alert("Error disliking movie. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile detection function
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // Handle card click - show widget on mobile, navigate on desktop
  const handleCardClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (isMobile()) {
      // On mobile, toggle the widget
      setShowMobileWidget(!showMobileWidget);
    } else {
      // On desktop, navigate to player
      navigate("/player");
    }
  };

  return (
    <Container
      index={index}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleUserInteraction}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="card"
        onClick={handleCardClick}
      />

      <div className="hover">
        <div className="image-video-container">
          <img
            src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
            alt="card"
            onClick={handleCardClick}
            className={`card-image ${showVideo ? 'fade-out' : ''}`}
          />
          
          {showVideo && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                loop={false} // Remove loop like home page
                playsInline
                preload="auto"
                muted={true}
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 99999,
                }}
                onLoadStart={() => console.log("📥 Card video loading started")}
                onCanPlay={() => console.log("▶️ Card video can play")}
                onPlay={() => console.log("🎬 Card video play event triggered")}
                onError={(e) => console.error("❌ Card video error:", e.target.error)}
                onLoadedData={() => console.log("📁 Card video data loaded")}
                onTimeUpdate={() => {
                  // Periodically sync audio with video (same as home page)
                  if (audioRef.current && showVideo && !videoRef.current.paused) {
                    syncAudioWithVideo();
                  }
                }}
              />
              
              <audio
                ref={audioRef}
                src={audioSrc}
                loop={false} // Remove loop like home page
                preload="auto"
                muted={audioMuted}
                onError={(e) => {
                  console.error('Card audio error:', e);
                  console.error('Card audio src:', audioSrc);
                }}
                onLoadStart={() => console.log('Card audio loading started')}
                onCanPlay={() => console.log('Card audio can play')}
                onLoadedData={() => console.log('Card audio loaded data')}
                onPlay={() => console.log('Card audio started playing')}
                onPause={() => console.log('Card audio paused')}
              />
              
              <div className="audio-indicator" onClick={toggleAudioMute}>
                {audioMuted ? <HiVolumeOff /> : <HiVolumeUp />}
              </div>
            </>
          )}
        </div>
        <div className="info-container flex column">
          <h3 className="name" onClick={handleCardClick}>
            {movieData.name}
          </h3>
          <div className="icons flex j-between">
            <div className="controls flex">
              <IoPlayCircleSharp
                title="Play"
                onClick={handleCardClick}
              />
              <RiThumbUpFill 
                title="Like" 
                onClick={handleLike}
                style={{ 
                  color: isLikedState ? '#46d369' : 'white',
                  cursor: 'pointer'
                }}
              />
              <RiThumbDownFill 
                title="Dislike" 
                onClick={handleDislike}
                style={{ 
                  color: isDislikedState ? '#e50914' : 'white',
                  cursor: 'pointer'
                }}
              />
              {isInMyList ? (
                <BsCheck
                  title="Remove from List"
                  onClick={removeFromList}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <AiOutlinePlus 
                  title="Add to my list" 
                  onClick={addToList}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
            <div className="info">
              <BiChevronDown title="More Info" />
            </div>
          </div>
          <div className="genres flex">
            <ul className="flex">
              {movieData.genres && movieData.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Widget */}
      {showMobileWidget && isMobile() && (
        <div className="mobile-widget">
          <div className="mobile-widget-content">
            <h4>{movieData.name}</h4>
            <div className="mobile-controls">
              <button 
                onClick={() => navigate("/player")} 
                className="play-btn"
                disabled={isLoading}
              >
                <IoPlayCircleSharp /> Play
              </button>
              <div className="mobile-icons">
                <button 
                  onClick={handleLike}
                  className={`mobile-btn ${isLikedState ? 'active' : ''}`}
                  title="Like"
                  disabled={isLoading}
                >
                  <RiThumbUpFill />
                </button>
                <button 
                  onClick={handleDislike}
                  className={`mobile-btn ${isDislikedState ? 'active' : ''}`}
                  title="Dislike"
                  disabled={isLoading}
                >
                  <RiThumbDownFill />
                </button>
                {isInMyList ? (
                  <button 
                    onClick={removeFromList}
                    className="mobile-btn active"
                    title="Remove from list"
                    disabled={isLoading}
                  >
                    <BsCheck />
                  </button>
                ) : (
                  <button 
                    onClick={addToList}
                    className="mobile-btn"
                    title="Add to list"
                    disabled={isLoading}
                  >
                    <AiOutlinePlus />
                  </button>
                )}
              </div>
              {isLoading && (
                <div className="loading-indicator">
                  Processing...
                </div>
              )}
              {!email && (
                <div className="login-warning">
                  Please login to use these features
                </div>
              )}
            </div>
            <button 
              className="close-widget"
              onClick={() => setShowMobileWidget(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Container>
  );
});

const Container = styled.div.attrs(props => ({
  style: {
    maxWidth: window.innerWidth <= 375 ? '120px' : window.innerWidth <= 480 ? '130px' : window.innerWidth <= 768 ? '140px' : '230px',
    width: window.innerWidth <= 375 ? '120px' : window.innerWidth <= 480 ? '130px' : window.innerWidth <= 768 ? '140px' : '230px'
  }
}))`
  /* Base styles - Desktop first */
  height: 100%;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  
  /* Force mobile responsive overrides */
  @media screen and (max-width: 768px) {
    max-width: 140px !important;
    width: 140px !important;
    
    &:hover {
      transform: scale(1.02) !important;
    }
  }
  
  @media screen and (max-width: 480px) {
    max-width: 130px !important;
    width: 130px !important;
    
    &:hover {
      transform: scale(1.015) !important;
    }
  }
  
  @media screen and (max-width: 375px) {
    max-width: 120px !important;
    width: 120px !important;
    
    &:hover {
      transform: scale(1.01) !important;
    }
  }
  
  &:hover {
    transform: scale(1.05);
    z-index: 99999;
  }
  
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 100;
    transition: all 0.3s ease-in-out;
    position: relative;
  }
  
  .hover {
    z-index: 99999;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none;
  }
  
  &:hover .hover {
    opacity: 1;
    transform: scale(1);
    pointer-events: all;
  }
    
    .image-video-container {
      position: relative;
      height: 180px;
      overflow: hidden;
      border-radius: 0.3rem 0.3rem 0 0;
      
      .card-image {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 0.3rem 0.3rem 0 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        opacity: 1;
        transition: opacity 1s ease-in-out;
        &.fade-out {
          opacity: 0;
          z-index: 1;
        }
      }
      
      .card-video {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 0.3rem 0.3rem 0 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        opacity: 0;
        transition: opacity 1s ease-in-out;

        &.fade-in {
          opacity: 1;
          z-index: 5;
        }
      }
      
      .audio-indicator {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999999;
        font-size: 14px;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        
        &:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
          border-color: rgba(255, 255, 255, 0.6);
        }
      }
      
      .video-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 8;
        
        .loading-spinner {
          color: white;
          font-size: 24px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      }
    }
    
    .info-container {
      padding: 0.7rem 1rem;
      gap: 0.3rem;
      
      .name {
        color: white;
        font-size: 1rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        
        &:hover {
          color: #e50914;
        }
      }
    }
    
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        color: white;
        
        &:hover {
          color: #e50914;
          transform: scale(1.2);
        }
      }
    }
    
    .genres {
      ul {
        gap: 1rem;
        margin: 0;
        padding: 0;
        
        li {
          padding-right: 0.7rem;
          color: #b3b3b3;
          font-size: 0.9rem;
          transition: color 0.3s ease-in-out;
          
          &:first-of-type {
            list-style-type: none;
          }
          
          &:hover {
            color: white;
          }
        }
      }
    }
  }
  
  .flex {
    display: flex;
  }
  
  .column {
    flex-direction: column;
  }
  
  .j-between {
    justify-content: space-between;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    max-width: 140px !important; /* Increased size */
    width: 140px !important;
    
    &:hover {
      transform: scale(1.02); /* Bigger hover effect */
    }
    
    .hover {
      width: 11rem; /* Increased from 9rem */
      top: -5vh; /* Adjusted positioning */
      
      .image-video-container {
        height: 90px; /* Increased from 70px */
        
        .card-image {
          height: 90px;
        }
        
        .audio-indicator {
          width: 16px; /* Increased from 12px */
          height: 16px;
          font-size: 8px; /* Increased from 6px */
          bottom: 3px;
          right: 3px;
        }
      }
      
      .info-container {
        padding: 0.2rem 0.25rem; /* Increased padding */
        gap: 0.08rem;
        
        .name {
          font-size: 0.75rem; /* Increased from 0.6rem */
          margin: 0 0 0.08rem 0;
        }
      }
      
      .icons {
        .controls {
          gap: 0.2rem; /* Increased from 0.15rem */
        }
        
        svg {
          font-size: 1rem; /* Increased from 0.8rem */
        }
      }
      
      .genres {
        ul {
          li {
            font-size: 0.65rem; /* Increased from 0.5rem */
            padding-right: 0.15rem;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    max-width: 130px !important; /* Increased size */
    width: 130px !important;
    
    &:hover {
      transform: scale(1.015); /* Bigger hover effect */
    }
    
    .hover {
      width: 10rem; /* Increased from 8rem */
      top: -4vh; /* Adjusted positioning */
      
      .image-video-container {
        height: 80px; /* Increased from 60px */
        
        .card-image {
          height: 80px;
        }
        
        .audio-indicator {
          width: 14px; /* Increased from 10px */
          height: 14px;
          font-size: 7px; /* Increased from 5px */
          bottom: 3px;
          right: 3px;
        }
      }
      
      .info-container {
        padding: 0.15rem 0.2rem; /* Increased padding */
        gap: 0.06rem;
        
        .name {
          font-size: 0.7rem; /* Increased from 0.55rem */
          margin: 0 0 0.06rem 0;
        }
      }
      
      .icons {
        .controls {
          gap: 0.15rem; /* Increased from 0.1rem */
        }
        
        svg {
          font-size: 0.9rem; /* Increased from 0.7rem */
        }
      }
      
      .genres {
        ul {
          li {
            font-size: 0.6rem; /* Increased from 0.45rem */
            padding-right: 0.12rem;
          }
        }
      }
    }
  }

  /* iPhone SE and extra small screens */
  @media (max-width: 375px) {
    max-width: 120px !important; /* Increased size */
    width: 120px !important;
    
    &:hover {
      transform: scale(1.01); /* Bigger hover effect */
    }
    
    .hover {
      width: 9.5rem; /* Increased from 7.5rem */
      top: -3.5vh; /* Adjusted positioning */
      
      .image-video-container {
        height: 75px; /* Increased from 55px */
        
        .card-image {
          height: 75px;
        }
        
        .audio-indicator {
          width: 12px; /* Increased from 8px */
          height: 12px;
          font-size: 6px; /* Increased from 4px */
          bottom: 2px;
          right: 2px;
        }
      }
      
      .info-container {
        padding: 0.12rem 0.15rem; /* Increased padding */
        gap: 0.04rem;
        
        .name {
          font-size: 0.65rem; /* Increased from 0.5rem */
          margin: 0 0 0.05rem 0;
        }
      }
      
      .icons {
        .controls {
          gap: 0.12rem; /* Increased from 0.08rem */
        }
        
        svg {
          font-size: 0.85rem; /* Increased from 0.65rem */
        }
      }
      
      .genres {
        ul {
          li {
            font-size: 0.55rem; /* Increased from 0.4rem */
            padding-right: 0.08rem;
          }
        }
      }
    }
  }

  /* Mobile Widget Styles */
  .mobile-widget {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;

    .mobile-widget-content {
      background: #141414;
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 350px;
      width: 100%;
      position: relative;
      border: 1px solid #333;

      h4 {
        color: white;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        text-align: center;
      }

        .mobile-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          .play-btn {
            background: white;
            color: black;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            
            &:hover:not(:disabled) {
              background: #e6e6e6;
            }

            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            svg {
              font-size: 1.2rem;
            }
          }

          .mobile-icons {
            display: flex;
            justify-content: space-around;
            gap: 0.5rem;

            .mobile-btn {
              background: rgba(255, 255, 255, 0.1);
              border: 2px solid rgba(255, 255, 255, 0.3);
              color: white;
              border-radius: 50%;
              width: 45px;
              height: 45px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
              }

              &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }

              &.active {
                background: #46d369;
                border-color: #46d369;
                color: white;
              }

              svg {
                font-size: 1.1rem;
              }
            }
          }

          .loading-indicator {
            text-align: center;
            color: #46d369;
            font-size: 0.9rem;
            padding: 0.5rem;
            background: rgba(70, 211, 105, 0.1);
            border-radius: 4px;
            border: 1px solid rgba(70, 211, 105, 0.3);
          }

          .login-warning {
            text-align: center;
            color: #ff6b6b;
            font-size: 0.9rem;
            padding: 0.5rem;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 4px;
            border: 1px solid rgba(255, 107, 107, 0.3);
          }
        }      .close-widget {
        position: absolute;
        top: 0.5rem;
        right: 0.8rem;
        background: none;
        border: none;
        color: white;
        font-size: 1.8rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        
        &:hover {
          color: #ccc;
        }
      }
    }
  }
`;
