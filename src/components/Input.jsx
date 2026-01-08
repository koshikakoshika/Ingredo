import React from 'react'
import './Input.css'

export default function Input({
    label,
    error,
    id,
    type = 'text',
    className = '',
    ...props
}) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <input
                id={inputId}
                type={type}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    )
}
