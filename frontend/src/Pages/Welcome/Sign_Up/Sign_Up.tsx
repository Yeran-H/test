import { useState, useEffect } from 'react'
import { NavBar } from '../../../Components/WelcomeNavbar'
import { Footer } from '../../../Components/Footer'
import axios from 'axios'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import styles from './Sign_Up.module.css'

export function Sign_Up() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [subject, setSubject] = useState("std2")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate();

    function AddDetails() {
        axios.post("http://localhost:5000/signup", {
            username,
            password,
            subject,
        }).then((response) => {
            setUsernameError(response.data.usernameError);
            setPasswordError(response.data.passwordError);
            setSuccess(response.data.success);
        })
    }

    useEffect(() => {
        if (success) {
            localStorage.setItem("username", username);
            localStorage.setItem("subject", subject);
            alert("Sign Up Successful!");
            navigate('/User_Page');
        }
    }, [success, username, subject, navigate]);

    return (
        <>
            <NavBar />
            <div className={styles.formContainer}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className={styles.textInput}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p className={styles.errorText}>{usernameError}</p>
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.textInput}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className={styles.errorText}>{passwordError}</p>
                <Form.Select
                    className='form-select d-block mx-auto'
                    style={{ width: '200px', marginTop: '15px' }}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="std2">Math Standard 2</option>
                    <option value="adv">Math Advanced</option>
                    <option value="ext1">Math Extension 1</option>
                    <option value="ext2">Math Extension 2</option>
                </Form.Select>
                <button className={styles.btnSignup} onClick={AddDetails}>Sign Up</button>
            </div>
            <Footer />
        </>
    )
}
