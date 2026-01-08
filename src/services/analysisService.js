const MOCK_INGREDIENTS = {
    food: [
        { name: 'Water', status: 'safe', description: 'Essential for hydration.' },
        { name: 'Sugar', status: 'moderate', description: 'High consumption linked to health issues.' },
        { name: 'Sodium Benzoate', status: 'moderate', description: 'Preservative. Some concerns when mixed with Vitamin C.' },
        { name: 'Red 40', status: 'unsafe', description: 'Artificial color linked to hyperactivity in children.', bannedIn: ['Norway', 'Austria'] },
        { name: 'Whole Wheat Flour', status: 'safe', description: 'Good source of fiber.' },
        { name: 'High Fructose Corn Syrup', status: 'moderate', description: 'Added sweetener. Calorie dense.' }
    ],
    cosmetics: [
        { name: 'Aqua', status: 'safe', description: 'Water.' },
        { name: 'Parabens', status: 'unsafe', description: 'Preservative with potential endocrine disruption risks.', bannedIn: ['EU'] },
        { name: 'Fragrance', status: 'moderate', description: 'Common allergen. Exact composition often hidden.' },
        { name: 'Glycerin', status: 'safe', description: 'Moisturizer.' }
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

export const analysisService = {
    analyzeImage: async (imageFile, category = 'food', userProfile) => {
        // Mock processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Select random ingredients from the category for demo purposes
        // In a real app, OCR would extract text here
        const pool = MOCK_INGREDIENTS[category] || MOCK_INGREDIENTS['food'];

        // Shuffle and pick 3-5
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const detected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);

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
            // Mock simple matching
            // If user has 'Milk' allergy and we happen to have 'Milk' in our mock list (we don't for now, but logic stands)
            // For demo, let's force a conflict if "Peanuts" is in profile and we add a fake peanut item if category is food
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
