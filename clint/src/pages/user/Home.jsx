import React, { useEffect, useState } from 'react'
import axios from '../../axios';


function Home() {
    const [ticket, setTicket] = useState([])
    const [unusedTic, setunUsedTic] = useState([])
    const [password, setpassword] = useState("")
    const [avaliable, setavilable] = useState(false)
    const userId = localStorage.getItem("userId")

    useEffect(() => {
        axios.get(`/assigned-ticket/${userId}`).then((res) => {
            console.log(res);
            if (res.data.status) {
                setavilable(true)
                setTicket(res.data.ticket)
            } else {

                setTicket(res.data.msg)
            }
        })
        axios.get('/tickets').then((res) => {
            console.log(res.data);
            setunUsedTic(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    const resetPassword = () => {
        const data = {
            userId, password
        }
        axios.post('/reset-password', data).then((res) => {
            alert("password updated")
        }).catch((err) => {
            console.log(err);
        })
    }
    return (

        <div>Home
            {!avaliable && <div><h3>Ticked Assigned : {ticket}</h3></div>}
            {avaliable &&
                <div><h3>Ticked Assigned :
                    <ul>
                        <li>id : {ticket?.ROWID}</li>
                        <li>name : {ticket?.name}</li>
                    </ul>
                </h3>
                </div>
            }
            <h3>Change Password</h3>
            <input
                type="password"
                name="password"
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                required
            />
            <button type='submit' onClick={resetPassword}>Reset Password</button>
            <h2>Un used Tickets</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>name</th>
                    </tr>
                </thead>
                <tbody>

                    {unusedTic.map((ticket) => {
                        return (
                            <tr key={ticket.Tickets.ROWID}>
                                <td>{ticket.Tickets.ROWID}</td>
                                <td>{ticket.Tickets.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div >
    )
}

export default Home