import React from 'react'
import './Home.css'
import logo from '../assets/mood.png'

function Homepage() {



  return (
    <>
        <div className="main">
            <nav className="navbar">
                <img src={logo} alt="Logo for the our webpage" className="logo" />
                <div className="pages">
                    <ul>
                        <li>History</li>
                        <li>Track</li>
                    </ul>
                </div>
                <div className="filter">
                    <select name="Mood" id="">
                        <option value="Elated">Elated</option>
                        <option value="Happy">Happy</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Bad">Bad</option>
                        <option value="Depressed">Depressed</option>
                    </select>
                </div>
            </nav>
        </div>
    </>
  )
}

export default Homepage;