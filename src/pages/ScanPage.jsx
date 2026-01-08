import React, { useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
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

    return (
        <div className="pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-4">
                <button onClick={() => navigate('/')} className="mr-3 text-2xl bg-transparent border-none cursor-pointer">
                    ←
                </button>
                <div>
                    <h1 className="text-lg font-bold capitalize">{category} Inspector</h1>
                    <p className="text-xs text-secondary">Scan back of product</p>
                </div>
            </div>

            {/* Upload/Camera Section */}
            {!result && (
                <Card className="text-center p-8 border-dashed border-2 bg-gray-50 border-gray-300">
                    {showCamera ? (
                        <div className="flex flex-col items-center">
                            <div className="relative w-full mb-4 overflow-hidden rounded-lg bg-black">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'environment' }}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex gap-3 w-full">
                                <Button variant="secondary" onClick={() => setShowCamera(false)} fullWidth>Cancel</Button>
                                <Button onClick={handleCapture} fullWidth>Capture</Button>
                            </div>
                        </div>
                    ) : !imagePreview ? (
                        <>
                            <div className="text-4xl mb-4">📸</div>
                            <p className="mb-6 font-medium">Take a photo of the ingredient list</p>

                            <div className="flex flex-col gap-3">
                                <Button onClick={() => setShowCamera(true)} fullWidth>
                                    Open Live Camera
                                </Button>

                                <div className="text-xs text-center text-gray-400 my-1">- OR -</div>

                                <label className="btn btn-secondary w-full cursor-pointer">
                                    Upload from Gallery
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </>
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
            )}

            {/* Results Section */}
            {result && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-6">
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
