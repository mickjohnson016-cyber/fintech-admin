'use client';

import React, { createContext, useContext, useState, useEffect } from'react';

interface UserProfile {
 name: string;
 email: string;
 role: string;
 avatar: string | null;
}

interface UserContextType {
 user: UserProfile;
 updateUser: (data: Partial<UserProfile>) => void;
 isLoading: boolean;
}

const defaultUser: UserProfile = {
  name: '',
  email: '',
  role: 'Unassigned Role',
  avatar: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<UserProfile>(defaultUser);
 const [isLoading, setIsLoading] = useState(true);

 // Initialize from localStorage
 useEffect(() => {
 const savedUser = localStorage.getItem('oinzpay_admin_profile');
 if (savedUser) {
 try {
 const parsed = JSON.parse(savedUser);
 setUser(parsed);
 } catch (e) {
 console.error('Failed to parse saved profile', e);
 }
 }
 setIsLoading(false);
 }, []);

 const updateUser = (data: Partial<UserProfile>) => {
 const updatedUser = { ...user, ...data };
 setUser(updatedUser);
 localStorage.setItem('oinzpay_admin_profile', JSON.stringify(updatedUser));
 };

 return (
 <UserContext.Provider value={{ user, updateUser, isLoading }}>
 {children}
 </UserContext.Provider>
 );
}

export function useUser() {
 const context = useContext(UserContext);
 if (context === undefined) {
 throw new Error('useUser must be used within a UserProvider');
 }
 return context;
}
