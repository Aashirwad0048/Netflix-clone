import React, { useState } from 'react';
import styled from "styled-components";
import Backgroundimage from '../components/Backgroundimage';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import { firebaseAuth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({email:"", password:""});
    const handleSignIn = async () => {
        try{
            const {email, password} = formValues;
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            navigate("/"); // Navigate to home only after successful signup
        }
        catch(err){
            console.log(err);
            alert('Error creating account: ' + err.message);
        }
    }
return (
    <Container showPassword={showPassword}>
        <Backgroundimage/>
        <div className="content">
            <Header login/>
            <div className="body flex column a-center j-center">
                <div className="text flex column">
                    <h1>Unlimited movies , TV shows and more</h1>
                    <h4> Watch anywhere. Cancel anytime.</h4>
                    <h6>Ready to watch? Enter your email to create or restart your membership</h6>
                </div>
                <div className="form">
                    <input type="email" placeholder="Email Address" name="email" value={formValues.email} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value})}/>
                    {
                        showPassword && (<input type="password" placeholder="Password" name="password" value={formValues.password} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value})}/>)
                    }
                    {
                        !showPassword && <button onClick={()=>setShowPassword(true)}>Get Started</button>
                    }
                    
                </div>
                <button onClick={handleSignIn}>Sign Up</button>
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
}
.body{
    gap: 1rem;
    padding: 0 2rem;
    
    .text{
        gap: 1rem;
        text-align: center;
        font-size: 2rem;
        color: white;
        
        h1{
            padding: 0 25rem;
            font-size: 3rem;
            font-weight: 900;
            margin: 0;
        }
        
        h4 {
            font-size: 1.5rem;
            font-weight: 400;
            margin: 0;
        }
        
        h6 {
            font-size: 1.2rem;
            font-weight: 400;
            margin: 0;
        }
    }
    
    .form{
        display: grid;
        grid-template-columns: ${({showPassword})=>showPassword ? "1fr 1fr": "2fr 1fr"};
        width: 60%;
        max-width: 600px;
        gap: 0.5rem;
        
        input{
            color: black;
            border: none;
            padding: 1.5rem;
            font-size: 1.2rem;
            border: 1px solid black;
            border-radius: 0.25rem;
            
            &:focus{
                outline: none;
                border-color: #e50914;
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
            transition: background-color 0.3s ease;
            
            &:hover {
                background-color: #f40612;
            }
        }
    }    
    
    button{
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
        min-height: 50px;
        width: 200px;
        margin: 0 auto;
        transition: background-color 0.3s ease;
        
        &:hover {
            background-color: #f40612;
        }
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .content {
        grid-template-rows: 10vh 90vh;
    }
    
    .body {
        gap: 1.5rem;
        padding: 0 1rem;
        
        .text {
            gap: 1rem;
            
            h1 {
                padding: 0 2rem;
                font-size: 2rem;
                line-height: 1.2;
            }
            
            h4 {
                font-size: 1.2rem;
                padding: 0 1rem;
            }
            
            h6 {
                font-size: 1rem;
                padding: 0 1rem;
            }
        }
        
        .form {
            width: 90%;
            grid-template-columns: ${({showPassword})=>showPassword ? "1fr" : "1fr"};
            grid-template-rows: ${({showPassword})=>showPassword ? "1fr 1fr 1fr" : "1fr 1fr"};
            gap: 1rem;
            
            input {
                padding: 1rem;
                font-size: 1rem;
            }
            
            button {
                padding: 1rem;
                font-size: 1rem;
            }
        }
        
        button {
            width: 90%;
            max-width: 300px;
            padding: 1rem;
            font-size: 1.1rem;
        }
    }
}

@media (max-width: 480px) {
    .body {
        gap: 0.8rem;
        padding: 0 0.4rem;
        
        .text {
            h1 {
                padding: 0 0.8rem;
                font-size: 1.6rem;
            }
            
            h4 {
                font-size: 1rem;
                padding: 0 0.4rem;
            }
            
            h6 {
                font-size: 0.85rem;
                padding: 0 0.4rem;
            }
        }
        
        .form {
            width: 96%;
            
            input {
                padding: 0.7rem;
                font-size: 0.85rem;
                min-height: 45px;
            }
            
            button {
                padding: 0.7rem;
                font-size: 0.85rem;
                min-height: 45px;
            }
        }
        
        button {
            width: 96%;
            padding: 0.7rem;
            font-size: 0.9rem;
            min-height: 45px;
        }
    }
}

/* iPhone SE and extra small screens */
@media (max-width: 375px) {
    .body {
        gap: 0.6rem;
        padding: 0 0.3rem;
        
        .text {
            h1 {
                padding: 0 0.5rem;
                font-size: 1.4rem;
            }
            
            h4 {
                font-size: 0.9rem;
                padding: 0 0.3rem;
            }
            
            h6 {
                font-size: 0.8rem;
                padding: 0 0.3rem;
            }
        }
        
        .form {
            width: 98%;
            
            input {
                padding: 0.6rem;
                font-size: 0.8rem;
                min-height: 40px;
            }
            
            button {
                padding: 0.6rem;
                font-size: 0.8rem;
                min-height: 40px;
            }
        }
        
        button {
            width: 98%;
            padding: 0.6rem;
            font-size: 0.85rem;
            min-height: 40px;
        }
    }
}
`;

export default Signup;
