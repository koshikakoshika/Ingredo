import React from 'react'
import './SafetyBadge.css'

export default function SafetyBadge({ status = 'safe', label, size = 'md', className = '' }) {
    // Status: safe, moderate, unsafe, unknown

    const getIcon = () => {
        switch (status) {
            case 'safe': return '✓'
            case 'moderate': return '!'
            case 'unsafe': return '⚠'
            default: return '?'
        }
    }

    const displayText = label || status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <span className={`safety-badge badge-${status} badge-${size} ${className}`}>
            <span className="badge-icon">{getIcon()}</span>
            {displayText}
        </span>
    )
}
