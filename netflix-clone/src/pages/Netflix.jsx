import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/home.jpg';
import MovieLogo from '../assets/homeTitle.webp';
import audioFile from '../assets/Stranger.mp3';
import {FaPlay} from 'react-icons/fa';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGenres, fetchMovies, getUsersLikedMovies } from '../store';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../firebase-config';
import Slider from '../components/Slider';
import Footer from '../components/Footer';
export default function Netflix () {
  const[isScrolled, setIsScrolled]=useState(false);
  const [email, setEmail] = useState(undefined);
  const dispatch = useDispatch();
  const genresLoaded = useSelector(state => state.netflix.genresLoaded);
  const genres = useSelector(state => state.netflix.genres);
  const movies = useSelector(state => state.netflix.movies);
  const [showVideo, setShowVideo] = useState(false); // Start with image first
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true); // Separate audio mute state
  const [videoEnded, setVideoEnded] = useState(false); // Track if video has ended
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const videoSrc = '/Stranger.mp4'; // Video from public folder
  const audioSrc = audioFile; // Audio file from assets

  // Handle authentication and load user data
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
        // Load user's liked movies when they log in
        dispatch(getUsersLikedMovies(currentUser.email));
      } else {
        navigate("/login");
      }
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    console.log('Dispatching getGenres...');
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    console.log('genresLoaded:', genresLoaded, 'genres:', genres);
    if (genresLoaded) {
      console.log('Dispatching fetchMovies...');
      dispatch(fetchMovies({ type: 'movie' })); // Changed from 'all' to 'movie'
    }
  }, [dispatch, genresLoaded]);
  
  // Add debugging for movies
  useEffect(() => {
    console.log('Movies updated:', movies);
    console.log('Movies length:', movies ? movies.length : 'movies is null/undefined');
  }, [movies]);
  //console.log(movies);
  
  // Handle user interaction (only for enabling video playback, not audio)
  const handleUserInteraction = () => {
    console.log('User interaction detected, current state:', userInteracted);
    if (!userInteracted) {
      setUserInteracted(true);
      console.log('User interaction enabled for video playback');
    }
  };
  
  // Function to sync audio with video
  const syncAudioWithVideo = () => {
    if (videoRef.current && audioRef.current && !audioRef.current.muted) {
      const videoTime = videoRef.current.currentTime;
      const audioTime = audioRef.current.currentTime;
      const timeDiff = Math.abs(videoTime - audioTime);
      
      // If they're out of sync by more than 0.05 seconds, sync them
      if (timeDiff > 0.05) {
        audioRef.current.currentTime = videoTime;
        console.log('Audio synced with video at time:', videoTime, 'Time diff was:', timeDiff);
      }
    }
  };
  
  // Toggle audio mute (only way to enable audio)
  const toggleAudioMute = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (audioRef.current && videoRef.current) {
      const newMutedState = !audioMuted;
      audioRef.current.muted = newMutedState;
      setAudioMuted(newMutedState);
      
      // Enable user interaction when they click the audio button
      if (!userInteracted) {
        setUserInteracted(true);
        console.log('User interaction enabled via audio button');
      }
      
      // If we're unmuting, sync the audio with the current video position
      if (!newMutedState && showVideo) {
        // Immediately sync audio to current video position
        audioRef.current.currentTime = videoRef.current.currentTime;
        
        // If audio is paused, play it
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => {
            console.log('Audio resumed and synced with video at time:', videoRef.current.currentTime);
          }).catch(e => {
            console.error('Error playing audio:', e);
          });
        }
        
        // Additional sync check after a short delay
        setTimeout(() => {
          syncAudioWithVideo();
        }, 100);
      }
      
      console.log('Audio muted:', newMutedState, 'Video time:', videoRef.current.currentTime);    }
  };

  // Handle video end - show image for 5 seconds then restart
  const handleVideoEnd = () => {
    console.log('Video ended, showing background image for 5 seconds');
    setVideoEnded(true);
    setShowVideo(false); // Hide video, show image
    
    // Pause both video and audio
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
    
    // After 5 seconds, restart the video
    setTimeout(() => {
      console.log('5 seconds passed, restarting video');
      setVideoEnded(false);
      setShowVideo(true);
    }, 5000);
  };

  useEffect(() => {
    console.log('Netflix component mounted');
    console.log('Background image path:', backgroundImage);
    console.log('Video path:', videoSrc);
    
    // Check if this is a page refresh and redirect to reset state
    const isRefresh = performance.navigation.type === 1 || 
                      performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    if (isRefresh) {
      console.log('Page refresh detected, redirecting to reset state...');
      // Small delay to ensure smooth transition
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      return;
    }
    
    // Start video after 5 seconds automatically when component mounts
    const timer = setTimeout(() => {
      console.log('5 seconds passed, transitioning to video');
      setShowVideo(true);
    }, 5000); // 5 seconds for proper Netflix experience
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Separate useEffect to handle video play when showVideo changes
  useEffect(() => {
    if (showVideo && videoRef.current && audioRef.current) {
      console.log('Video should now be visible, attempting to play...');
      
      // Small delay to ensure the fade-in transition has started
      setTimeout(() => {
        if (videoRef.current && audioRef.current) {
          console.log('Video and audio elements found, current state:', {
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
          audioRef.current.muted = !userInteracted; // Only unmute audio if user interacted
          
          // Play both simultaneously
          Promise.all([
            videoRef.current.play(),
            audioRef.current.play()
          ]).then(() => {
            console.log('Video and audio started playing in sync');
            
            // Set up periodic sync checking
            const syncInterval = setInterval(() => {
              if (videoRef.current && audioRef.current && !videoRef.current.paused && !audioRef.current.paused) {
                syncAudioWithVideo();
              } else {
                clearInterval(syncInterval);
              }
            }, 1000); // Check sync every second
            
          }).catch(e => {
            console.error('Error playing video/audio:', e);
            // If simultaneous play fails, try video only
            videoRef.current.play().catch(err => {
              console.error('Video play also failed:', err);
            });
          });
        }
      }, 100);
    }
  }, [showVideo, userInteracted]);
  
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return()=> (window.onscroll = null); 
  }
  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="hero">
        <div className="background-wrapper">
          <img 
            src={backgroundImage} 
            alt="backgroundImage" 
            className={`background-image ${showVideo ? 'fade-out' : ''}`}
            onError={(e) => {
              console.error('Image error:', e);
              console.error('Image src:', backgroundImage);
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
              console.log('Image src:', backgroundImage);
            }}
          />
          <video 
            ref={videoRef}
            src={videoSrc} 
            loop={false} // Remove loop since we're handling it manually
            playsInline
            preload="auto"
            muted={true}
            className={`background-video ${showVideo ? 'fade-in' : ''}`}
            onError={(e) => {
              console.error('Video error:', e);
              console.error('Video src:', videoSrc);
              console.error('Video element:', e.target);
              console.error('Video error code:', e.target.error?.code);
              console.error('Video error message:', e.target.error?.message);
            }}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can play')}
            onLoadedData={() => console.log('Video loaded data')}
            onLoadedMetadata={() => console.log('Video loaded metadata')}
            onPlay={() => console.log('Video started playing')}
            onPause={() => console.log('Video paused')}
            onEnded={handleVideoEnd} // Handle video end
            onTimeUpdate={() => {
              // Periodically sync audio with video
              if (audioRef.current && showVideo && !videoRef.current.paused) {
                syncAudioWithVideo();
              }
            }}
            onAbort={() => console.log('Video loading aborted')}
            onStalled={() => console.log('Video loading stalled')}
            onSuspend={() => console.log('Video loading suspended')}
            onWaiting={() => console.log('Video waiting')}
            onVolumeChange={() => console.log('Video volume changed, muted:', videoRef.current?.muted)}
          />
          
          {/* Separate audio element for synchronized sound */}
          <audio 
            ref={audioRef}
            src={audioSrc}
            loop={false} // Remove loop since we're handling it manually
            preload="auto"
            muted={audioMuted}
            onError={(e) => {
              console.error('Audio error:', e);
              console.error('Audio src:', audioSrc);
            }}
            onLoadStart={() => console.log('Audio loading started')}
            onCanPlay={() => console.log('Audio can play')}
            onLoadedData={() => console.log('Audio loaded data')}
            onPlay={() => console.log('Audio started playing')}
            onPause={() => console.log('Audio paused')}
          />
          
          {/* Audio indicator - click to enable/disable sound */}
          {showVideo && (
            <div className="audio-indicator" onClick={toggleAudioMute} title={audioMuted ? "Click to enable sound" : "Click to mute sound"}>
              {audioMuted ? '🔇' : '🔊'}
            </div>
          )}
        </div>
        <div className="container">
          <div className="logo">
            <img src={MovieLogo} alt="MovieLogo"/>
          </div>
          <div className="buttons flex">
            <button className="flex j-center a-center" onClick={()=>navigate('/player')}><FaPlay/> Play</button>
            <button className="flex j-center a-center"><AiOutlineInfoCircle/> More Info</button>

          </div>
        </div>
      </div>
      <Slider movies={movies} />
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  background-color: black;
  min-height: 100vh;

  .hero {
    position: relative;
    width: 100vw;
    height: 100vh; /* Restored to full height for desktop */
    overflow: hidden;
    
    .background-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .audio-indicator {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      z-index: 3;
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
      animation: pulse 2s infinite;
      
      &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
        border-color: rgba(255, 255, 255, 0.6);
        animation: none;
      }
    }
    
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
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
    
    .container {
      position: absolute;
      bottom: 5rem; /* Increased from 1rem for better desktop positioning */
      z-index: 10;
      
      .logo {
        img {
          width: 80%; /* Increased from 60% */
          height: auto;
          margin-left: 4rem; /* Increased from 3rem */
          max-width: 450px; /* Increased from 350px */
        }
      }
      
      .buttons {
        display: flex;
        margin: 4rem; /* Increased from 3rem */
        gap: 2rem; /* Increased from 1.5rem */
        
        button {
          font-size: 1.4rem; /* Increased from 1.1rem */
          gap: 1rem; /* Increased from 0.8rem */
          border-radius: 0.2rem;
          padding: 0.6rem; /* Increased from 0.4rem */
          padding-left: 2rem; /* Increased from 1.5rem */
          padding-right: 2.5rem; /* Increased from 1.8rem */
          border: none;
          cursor: pointer;
          transition: 0.3s ease-in-out;
          
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
    .hero {
      height: 45vh; /* Further reduced for tablets */
      
      .audio-indicator {
        bottom: 1rem;
        right: 1rem;
        width: 2rem;
        height: 2rem;
        font-size: 0.8rem;
      }
      
      .container {
        bottom: 2rem; /* Moved higher up */
        left: 0.8rem;
        right: 0.8rem;
        
        .logo {
          img {
            width: 35%; /* Much smaller for mobile */
            margin-left: 0.5rem;
            max-width: 180px;
          }
        }
        
        .buttons {
          margin: 0.8rem 0.5rem;
          gap: 0.5rem;
          flex-direction: row; /* Keep in one line */
          
          button {
            font-size: 0.75rem; /* Smaller font size */
            gap: 0.3rem;
            padding: 0.4rem 0.6rem; /* Compact padding */
            width: auto; /* Remove full width */
            min-width: 80px; /* Minimum width */
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
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
        bottom: 1.5rem; /* Moved much higher up */
        left: 0.4rem;
        right: 0.4rem;
        
        .logo {
          img {
            width: 30%; /* Much smaller */
            margin-left: 0.2rem;
            max-width: 140px;
          }
        }
        
        .buttons {
          margin: 0.5rem 0.2rem;
          gap: 0.4rem;
          flex-direction: row; /* Keep in one line */
          
          button {
            font-size: 0.65rem; /* Very small font size */
            gap: 0.2rem;
            padding: 0.3rem 0.5rem; /* Very compact padding */
            width: auto; /* Remove full width */
            min-width: 70px; /* Smaller minimum width */
          }
        }
      }
    }
  }

  /* iPhone SE and extra small screens */
  @media (max-width: 375px) {
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
        bottom: 1.2rem; /* Moved highest up */
        left: 0.2rem;
        right: 0.2rem;
        
        .logo {
          img {
            width: 25%; /* Smallest for iPhone SE */
            margin-left: 0.1rem;
            max-width: 120px;
          }
        }
        
        .buttons {
          margin: 0.3rem 0.1rem;
          gap: 0.3rem;
          flex-direction: row; /* Keep in one line */
          
          button {
            font-size: 0.6rem; /* Smallest font size */
            gap: 0.15rem;
            padding: 0.25rem 0.4rem; /* Smallest padding */
            width: auto; /* Remove full width */
            min-width: 60px; /* Smallest minimum width */
          }
        }
      }
    }
  }
`;

