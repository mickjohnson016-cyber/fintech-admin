"use client";

import React, { useEffect, useState } from"react";
import { ResponsiveContainer } from"recharts";
import { cn } from"@/lib/utils";

interface ChartWrapperProps {
 children: React.ReactElement;
 className?: string;
 height?: string | number;
 width?: string | number;
}

export function ChartWrapper({
 children,
 className,
 height = 320,
 width ="100%",
}: ChartWrapperProps) {
 const [isMounted, setIsMounted] = useState(false);

 useEffect(() => {
 setIsMounted(true);
 }, []);

 if (!isMounted) {
 return (
 <div 
 className={cn("w-full min-w-0", className)}
 style={{ height, width }}
 />
 );
 }

 return (
 <div 
 className={cn("w-full min-w-0", className)}
 style={{ height, width }}
 >
 <ResponsiveContainer width="100%" height="100%">
 {children}
 </ResponsiveContainer>
 </div>
 );
}
