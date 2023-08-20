import React, { useEffect, useState } from 'react'
import axios from '../../axios';
import AdminNav from './AdminNav';

function AdminHome() {
    const [modal, setModal] = useState(false)
    const [ticketmodal, setTicketModal] = useState(false)
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState("");
    const [user, setUser] = useState([]);
    const [current, setCurrent] = useState("");
    const [currentTicket, setCurrentTicket] = useState("");
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        axios.get('/users').then((res) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err);
        })
        axios.get('/unused-ticket').then((res) => {
            setTickets(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [refresh])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/create-user', form).then((res) => {
            alert(res?.data?.msg)
            setRefresh(!refresh)
            setModal(false)
        }).catch((err) => {
            setError(err.response.data)
        })
    };

    const handleDelete = (rowId) => {
        axios.delete(`/user/${rowId}`).then((res) => {
            alert('user Deleted')
            setRefresh(!refresh)
        }).catch((err) => {
            console.log(err);
        })
    }

    const assignTicket = (e) => {
        e.preventDefault();
        const data = { ticketId: currentTicket, userId: current }
        axios.put('/add-ticket', data)
    }
    return (
        <div className='center'>
            <AdminNav />
            <button type="button" style={{ margin: '5px' }} onClick={() => setModal(true)}>Add User</button>
            <table>
                <thead>
                    <tr>
                        <th>email</th>
                        <th>Delete</th>
                        <th>Assign Ticket</th>
                    </tr>
                </thead>
                <tbody>

                    {user.map((e) => {
                        return (
                            <tr key={e.users?.ROWID}>
                                <td>{e.users.email}</td>
                                <td>
                                    <button type="button" style={{ margin: '5px' }} onClick={() => handleDelete(e?.users?.ROWID)}>Delete</button>
                                </td>
                                <td>
                                    <button type="button" style={{ margin: '5px' }} onClick={() => {
                                        setCurrent(e?.users?.ROWID)
                                        setTicketModal(!ticketmodal)
                                    }}>Select</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {modal && <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        setError(false)
                        setModal(false)
                    }}>&times;</span>
                    <div className="login-form">
                        <form>
                            <h1>Create User</h1>
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
                                <button onClick={handleSubmit}>Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
            {ticketmodal && <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        setError(false)
                        setTicketModal(false)
                    }}>&times;</span>
                    <div className="login-form">
                        <form>
                            <h1>Select Ticket</h1>
                            <div className="content">
                                {error}
                                <div className="input-field">
                                    <label htmlFor="ticket">Choose a Ticket:</label>
                                    <select
                                        id="tickets"
                                        onChange={(e) => {
                                            setCurrentTicket(e.target.value);
                                        }}
                                        name="tickets"
                                    >
                                        {tickets.map((ticket) => (
                                            <option value={ticket.Tickets.ROWID} key={ticket.Tickets.ROWID}>
                                                {ticket.Tickets.name}
                                            </option>
                                        ))}
                                    </select>


                                </div>
                            </div>
                            <div className="action">
                                <button onClick={assignTicket}>Select Ticket</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
        </div>

    )
}

export default AdminHome