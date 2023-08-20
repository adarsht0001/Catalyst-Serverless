/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useNavigate } from 'react-router-dom';

function AdminNav() {
    const navigate = useNavigate();

    return (
        <ul>
            <li><a onClick={() => navigate('/app/admin-dashboard')} style={{ margin: "4px" }}>Users</a></li>
            <li><a onClick={() => navigate('/app/admin-ticket')} style={{ margin: "4px" }}>Tickets</a></li>
        </ul>
    )
}

export default AdminNav