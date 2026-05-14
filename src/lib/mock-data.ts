/**
 * Data type definitions for OINZpay Admin Dashboard.
 * These interfaces define the shape of data expected from the backend API.
 * All data arrays are empty — awaiting real backend integration.
 */

export interface User {
 id: string;
 name: string;
 email: string;
 phone: string;
 kycStatus:'Verified' |'Pending' |'Rejected';
 balance: number;
 dateJoined: string;
 status:'Active' |'Suspended' |'Blocked' |'Limited';
}

export interface Transaction {
 id: string;
 sender: string;
 receiver: string;
 type:'Airtime' |'Data' |'Transfer' |'Investment' |'Savings';
 amount: number;
 fee: number;
 status:'Success' |'Failed' |'Pending';
 date: string;
}

export interface AirtimeRecord {
 id: string;
 user: string;
 phone: string;
 network:'MTN' |'Airtel' |'Glo' |'9mobile';
 amount: number;
 status:'Success' |'Failed';
 date: string;
}

export interface SavingsPlan {
 id: string;
 user: string;
 planName: string;
 targetAmount: number;
 currentAmount: number;
 startDate: string;
 maturityDate: string;
 status:'Active' |'Completed' |'Withdrawn';
}

export interface Investment {
 id: string;
 user: string;
 type:'Real Estate' |'Agriculture' |'Stocks' |'Fixed Income';
 amount: number;
 returns: number;
 duration: string;
 status:'Active' |'Matured';
 date: string;
}

export interface ChartDataPoint {
 date: string;
 volume: number;
}

export interface DonutDataPoint {
 name: string;
 value: number;
 color: string;
}

// Empty data arrays — awaiting backend integration
export const users: User[] = [];
export const transactions: Transaction[] = [];
export const airtimeRecords: AirtimeRecord[] = [];
export const savingsPlans: SavingsPlan[] = [];
export const investments: Investment[] = [];
export const chartData: ChartDataPoint[] = [];
export const donutData: DonutDataPoint[] = [];
