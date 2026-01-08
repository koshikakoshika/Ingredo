import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const ALLERGY_OPTIONS = ['Milk', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 'Fish', 'Shellfish']
const SENSITIVITY_OPTIONS = ['MSG', 'Artificial Colors', 'Artificial Flavors', 'Fragrance', 'Parabens']

export default function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState({
        allergies: [],
        sensitivities: [],
        custom: ''
    })
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const currentUser = authService.getUser()
        if (!currentUser) {
            navigate('/login')
            return
        }
        setUser(currentUser)
        if (currentUser.profile) {
            setProfile({ ...currentUser.profile, custom: currentUser.profile.custom || '' })
        }
    }, [navigate])

    const toggleOption = (list, item) => {
        if (list.includes(item)) {
            return list.filter(i => i !== item)
        }
        return [...list, item]
    }

    const handleProfileChange = (key, item) => {
        setProfile(prev => ({
            ...prev,
            [key]: toggleOption(prev[key], item)
        }))
    }

    const handleSave = () => {
        const updatedUser = authService.updateProfile(profile)
        setUser(updatedUser)
        setIsEditing(false)
        navigate('/') // Go to dashboard after onboarding
    }

    const handleLogout = () => {
        authService.logout()
    }

    if (!user) return <div className="p-4 text-center">Loading profile...</div>

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-lg font-bold">Your Profile</h1>
                    <p className="text-sm text-secondary">{user.email}</p>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">Log Out</Button>
            </div>

            <Card title="Health & Safety Settings" className="animate-fade-in">
                <div className="mb-6">
                    <label className="input-label mb-2 block">Allergies</label>
                    <div className="flex flex-wrap gap-2">
                        {ALLERGY_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleProfileChange('allergies', opt)}
                                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${profile.allergies.includes(opt)
                                    ? 'bg-red-50 border-red-200 text-red-600'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                style={{
                                    backgroundColor: profile.allergies.includes(opt) ? 'var(--color-unsafe-bg)' : 'white',
                                    borderColor: profile.allergies.includes(opt) ? 'var(--color-unsafe)' : 'var(--color-border)',
                                    color: profile.allergies.includes(opt) ? 'var(--color-unsafe)' : 'var(--color-text-secondary)'
                                }}
                            >
                                {profile.allergies.includes(opt) && '⚠ '}
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="input-label mb-2 block">Sensitivities</label>
                    <div className="flex flex-wrap gap-2">
                        {SENSITIVITY_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleProfileChange('sensitivities', opt)}
                                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${profile.sensitivities.includes(opt)
                                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                style={{
                                    backgroundColor: profile.sensitivities.includes(opt) ? 'var(--color-moderate-bg)' : 'white',
                                    borderColor: profile.sensitivities.includes(opt) ? 'var(--color-moderate)' : 'var(--color-border)',
                                    color: profile.sensitivities.includes(opt) ? 'var(--color-moderate)' : 'var(--color-text-secondary)'
                                }}
                            >
                                {profile.sensitivities.includes(opt) && '! '}
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <Input
                    label="Other Restrictions (e.g. Pregnancy, Diabetes)"
                    placeholder="Type here..."
                    value={profile.custom || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, custom: e.target.value }))}
                />

                <div className="mt-6">
                    <Button fullWidth onClick={handleSave}>
                        Save & Continue
                    </Button>
                </div>
            </Card>
        </div>
    )
}
