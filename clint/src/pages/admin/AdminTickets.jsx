import React, { useEffect, useState } from 'react'
import axios from '../../axios';
import AdminNav from './AdminNav';

function AdminTicket() {
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState("");
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        axios.get('/tickets').then((res) => {
            console.log(res.data);
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
        axios.post('/create-ticket', form).then((res) => {
            alert(res?.data?.msg)
            setRefresh(!refresh)
            setModal(false)
        }).catch((err) => {
            setError(err.response.data)
        })
    };

    const handleDelete = (rowId) => {
        axios.delete(`/ticket/${rowId}`).then((res) => {
            alert('user Deleted')
            setRefresh(!refresh)
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div className='center'>
            <AdminNav />
            <button type="button" style={{ margin: '5px' }} onClick={() => setModal(true)}>Add Ticket</button>
            <table>
                <thead>
                    <tr>
                        <th>Ticket Name</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {tickets.map((e) => {
                    return (
                        <tr key={e.Tickets?.ROWID}>
                            <td>{e.Tickets.name}</td>
                            <td>
                                <button type="button" style={{ margin: '5px' }} onClick={() => handleDelete(e?.Tickets?.ROWID)}>Delete</button>
                            </td>
                        </tr>
                    )
                })}
            </table>
            {modal && <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        setError(false)
                        setModal(false)
                    }}>&times;</span>
                    <div className="login-form">
                        <form>
                            <h1>Add Ticket</h1>
                            <div className="content">
                                {error}
                                <div className="input-field">
                                    <input
                                        type="text"
                                        name="ticket"
                                        onChange={handleChange}
                                        placeholder="Ticket Name"
                                        autoComplete="nope"
                                    />
                                </div>
                            </div>
                            <div className="action">
                                <button onClick={handleSubmit}>Create Ticket</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
        </div>

    )
}

export default AdminTicket