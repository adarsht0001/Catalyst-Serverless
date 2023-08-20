import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';

function UserLogin() {
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/user-login', form).then((res) => {
            alert("login successful")
            localStorage.setItem("userId", res.data.id)
            navigate('/app/home')
        }).catch((err) => {
            setError(err.response.data)
        })
    };
    return (
        <div className="login-form">
            <form>
                <h1>user Login</h1>
                <div className="content">
                    {error}
                    <div className="input-field">
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Email"
                            autoComplete="nope"
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                    </div>
                </div>
                <div className="action">
                    <button onClick={handleSubmit}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default UserLogin