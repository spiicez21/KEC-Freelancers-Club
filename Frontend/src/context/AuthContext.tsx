import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.service';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'incomplete' | 'pending' | 'approved';
    tagline?: string;
    bio?: string;
    techStack?: string[];
    profileImage?: string;
    bannerImage?: string;
    availability?: 'Available' | 'Busy' | 'Open';
    rate?: string;
    experience?: string;
    socials?: {
        github?: string;
        linkedin?: string;
        portfolio?: string;
    };
    projects?: {
        title: string;
        link: string;
        description: string;
        image?: string;
    }[];
}

interface AuthContextType {
    currentUser: User | null;
    pendingUsers: User[];
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    completeOnboarding: (data: Partial<User>) => Promise<void>;
    approveUser: (id: string) => Promise<void>;
    rejectUser: (id: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshPendingUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Load current user on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const user = await apiService.getCurrentUser();
                    setCurrentUser(user);

                    // If admin, load pending users
                    if (user.role === 'admin') {
                        await refreshPendingUsers();
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login(email, password);
            setCurrentUser(response.user);

            // If admin, load pending users
            if (response.user.role === 'admin') {
                await refreshPendingUsers();
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await apiService.signup(name, email, password);
            setCurrentUser(response.user);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Signup failed');
        }
    };

    const completeOnboarding = async (data: Partial<User>) => {
        if (!currentUser) return;

        try {
            await apiService.completeOnboarding(currentUser.id, {
                tagline: data.tagline,
                bio: data.bio,
                techStack: data.techStack,
                bannerImage: data.bannerImage,
                profileImage: data.profileImage,
                availability: data.availability,
                rate: data.rate,
                experience: data.experience,
                socials: data.socials,
                projects: data.projects,
            });

            // Update current user status to pending
            setCurrentUser({
                ...currentUser,
                ...data,
                status: 'pending',
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to complete onboarding');
        }
    };

    const refreshPendingUsers = async () => {
        try {
            const users = await apiService.getPendingUsers();
            setPendingUsers(users);
        } catch (error) {
            console.error('Failed to load pending users:', error);
        }
    };

    const approveUser = async (id: string) => {
        try {
            await apiService.approveUser(id);
            setPendingUsers(prev => prev.filter(u => u.id !== id));
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to approve user');
        }
    };

    const rejectUser = async (id: string) => {
        try {
            await apiService.rejectUser(id);
            setPendingUsers(prev => prev.filter(u => u.id !== id));
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to reject user');
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setCurrentUser(null);
            setPendingUsers([]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            pendingUsers,
            loading,
            login,
            signup,
            completeOnboarding,
            approveUser,
            rejectUser,
            logout,
            refreshPendingUsers,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
