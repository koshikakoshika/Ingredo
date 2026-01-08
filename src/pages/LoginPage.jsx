import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

export default function LoginPage() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await authService.login(formData.email, formData.password)
            } else {
                if (!formData.name || !formData.email || !formData.password) {
                    throw new Error('Please fill in all fields')
                }
                await authService.signup(formData.name, formData.email, formData.password)
            }
            navigate('/profile')
        } catch (err) {
            setError(err.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
                <h1 className="text-lg font-bold">Ingredo</h1>
                <p className="text-secondary">
                    {isLogin ? 'Welcome back! Login to continue.' : 'Create an account to start scanning.'}
                </p>
            </div>

            <Card className="full-width animate-fade-in">
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    )}

                    <Input
                        label="Email Address"
                        placeholder="you@example.com"
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoFocus
                    />

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading} className="mb-4">
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-secondary">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            type="button"
                            className="text-primary font-bold bg-transparent border-none cursor-pointer p-0"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                                setFormData({ name: '', email: '', password: '' })
                            }}
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
