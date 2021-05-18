import React from 'react'
import './productTile.css'

export default function ProductTile(props) {
    return (
        <div className="productTile">
            <img src = {props.img} alt={props.name} />
            <p>{props.category}</p>
            <h1>{props.name}</h1>
            <h2>{props.price}</h2>
        </div>
    )
}
