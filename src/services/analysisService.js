import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Mock data kept as fallback
const MOCK_INGREDIENTS = {
    food: [
        { name: 'Water', status: 'safe', description: 'Essential for hydration.' },
        { name: 'Sugar', status: 'moderate', description: 'High consumption linked to health issues.' },
        { name: 'Sodium Benzoate', status: 'moderate', description: 'Preservative. Some concerns when mixed with Vitamin C.' },
        {
            name: 'Red 40',
            status: 'unsafe',
            description: 'Artificial color linked to hyperactivity in children.',
            bannedIn: ['Norway', 'Austria'],
            banReason: 'Linked to hyperactivity in children and potential genotoxicity concerns.'
        },
        { name: 'Whole Wheat Flour', status: 'safe', description: 'Good source of fiber.' },
        { name: 'High Fructose Corn Syrup', status: 'moderate', description: 'Added sweetener. Calorie dense.' },
        {
            name: 'Potassium Bromate',
            status: 'unsafe',
            description: 'Dough conditioner.',
            bannedIn: ['EU', 'Canada', 'China'],
            banReason: 'Classified as a category 2B carcinogen by the IARC. Linked to kidney and thyroid damage.'
        }
    ],
    cosmetics: [
        { name: 'Aqua', status: 'safe', description: 'Water.' },
        {
            name: 'Parabens',
            status: 'unsafe',
            description: 'Preservative with potential endocrine disruption risks.',
            bannedIn: ['EU'],
            banReason: 'Long-chain parabens (Isopropylparaben, Isobutylparaben) are banned in the EU due to lack of data on safety and potential endocrine disrupting properties.'
        },
        { name: 'Fragrance', status: 'moderate', description: 'Common allergen. Exact composition often hidden.' },
        { name: 'Glycerin', status: 'safe', description: 'Moisturizer.' },
        {
            name: 'Hydroquinone',
            status: 'unsafe',
            description: 'Skin lightening agent.',
            bannedIn: ['EU', 'Japan', 'Australia'],
            banReason: 'Prohibited due to potential carcinogenicity and ochronosis (skin darkening/disfiguration).'
        }
    ],
    household: [
        { name: 'Sodium Hypochlorite', status: 'unsafe', description: 'Bleach. Toxic if ingested or mixed with ammonia.', risk: 'Irritant' },
        { name: 'Fragrance', status: 'moderate', description: 'Respiratory irritant for some.' }
    ],
    baby: [
        { name: 'Talc', status: 'moderate', description: 'Powder base. Risk of contamination if not purified.' },
        { name: 'Chamomile Extract', status: 'safe', description: 'Soothing agent.' }
    ]
}

// Helper to convert file to base64 for Gemini
async function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({
            inlineData: {
                data: reader.result.split(',')[1],
                mimeType: file.type
            },
        });
        reader.readAsDataURL(file);
    });
}

export const analysisService = {
    analyzeImage: async (imageFile, category = 'food', userProfile) => {
        // 1. Try Real API Analysis
        if (genAI && imageFile) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // If imageFile is a string (mock/webcam screenshot), we need to handle it differently 
                // but for now let's assume it's a blob/file or base64 string
                let imagePart;
                if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
                    imagePart = {
                        inlineData: {
                            data: imageFile.split(',')[1],
                            mimeType: 'image/jpeg' // Assume jpeg for webcam
                        }
                    };
                } else {
                    imagePart = await fileToGenerativePart(imageFile);
                }

                const prompt = `
                Analyze the ingredients list in this image for a product in the category: "${category}".
                Identify all ingredients.
                
                For each ingredient determine:
                1. Name
                2. Status: 'safe', 'moderate', 'unsafe'
                3. Brief description of function/risk (max 10 words).
                4. Risk tag (e.g. 'Carcinogen', 'Allergen', 'Irritant') if unsafe/moderate.
                5. bannedIn: Array of strings (countries/regions like 'EU', 'USA', 'Japan') if it is banned anywhere.
                
                Also calculate an overall safety score (0-100) where 100 is perfectly safe.
                
                Return ONLY valid JSON with this structure:
                {
                    "score": 85,
                    "summary": "Short 1-sentence summary of overall safety.",
                    "ingredients": [
                        { "name": "IngName", "status": "safe", "description": "...", "risk": "...", "bannedIn": ["EU"] }
                    ]
                }
                `;

                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                const text = response.text();

                // Clean markdown code blocks if present
                const jsonStr = text.replace(/```json|```/g, '').trim();
                const data = JSON.parse(jsonStr);

                // Add profile conflict logic on top of AI results
                const conflicts = [];
                if (userProfile && userProfile.allergies) {
                    data.ingredients.forEach(ing => {
                        userProfile.allergies.forEach(allergy => {
                            if (ing.name.toLowerCase().includes(allergy.toLowerCase())) {
                                ing.status = 'unsafe';
                                ing.risk = `Allergen: ${allergy}`;
                                conflicts.push(allergy);
                                data.score = Math.max(0, data.score - 20);
                            }
                        });
                    });
                }

                return { ...data, conflicts };

            } catch (error) {
                console.error("Gemini API Error:", error);
                console.log("Falling back to mock analysis...");
                // Fall through to mock logic below
            }
        }

        // --- FALLBACK MOCK LOGIC ---
        // Mock processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Select random ingredients from the category
        const pool = MOCK_INGREDIENTS[category] || MOCK_INGREDIENTS['food'];

        // Return ALL ingredients from the pool (simulating a full scan)
        const detected = [...pool].sort(() => 0.5 - Math.random());

        // Calculate score
        const unsafeCount = detected.filter(i => i.status === 'unsafe').length;
        const moderateCount = detected.filter(i => i.status === 'moderate').length;

        let score = 100 - (unsafeCount * 30) - (moderateCount * 10);
        if (score < 0) score = 0;

        let summary = "Looking good! Mostly safe ingredients.";
        if (score < 50) summary = "Caution advised. Several concerning ingredients found.";
        else if (score < 80) summary = "Moderate safety. Consume/Use with awareness.";

        // Check user profile conflicts
        const conflicts = []
        if (userProfile && userProfile.allergies) {
            if (category === 'food' && userProfile.allergies.includes('Peanuts')) {
                detected.push({ name: 'Peanut Oil', status: 'unsafe', description: 'Contains allergens.', risk: 'Allergen: Peanuts' });
                conflicts.push('Peanuts');
                score -= 20;
            }
        }

        return {
            score,
            summary,
            ingredients: detected,
            conflicts
        };
    }
}
