import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
