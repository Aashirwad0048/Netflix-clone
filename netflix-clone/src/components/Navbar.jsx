import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png"; 
import { FaSearch, FaPowerOff } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
export default function Navbar({isScrolled}) {
        const navigate = useNavigate();
        const links=[
            {name:"Home", link:"/"},
            {name:"TV Shows", link:"/tv"},
            {name:"Movies", link:"/movies"},
            {name:"My List", link:"/mylist"}

        ];
        const [showSearch, setShowSearch] = useState(false);
        const [inputHover, setInputHover] = useState(false);
        const [showMobileMenu, setShowMobileMenu] = useState(false);
        const mobileMenuRef = useRef(null);
        
        // Close mobile menu when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                    setShowMobileMenu(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);
        
        const handleSignOut = async () => {
            try {
                await signOut(firebaseAuth);
                navigate("/login");
            } catch (error) {
                console.error("Error signing out:", error);
            }
        };


    return (
        <Container>
            <nav className={`flex ${isScrolled ? "scrolled": ""}`}>
                <div className="left flex a-center">
                    <div className="brand flex a-center j-center">
                        <img src={logo} alt="logo"/>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <ul className="links flex desktop-only">
                        {
                            links.map(({name,link})=>{
                                return (
                                    <li key={name}>
                                        <span onClick={() => navigate(link)} style={{cursor: 'pointer'}}>{name}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    
                    {/* Mobile Browse Button */}
                    <div className="mobile-browse mobile-only" ref={mobileMenuRef}>
                        <button 
                            className="browse-btn"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            Browse
                        </button>
                        
                        {/* Mobile Dropdown Menu */}
                        {showMobileMenu && (
                            <div className="mobile-dropdown">
                                {links.map(({name, link}) => (
                                    <div 
                                        key={name}
                                        className="mobile-menu-item"
                                        onClick={() => {
                                            navigate(link);
                                            setShowMobileMenu(false);
                                        }}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="right flex a-center">
                    <div className={`search ${showSearch ? "show-search":""}`}>
                        <button onFocus={()=> setShowSearch(true)} onBlur={()=> {
                            if(!inputHover) setShowSearch(false);
                        }}>
                            <FaSearch/>
                        </button>
                        <input type="text" placeholder="Search" onMouseEnter={()=>setInputHover(true)} onMouseLeave={()=>setInputHover(false)}
                        onBlur={()=>{
                            setShowSearch(false);
                            setShowSearch(false);
                        }}/>
                    </div>
                    <button className="signout-btn" onClick={handleSignOut}>
                        <FaPowerOff />
                    </button>
                </div>
            </nav>
        </Container>
    )
}

const Container = styled.div`
.scrolled{
    background-color: black;
}
nav{
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    z-index: 1000;
    padding: 0 4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    
    .left{
        gap: 2rem;
        
        .brand{
            img{
                height: 4rem;
            }
        }
        
        .links{
            list-style-type: none;
            gap: 2rem;
            margin: 0;
            padding: 0;
            
            li{
                span{
                    color: white;
                    text-decoration: none;
                    font-size: 1rem;
                    transition: color 0.3s ease;
                    
                    &:hover {
                        color: #e50914;
                    }
                }
            }
        }
    }
    
    .right{
        gap: 1rem;
        
        .signout-btn {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: background-color 0.3s ease;
            
            &:focus{
                outline: none;
            }
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            svg{
                color: #f34242;
                font-size: 1.2rem;
            }
        }
        
        .search{
            display: flex;
            gap: 0.4rem;
            align-items: center;
            justify-content: center;
            padding: 0.2rem;
            padding-left: 0.5rem;
            border-radius: 0.25rem;
            
            button{
                background-color: transparent;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                
                &:focus{
                    outline: none;
                }
                
                svg{
                    color: white;
                    font-size: 1rem;
                }
            }
            
            input{
                width: 0;
                opacity: 0;
                visibility: hidden;
                transition: 0.3s ease-in-out;
                background-color: transparent;
                border: none; 
                color: white;
                
                &:focus{
                    outline: none;
                }
                
                &::placeholder {
                    color: #8c8c8c;
                }
            }
        }
        
        .show-search{
            border: 1px solid white;
            background-color: rgba(0,0,0,0.6);
            
            input{
                width: 100%;
                opacity: 1;
                visibility: visible;
                padding: 0.3rem;
                min-width: 200px;
            }
        }
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    nav {
        padding: 0 2rem;
        height: 5rem;
        
        .left {
            gap: 1rem;
            
            .brand {
                img {
                    height: 2.5rem;
                }
            }
            
            .links {
                gap: 1rem;
                
                li {
                    span {
                        font-size: 0.9rem;
                    }
                }
            }
        }
        
        .right {
            gap: 0.5rem;
            
            .search {
                .show-search {
                    input {
                        min-width: 150px;
                    }
                }
            }
        }
    }
}

@media (max-width: 480px) {
    /* Hide desktop navigation, show mobile browse */
    .desktop-only {
        display: none !important;
    }
    
    .mobile-only {
        display: block !important;
    }
    
    nav {
        padding: 0 0.4rem;
        height: 3.5rem;
        
        .left {
            gap: 0.25rem;
            
            .brand {
                img {
                    height: 1.6rem;
                }
            }
        }
        
        .right {
            gap: 0.15rem;
            
            .signout-btn {
                padding: 0.15rem;
                
                svg {
                    font-size: 0.8rem;
                }
            }
            
            .search {
                padding: 0.08rem;
                
                button {
                    padding: 0.15rem;
                    
                    svg {
                        font-size: 0.75rem;
                    }
                }
                
                .show-search {
                    input {
                        min-width: 90px;
                        padding: 0.15rem;
                        font-size: 0.75rem;
                    }
                }
            }
        }
    }
}

/* iPhone SE and extra small screens */
@media (max-width: 375px) {
    nav {
        padding: 0 0.3rem !important;
        height: 3rem !important;
        
        .left {
            gap: 0.2rem;
            
            .brand {
                img {
                    height: 1.4rem;
                }
            }
        }
        
        .right {
            gap: 0.1rem;
            
            .signout-btn {
                padding: 0.1rem;
                
                svg {
                    font-size: 0.7rem;
                }
            }
            
            .search {
                padding: 0.05rem;
                
                button {
                    padding: 0.1rem;
                    
                    svg {
                        font-size: 0.65rem;
                    }
                }
                
                .show-search {
                    input {
                        min-width: 80px;
                        padding: 0.1rem;
                        font-size: 0.7rem;
                    }
                }
            }
        }
    }
}

/* Show/Hide Elements Based on Screen Size */
.desktop-only {
    display: flex;
}

.mobile-only {
    display: none;
}

/* Mobile Browse Menu */
.mobile-browse {
    position: relative;
    
    .browse-btn {
        background-color: transparent;
        border: none;
        color: white;
        font-size: 0.9rem;
        cursor: pointer;
        padding: 0.4rem 0.8rem;
        border-radius: 0.25rem;
        transition: background-color 0.3s ease;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        &:focus {
            outline: none;
        }
    }
    
    .mobile-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: rgba(0, 0, 0, 0.95);
        border: 1px solid #333;
        border-radius: 0.25rem;
        min-width: 130px;
        z-index: 1001;
        margin-top: 0.4rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        
        .mobile-menu-item {
            padding: 0.6rem 0.8rem;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 0.8rem;
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: #e50914;
            }
            
            &:first-child {
                border-top-left-radius: 0.25rem;
                border-top-right-radius: 0.25rem;
            }
            
            &:last-child {
                border-bottom-left-radius: 0.25rem;
                border-bottom-right-radius: 0.25rem;
            }
        }
    }
    
    /* Extra small screens */
    @media (max-width: 375px) {
        .browse-btn {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
        }
        
        .mobile-dropdown {
            min-width: 110px;
            margin-top: 0.3rem;
            
            .mobile-menu-item {
                padding: 0.5rem 0.6rem;
                font-size: 0.75rem;
            }
        }
    }
}
`;