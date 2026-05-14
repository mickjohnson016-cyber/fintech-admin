'use client';

import React from'react';
import Link from'next/link';
import { usePathname } from'next/navigation';
import { ChevronRight, Home } from'lucide-react';
import { cn } from'@/lib/utils';

interface BreadcrumbItem {
 label: string;
 href: string;
 isLast?: boolean;
}

interface BreadcrumbsProps {
 className?: string;
 items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ className, items }: BreadcrumbsProps) {
 const pathname = usePathname();
 const pathSegments = pathname.split('/').filter((segment) => segment !== '');

 // Skip breadcrumbs on dashboard
 if (!items && (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard'))) {
 return null;
 }

 const breadcrumbs = items || pathSegments.map((segment, index) => {
 const href =`/${pathSegments.slice(0, index + 1).join('/')}`;
 const label = segment
 .replace(/-/g, ' ')
 .replace(/\[|\]/g, '') // Handle dynamic routes like [id]
 .replace(/\b\w/g, (char) => char.toUpperCase());

 return { label, href, isLast: index === pathSegments.length - 1 };
 });

 return (
 <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 mb-4", className)}>
 <Link
 href="/dashboard"
 className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest hover:text-primary transition-colors"
 >
 <Home size={12} />
 Dashboard
 </Link>

 {breadcrumbs.map((breadcrumb, index) => (
 <React.Fragment key={breadcrumb.href}>
 <ChevronRight size={12} className="text-muted-foreground/30" />
 {breadcrumb.isLast ? (
 <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
 {breadcrumb.label}
 </span>
 ) : (
 <Link
 href={breadcrumb.href}
 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest hover:text-primary transition-colors"
 >
 {breadcrumb.label}
 </Link>
 )}
 </React.Fragment>
 ))}
 </nav>
 );
}
