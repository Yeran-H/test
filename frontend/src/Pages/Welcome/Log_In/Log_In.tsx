import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavBar } from '../../../Components/WelcomeNavbar';
import { Footer } from '../../../Components/Footer';
import { useNavigate } from 'react-router-dom';
import styles from './Log_In.module.css';

export function Log_In() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    function Authenticate() {
        axios.post("http://localhost:5000/login", {
            username,
            password,
        }).then(response => {
            alert(response.data.message);
            localStorage.setItem("username", username);
            localStorage.setItem("subject", response.data.subject);
            setSuccess(response.data.success);
        });
    }

    useEffect(() => {
        if (success) {
            navigate('/User_Page');
        }
    }, [success, navigate]);  // Add dependencies for good practice

    return (
        <>
            <NavBar />
            <div className={styles.formContainer}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className={styles.textInput}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.textInput}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.btnLogin} onClick={Authenticate}>Login</button>
            </div>
            <Footer />
        </>
    );
}
