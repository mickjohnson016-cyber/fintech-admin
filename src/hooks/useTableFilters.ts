import { useState, useMemo } from'react';

interface FilterOptions<T> {
 searchKeys?: (keyof T | string)[];
 initialStatus?: string;
 initialSortKey?: keyof T;
 initialSortOrder?:'asc' |'desc';
}

export function useTableFilters<T>(data: T[], options: FilterOptions<T> = {}) {
 const { 
 searchKeys = [], 
 initialStatus ='all',
 initialSortKey,
 initialSortOrder ='desc'
 } = options;

 const [searchTerm, setSearchTerm] = useState('');
 const [statusFilter, setStatusFilter] = useState(initialStatus);
 const [currentPage, setCurrentPage] = useState(1);
 const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
 const [sortOrder, setSortOrder] = useState<'asc' |'desc'>(initialSortOrder);

 const filteredData = useMemo(() => {
 let result = [...data];

 // 1. Status Filtering
 if (statusFilter !=='all') {
 result = result.filter((item: any) => {
 const status = item.status || item.kycStatus || item.kyc;
 return status === statusFilter;
 });
 }

 // 2. Search Filtering
 if (searchTerm.trim()) {
 const lowerSearch = searchTerm.toLowerCase();
 result = result.filter((item: any) => {
 return searchKeys.some(key => {
 const value = key.toString().split('.').reduce((obj, k) => obj?.[k], item);
 return value?.toString().toLowerCase().includes(lowerSearch);
 });
 });
 }

 // 3. Sorting
 if (sortKey) {
 result.sort((a: any, b: any) => {
 const aVal = a[sortKey];
 const bVal = b[sortKey];
 
 if (aVal < bVal) return sortOrder ==='asc' ? -1 : 1;
 if (aVal > bVal) return sortOrder ==='asc' ? 1 : -1;
 return 0;
 });
 }

 return result;
 }, [data, searchTerm, statusFilter, searchKeys, sortKey, sortOrder]);

 const resetFilters = () => {
 setSearchTerm('');
 setStatusFilter('all');
 setCurrentPage(1);
 };

 const handleSort = (key: keyof T) => {
 if (sortKey === key) {
 setSortOrder(sortOrder ==='asc' ?'desc' :'asc');
 } else {
 setSortKey(key);
 setSortOrder('desc');
 }
 };

 return {
 searchTerm,
 setSearchTerm,
 statusFilter,
 setStatusFilter,
 filteredData,
 resetFilters,
 currentPage,
 setCurrentPage,
 sortKey,
 sortOrder,
 handleSort
 };
}
