import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Backgroundimage from '../components/Backgroundimage';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import { firebaseAuth } from '../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
const Login = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({email:"", password:""});
    
    const handleLogIn = async () => {
        try{
            const {email, password} = formValues;
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            navigate("/"); // Navigate to home only after successful login
        }
        catch(err){
            console.log(err);
            alert('Error logging in: ' + err.message);
        }
    }
return (
    <Container>
        <Backgroundimage/>
        <div className="content">
            <Header />
            <div className="form-container flex column a-center j-center">
                <div className="form flex column a-center j-center">
                    <div className="title">
                        <h3>Login</h3>
                    </div>
                    <div className="container flex column">
                         <input type="email" placeholder="Email Address" name="email" value={formValues.email} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value})}/>
                    
                    <input type="password" placeholder="Password" name="password" value={formValues.password} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value})}/>
                    
                 
                         <button onClick={handleLogIn}>Login</button>
                
                    
                    </div>
                </div>
            </div>
        </div>


    </Container>
  );
};
const Container = styled.div`
position: relative;
.content {
  position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;
    
    .form-container{
        gap:2rem;
        height: 85vh;
        padding: 0 1rem;
        
        .form{
            padding: 2rem;
            background-color: #000000b0;
            width: 25vw;
            min-width: 300px;
            max-width: 450px;
            gap: 2rem;
            color: white;
            border-radius: 0.5rem;
            
            .title {
                text-align: center;
                h3 {
                    font-size: 2rem;
                    margin: 0;
                }
            }
            
            .container{
             gap:2rem;
                input{
                    padding: 0.5rem 1rem;
                    width: 100%;
                    max-width: 15rem;
                    min-width: 250px;
                    border: 1px solid #333;
                    border-radius: 0.25rem;
                    background-color: #333;
                    color: white;
                    font-size: 1rem;
                    
                    &::placeholder {
                        color: #8c8c8c;
                    }
                    
                    &:focus {
                        outline: none;
                        border-color: #e50914;
                        background-color: #454545;
                    }
                }
                button{
                    padding: 0.5rem 1rem;
                    background-color: #e50914;
                    border: none;
                    cursor: pointer;
                    color: white;
                    font-weight: bolder;
                    font-size: 1.05rem;
                    border-radius: 0.25rem;
                    width: 100%;
                    min-height: 50px;
                    transition: background-color 0.3s ease;
                    
                    &:hover {
                        background-color: #f40612;
                    }
                    
                    &:active {
                        background-color: #d40611;
                    }
                }
            }
        }
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .content {
        grid-template-rows: 10vh 90vh;
        
        .form-container {
            padding: 0 1rem;
            gap: 1rem;
            
            .form {
                width: 90vw;
                max-width: 400px;
                padding: 1.5rem;
                gap: 1.5rem;
                
                .title h3 {
                    font-size: 1.8rem;
                }
                
                .container {
                    gap: 1.5rem;
                    
                    input {
                        padding: 0.75rem 1rem;
                        font-size: 1rem;
                        min-width: auto;
                        width: 100%;
                    }
                    
                    button {
                        padding: 0.75rem 1rem;
                        font-size: 1.1rem;
                        min-height: 55px;
                    }
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .content {
        .form-container {
            .form {
                width: 95vw;
                padding: 0.8rem;
                gap: 0.8rem;
                
                .title h3 {
                    font-size: 1.3rem;
                }
                
                .container {
                    gap: 0.8rem;
                    
                    input {
                        padding: 0.5rem 0.7rem;
                        font-size: 0.85rem;
                        min-height: 45px;
                    }
                    
                    button {
                        padding: 0.5rem 0.8rem;
                        font-size: 0.9rem;
                        min-height: 45px;
                    }
                }
            }
        }
    }
}

/* iPhone SE and extra small screens */
@media (max-width: 375px) {
    .content {
        .form-container {
            padding: 1rem 0.5rem;
            
            .form {
                width: 98vw;
                padding: 0.6rem;
                gap: 0.6rem;
                
                .title h3 {
                    font-size: 1.1rem;
                }
                
                .container {
                    gap: 0.6rem;
                    
                    input {
                        padding: 0.4rem 0.6rem;
                        font-size: 0.8rem;
                        min-height: 40px;
                    }
                    
                    button {
                        padding: 0.4rem 0.6rem;
                        font-size: 0.85rem;
                        min-height: 40px;
                    }
                }
            }
        }
    }
}
`;

export default Login;
