import React from 'react'

export default function Card({ children, className = '', title, ...props }) {
    return (
        <div className={`card ${className}`} {...props}>
            {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
            {children}
        </div>
    )
}
