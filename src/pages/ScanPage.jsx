import React, { useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { Camera, Image } from 'lucide-react'
import { authService } from '../services/authService'
import { analysisService } from '../services/analysisService'
import Button from '../components/Button'
import Card from '../components/Card'
import SafetyBadge from '../components/SafetyBadge'
import Modal from '../components/Modal'

export default function ScanPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const category = location.state?.category || 'food'
    const user = authService.getUser()
    const webcamRef = useRef(null)

    const [image, setImage] = useState(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedBan, setSelectedBan] = useState(null)
    const [showCamera, setShowCamera] = useState(false)

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImage(imageSrc)
        setImagePreview(imageSrc)
        setShowCamera(false)
    }, [webcamRef])

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
            setResult(null) // Reset previous results
        }
    }

    const handleAnalyze = async () => {
        if (!image) return
        setAnalyzing(true)
        try {
            const data = await analysisService.analyzeImage(image, category, user?.profile)
            setResult(data)
        } catch (error) {
            console.error(error)
            alert("Analysis failed. Please try again.")
        } finally {
            setAnalyzing(false)
        }
    }

    const handleRetake = () => {
        setImage(null)
        setImagePreview(null)
        setResult(null)
    }

    const categoryMap = {
        food: 'Food Products',
        cosmetics: 'Cosmetics',
        household: 'Household Products',
        baby: 'Baby Products'
    }

    const displayCategory = categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)

    return (
        <div className="pb-20 animate-fade-in h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 bg-white shadow-sm z-10 shrink-0">
                <button onClick={() => navigate('/')} className="mr-3 text-2xl bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100">
                    ←
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{displayCategory} Inspector</h1>
                </div>
            </div>

            {/* Upload/Camera Section */}
            {!result && (
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <Card className="flex-1 flex flex-col justify-center border-dashed border-2 bg-gray-50 border-gray-300 overflow-hidden relative p-0">
                        {showCamera ? (
                            <div className="absolute inset-0 bg-black flex flex-col">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'environment' }}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex gap-4">
                                    <Button variant="secondary" onClick={() => setShowCamera(false)} className="bg-white/20 text-white border-white/20 hover:bg-white/30 backdrop-blur-md flex-1">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCapture} className="bg-emerald-500 hover:bg-emerald-600 border-none flex-1">
                                        Capture
                                    </Button>
                                </div>
                            </div>
                        ) : !imagePreview ? (
                            <div className="flex flex-col items-center py-8 p-4">
                                <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Camera size={40} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Scan Ingredients</h2>
                                <p className="mb-8 text-gray-500 text-center max-w-xs">
                                    Take a clear photo of the ingredient list on the back of the package.
                                </p>

                                <div className="flex flex-col gap-4 w-full max-w-xs">
                                    <Button onClick={() => setShowCamera(true)} fullWidth className="h-12 text-lg shadow-md shadow-emerald-200">
                                        Open Live Camera
                                    </Button>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                                        <div className="relative flex justify-center"><span className="bg-gray-50 px-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">Or upload</span></div>
                                    </div>

                                    <label className="flex items-center justify-center w-full h-12 px-4 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors gap-2">
                                        <Image size={20} />
                                        <span>Browse Gallery</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full rounded-lg mb-4 object-cover max-h-60" />
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={handleRetake} fullWidth>Retake</Button>
                                    <Button onClick={handleAnalyze} fullWidth disabled={analyzing}>
                                        {analyzing ? 'Analyzing...' : 'Analyze Ingredients'}
                                    </Button>
                                </div>
                                {analyzing && (
                                    <div className="mt-4 text-sm text-emerald-600 animate-pulse">
                                        Processing AI Analysis...
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-6 p-4">
                    <div>
                        <Card className={`mb-4 border-l-4 ${result.score > 70 ? 'border-l-emerald-500' : result.score > 40 ? 'border-l-amber-500' : 'border-l-red-500'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold">{result.score}/100</h2>
                                    <p className="text-sm font-medium">Safety Score</p>
                                </div>
                                <SafetyBadge
                                    status={result.score > 70 ? 'safe' : result.score > 40 ? 'moderate' : 'unsafe'}
                                    size="lg"
                                />
                            </div>
                            <p className="text-sm text-secondary">{result.summary}</p>
                        </Card>

                        <div className="hidden md:block">
                            <Button onClick={handleRetake} variant="secondary" fullWidth>Scan Another</Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-3">Ingredient Breakdown</h3>
                        <div className="flex flex-col gap-3">
                            {result.ingredients.map((ing, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{ing.name}</span>
                                            {ing.risk && (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                                    {ing.risk}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-secondary mb-1">{ing.description}</p>
                                        {ing.bannedIn && (
                                            <button
                                                onClick={() => setSelectedBan(ing)}
                                                className="text-xs text-red-500 font-medium bg-transparent border-none p-0 cursor-pointer underline hover:text-red-700"
                                            >
                                                🚫 Banned in: {ing.bannedIn.join(', ')} (tap for details)
                                            </button>
                                        )}
                                    </div>
                                    <SafetyBadge status={ing.status} size="md" />
                                </div>
                            ))}
                        </div>

                        <div className="md:hidden mt-6">
                            <Button onClick={handleRetake} variant="secondary" fullWidth>Scan Another</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ban Details Modal */}
            <Modal
                isOpen={!!selectedBan}
                onClose={() => setSelectedBan(null)}
                title="Banned Ingredient Alert"
            >
                {selectedBan && (
                    <div>
                        <div className="flex items-center gap-2 mb-4 bg-red-50 p-3 rounded-md text-red-800">
                            <span className="text-2xl">🚫</span>
                            <div>
                                <h4 className="font-bold">{selectedBan.name}</h4>
                                <p className="text-xs">Identified in your scan</p>
                            </div>
                        </div>

                        <p className="mb-4">
                            This ingredient is banned or restricted in <strong>{selectedBan.bannedIn?.join(', ')}</strong> due to health concerns.
                        </p>

                        <h5 className="font-bold mb-2">Why is it banned?</h5>
                        <p className="text-sm text-secondary mb-4">
                            Regulatory bodies in these regions have linked this ingredient to potential health risks such as {selectedBan.risk ? selectedBan.risk.toLowerCase() : 'toxicity or carcinogenicity'}.
                            It is deemed stricter to exclude it from consumer products to ensure public safety.
                        </p>

                        <h5 className="font-bold mb-2">Recommendation</h5>
                        <p className="text-sm text-secondary mb-4">
                            Consider choosing an alternative product that is free from {selectedBan.name}, especially for sensitive groups (children, pregnant women).
                        </p>

                        <Button fullWidth onClick={() => setSelectedBan(null)}>
                            Understood
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}
