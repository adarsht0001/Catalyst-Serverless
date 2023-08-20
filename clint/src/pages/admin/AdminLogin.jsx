import React, { useState } from 'react';
import './admin.css';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
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
        axios.post('/admin-login', form).then((res) => {
            console.log(res);
            navigate('/app/admin-dashboard')
        }).catch((err) => {
            setError(err.response.data)
        })
    };

    return (
        <div className="login-form">
            <form>
                <h1>Admin Login</h1>
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
    );
}

export default AdminLogin;
