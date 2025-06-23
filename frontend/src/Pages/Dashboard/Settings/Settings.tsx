import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavBar } from '../../../Components/UserNavbar';
import { Footer } from '../../../Components/Footer';
import styles from './Settings.module.css';
import { useNavigate } from 'react-router-dom';

export function Settings() {
    const [username, setUsername] = useState("")
    const [subject, setSubject] = useState("")
    const [newusername, setNewusername] = useState("");
    const [newpassword, setNewpassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    function UpdateUsername() {
    axios.post("http://localhost:5000/updateusername", { username, newusername, subject }).then(response => {
        setUsernameError(response.data.usernameError);
        setSuccess(response.data.success);
        if (response.data.success) {
        localStorage.setItem("username", newusername); // update stored username only on success
        setUsername(newusername); // update current username state
        alert("Details Updated")
        setSuccess(false);
        }
    });
    }

    function UpdatePassword() {
    axios.post("http://localhost:5000/updatepassword", {
        username,
        newpassword,
        subject,
    }).then(response => {
        setPasswordError(response.data.passwordError);
        setSuccess(response.data.success);
        if (response.data.success) {
        alert("Details Updated")
        setSuccess(false);
        }
    });
    }

    function Delete() {
        axios.post("http://localhost:5000/delete", { username }).then(() => {
            alert("User Deleted");
            navigate("/");
        });
    }

        useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
        setSubject(localStorage.getItem("subject") || "");
    }, []); 

    useEffect(() => {
    if (success) {
        alert("Details updated");
    }
    }, [success]);

    return (
        <>
            <NavBar />
            <div className={styles['settings-container']}>
                <h1 className={styles.h1}>Account Settings</h1>

                <div className={styles['settings-card']}>
                    <h2>Change Username</h2>
                    <input
                      type="text"
                      placeholder="New Username"
                      className={styles['textInput']}
                      onChange={(e) => setNewusername(e.target.value)}
                    />
                    <p className={styles['error-text']}>{usernameError}</p>
                    <button className={styles['btn-login']} onClick={UpdateUsername}>
                      Update Username
                    </button>
                </div>

                <div className={styles['settings-card']}>
                    <h2>Change Password</h2>
                    <input
                      type="password"
                      placeholder="New Password"
                      className={styles['textInput']}
                      onChange={(e) => setNewpassword(e.target.value)}
                    />
                    <p className={styles['error-text']}>{passwordError}</p>
                    <button className={styles['btn-login']} onClick={UpdatePassword}>
                      Update Password
                    </button>
                </div>

                <div className={`${styles['settings-card']} ${styles['delete-card']}`}>
                    <h2>Danger Zone</h2>
                    <p className={styles['warning-text']}>This will permanently delete your account.</p>
                    <button className={styles['btn-delete']} onClick={Delete}>
                      Delete Account
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}
