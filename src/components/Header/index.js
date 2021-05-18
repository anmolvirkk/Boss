import React, { Component } from 'react'
import './header.css'

export default class Header extends Component {
    render() {
        return (
            <header>
                <img src = 'logo.png' alt="boss" />
                <ul className="headerNav">
                    <li className='selected'>Catalog</li>
                    <li>Collections</li>
                    <li>About Us</li>
                    <li>Contact</li>
                </ul>
                <div className = "bag">
                    <p>Bag</p>
                </div>
            </header>
        )
    }
}
