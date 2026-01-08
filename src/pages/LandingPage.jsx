import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { authService } from '../services/authService'

const CATEGORIES = [
    { id: 'food', name: 'Food Products', icon: '🍎', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'cosmetics', name: 'Cosmetics', icon: '💄', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { id: 'household', name: 'Household', icon: '🧼', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'baby', name: 'Baby Products', icon: '👶', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const user = authService.getUser()

    const handleCategorySelect = (categoryId) => {
        // Navigate to scan page with category state
        navigate('/scan', { state: { category: categoryId } })
    }

    return (
        <div className="pb-20 animate-fade-in">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        Ingredo
                    </h1>
                    <p className="text-xs text-secondary font-medium">
                        Know What’s Inside. Know What’s Safe.
                    </p>
                </div>
                {!user && (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                    >
                        Login
                    </button>
                )}
                {user && (
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200"
                    >
                        {user.email[0].toUpperCase()}
                    </button>
                )}
            </div>

            {/* Hero Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-2">Scan & Check</h2>
                <p className="opacity-90 mb-4 text-sm">
                    Instantly analyze ingredients for allergens, toxins, and banned substances.
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <span className="text-sm font-medium">Select a category to start</span>
                </div>
            </Card>

            {/* Categories Grid */}
            <h3 className="font-bold text-lg mb-4">What aren't you sure about?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm hover:shadow-md ${cat.color}`}
                        style={{ aspectRatio: '1/1' }}
                    >
                        <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                        <span className="font-semibold text-sm text-center">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Recent Scans Placeholder */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">Recent Scans</h3>
                    <span className="text-xs text-secondary">View all</span>
                </div>
                <div className="flex flex-col gap-3 opacity-60">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">🍪</div>
                        <div>
                            <p className="font-medium text-sm">Oat Cookies</p>
                            <p className="text-xs text-secondary">Safe • Yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
