import React from "react";
import styled from "styled-components";
import {BsArrowLeft} from "react-icons/bs";
import video from "../assets/Stranger.mp4";
export default function Player() {
    const navigate = useNavigate();
    return (
        <Container>
            <div className="player">
                
                <div className="back">
                    <BsArrowLeft onClick={()=> navigate(-1)}/>
                </div>
                <video src={video} autoPlay loop controls mute/>
            </div>
        </Container>
    );
}