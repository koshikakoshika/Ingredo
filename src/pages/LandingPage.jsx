import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Apple, Sparkles, Home, Baby, Camera, Cookie, ScanLine, User } from 'lucide-react'
import Card from '../components/Card'
import { authService } from '../services/authService'

const CATEGORIES = [
    { id: 'food', name: 'Food Products', icon: <Apple size={32} />, description: 'Allergens & nutrition' },
    { id: 'cosmetics', name: 'Cosmetics', icon: <Sparkles size={32} />, description: 'Toxins & irritants' },
    { id: 'household', name: 'Household', icon: <Home size={32} />, description: 'Chemical safety' },
    { id: 'baby', name: 'Baby Products', icon: <Baby size={32} />, description: 'Gentle & safe' },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const user = authService.getUser()
    const [selectedCategory, setSelectedCategory] = React.useState(null)

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId)
        // Add artificial delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 500))
        // Navigate to scan page with category state
        navigate('/scan', { state: { category: categoryId } })
    }

    return (
        <div className="pb-20 animate-fade-in max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 pt-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Ingredo
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Know What’s Inside. Know What’s Safe.
                    </p>
                </div>
                {!user && (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-emerald-700 bg-white px-5 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        Login
                    </button>
                )}
                {user && (
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm"
                    >
                        <User size={20} />
                    </button>
                )}
            </div>

            {/* Hero Card */}
            <Card className="bg-slate-900 text-white border-none shadow-xl mb-10 overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-3">Analyze Your Products</h2>
                    <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                        Use advanced AI to detect harmful ingredients, allergens, and banned substances instantly.
                    </p>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center gap-4 border border-white/10 w-fit">
                        <ScanLine className="text-emerald-400" size={24} />
                        <span className="text-sm font-medium">Select a category below to begin scanning</span>
                    </div>
                </div>
                {/* Abstract decorative circle */}
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
            </Card>

            {/* Categories Grid */}
            <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Select Category</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`chip border shadow-sm transition-all duration-200 ${selectedCategory === cat.id
                            ? 'bg-emerald-500 text-white border-emerald-500 scale-105'
                            : 'bg-white border-gray-200 hover:border-emerald-500 hover:text-emerald-700 active:bg-emerald-50'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Recent Scans Placeholder */}
            <div className="mt-12">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-xl text-gray-800">Recent Activity</h3>
                    <span className="text-sm text-emerald-600 font-medium cursor-pointer hover:underline">View History</span>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
                                <Cookie size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Oat Cookies</p>
                                <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">Safe Analysis</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">Yesterday</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
