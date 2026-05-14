'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from'react';
import { toast } from'sonner';

const DEFAULT_LOGO ="/logo.svg";
const STORAGE_KEY ="oinzpay_branding_config";

interface BrandingConfig {
 logo: string;
 updatedAt: string;
}

interface BrandingContextType {
 logo: string;
 isLoaded: boolean;
 isDefault: boolean;
 updateLogo: (base64Image: string) => void;
 resetLogo: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
 const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
 const [isLoaded, setIsLoaded] = useState(false);

 useEffect(() => {
 const savedConfig = localStorage.getItem(STORAGE_KEY);
 if (savedConfig) {
 try {
 const config: BrandingConfig = JSON.parse(savedConfig);
 setLogo(config.logo);
 } catch (e) {
 setLogo(DEFAULT_LOGO);
 }
 }
 setIsLoaded(true);
 }, []);

 const updateLogo = useCallback((base64Image: string) => {
 const config: BrandingConfig = {
 logo: base64Image,
 updatedAt: new Date().toISOString()
 };
 
 localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
 setLogo(base64Image);
 toast.success('Branding Updated', {
 description:'Corporate logo has been synchronized globally.'
 });
 }, []);

 const resetLogo = useCallback(() => {
 localStorage.removeItem(STORAGE_KEY);
 setLogo(DEFAULT_LOGO);
 toast.success('Branding Reset', {
 description:'System branding has been reverted to default.'
 });
 }, []);

 return (
 <BrandingContext.Provider value={{ 
 logo, 
 isLoaded, 
 isDefault: logo === DEFAULT_LOGO,
 updateLogo, 
 resetLogo 
 }}>
 {children}
 </BrandingContext.Provider>
 );
}

export function useBranding() {
 const context = useContext(BrandingContext);
 if (context === undefined) {
 throw new Error('useBranding must be used within a BrandingProvider');
 }
 return context;
}
