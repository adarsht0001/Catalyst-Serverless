import React, { useEffect } from 'react'

function Home() {
    useEffect(() => {
        const userId = localStorage.getItem("userId")
        console.log(userId);
    }, [])
    return (
        <div>Home</div>
    )
}

export default Home