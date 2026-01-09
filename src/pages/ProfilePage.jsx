import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

const ALLERGY_OPTIONS = ['Milk', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 'Fish', 'Shellfish']
const SENSITIVITY_OPTIONS = ['MSG', 'Artificial Colors', 'Artificial Flavors', 'Fragrance', 'Parabens']
const AGE_OPTIONS = ['Under 12', '12–17', '18–30', '31–50', '51+']
const GENDER_OPTIONS = ['Female', 'Male', 'not prefer to say']

export default function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => authService.getUser())
    const [profile, setProfile] = useState(() => {
        const currentUser = authService.getUser()
        if (currentUser?.profile) {
            return {
                ...currentUser.profile,
                custom: currentUser.profile.custom || '',
                ageGroup: currentUser.profile.ageGroup || '',
                gender: currentUser.profile.gender || ''
            }
        }
        return {
            allergies: [],
            sensitivities: [],
            custom: '',
            ageGroup: '',
            gender: ''
        }
    })

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

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

    const handleSingleChange = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        const updatedUser = authService.updateProfile(profile)
        setUser(updatedUser)
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

            <Card title="Basic Details" className="animate-fade-in mb-6">
                <div className="mb-4">
                    <label className="input-label mb-4 block text-gray-700 font-semibold">Age Group</label>
                    <div className="flex flex-wrap gap-3">
                        {AGE_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleSingleChange('ageGroup', opt)}
                                className={`chip chip-blue ${profile.ageGroup === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="input-label mb-4 block text-gray-700 font-semibold">Gender</label>
                    <div className="flex flex-wrap gap-3">
                        {GENDER_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleSingleChange('gender', opt)}
                                className={`chip chip-blue ${profile.gender === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Health & Safety Settings" className="animate-fade-in">
                <div className="mb-4">
                    <label className="input-label mb-4 block text-gray-700 font-semibold">Food Allergies</label>
                    <div className="flex flex-wrap gap-3">
                        {ALLERGY_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleProfileChange('allergies', opt)}
                                className={`chip chip-red ${profile.allergies.includes(opt) ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="input-label mb-4 block text-gray-700 font-semibold">Sensitivities</label>
                    <div className="flex flex-wrap gap-3">
                        {SENSITIVITY_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleProfileChange('sensitivities', opt)}
                                className={`chip chip-amber ${profile.sensitivities.includes(opt) ? 'active' : ''}`}
                            >
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

                <div className="mt-8">
                    <Button fullWidth onClick={handleSave}>
                        Save & Continue
                    </Button>
                </div>
            </Card>
        </div>
    )
}
