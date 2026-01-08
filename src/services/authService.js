const USER_KEY = 'ingredient_inspector_users'; // Changed key to store array of users
const SESSION_KEY = 'ingredient_inspector_session';

export const authService = {
    // Sign up with Name, Email, Password
    signup: async (name, email, password) => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay

        const users = authService.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            name,
            email,
            password, // In a real app, never store plain text passwords
            profile: {
                allergies: [],
                sensitivities: [],
                conditions: []
            },
            onboarded: false
        };

        users.push(newUser);
        localStorage.setItem(USER_KEY, JSON.stringify(users));

        // Auto login after signup
        authService.setSession(newUser);
        return newUser;
    },

    // Login with Email, Password
    login: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay

        const users = authService.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        authService.setSession(user);
        return user;
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = '/login';
    },

    // Helper to get all users
    getUsers: () => {
        try {
            const data = localStorage.getItem(USER_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    // Helper to manage session
    setSession: (user) => {
        // Don't store password in session
        const { password, ...safeUser } = user;
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    },

    getUser: () => {
        try {
            const data = localStorage.getItem(SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    updateProfile: (profileData) => {
        const sessionUser = authService.getUser();
        if (!sessionUser) return null;

        // Update in users list
        const users = authService.getUsers();
        const userIndex = users.findIndex(u => u.email === sessionUser.email);

        if (userIndex !== -1) {
            users[userIndex].profile = { ...users[userIndex].profile, ...profileData };
            users[userIndex].onboarded = true;
            localStorage.setItem(USER_KEY, JSON.stringify(users));

            // Update session
            const updatedUser = { ...sessionUser, profile: users[userIndex].profile, onboarded: true };
            authService.setSession(updatedUser);
            return updatedUser;
        }
        return null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(SESSION_KEY);
    }
};
