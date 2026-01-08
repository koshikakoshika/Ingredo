import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './Input.css'

export default function Input({
    label,
    error,
    id,
    type = 'text',
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <div className="relative">
                <input
                    id={inputId}
                    type={inputType}
                    className={`input-field ${error ? 'input-error' : ''} ${isPassword ? 'pr-10' : ''}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer p-0 hover:text-gray-700"
                        style={{ outline: 'none' }}
                        tabIndex="-1"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    )
}
