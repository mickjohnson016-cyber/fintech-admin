export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  balance: number;
  dateJoined: string;
  status: 'Active' | 'Suspended' | 'Blocked' | 'Limited';
}

export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  type: 'Airtime' | 'Data' | 'Transfer' | 'Investment' | 'Savings';
  amount: number;
  fee: number;
  status: 'Success' | 'Failed' | 'Pending';
  date: string;
}

export interface AirtimeRecord {
  id: string;
  user: string;
  phone: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  amount: number;
  status: 'Success' | 'Failed';
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
  status: 'Active' | 'Completed' | 'Withdrawn';
}

export interface Investment {
  id: string;
  user: string;
  type: 'Real Estate' | 'Agriculture' | 'Stocks' | 'Fixed Income';
  amount: number;
  returns: number;
  duration: string;
  status: 'Active' | 'Matured';
  date: string;
}

export const users: User[] = [
  { id: '1', name: 'Chukwudi Okafor', email: 'chukwudi.o@example.com', phone: '08031234567', kycStatus: 'Verified', balance: 1250000.50, dateJoined: '2023-10-12', status: 'Active' },
  { id: '2', name: 'Amina Yusuf', email: 'amina.y@example.com', phone: '08109876543', kycStatus: 'Verified', balance: 45000.00, dateJoined: '2023-11-05', status: 'Active' },
  { id: '3', name: 'Olumide Bakare', email: 'olumide.b@example.com', phone: '09012348765', kycStatus: 'Pending', balance: 12500.75, dateJoined: '2024-01-20', status: 'Active' },
  { id: '4', name: 'Chinelo Adewale', email: 'chinelo.a@example.com', phone: '07065432109', kycStatus: 'Rejected', balance: 0.00, dateJoined: '2024-02-15', status: 'Suspended' },
  { id: '5', name: 'Ibrahim Danjuma', email: 'ibrahim.d@example.com', phone: '08055554444', kycStatus: 'Verified', balance: 890000.00, dateJoined: '2023-09-30', status: 'Active' },
  { id: '6', name: 'Ngozi Okonjo', email: 'ngozi.o@example.com', phone: '08122334455', kycStatus: 'Verified', balance: 2500000.00, dateJoined: '2023-08-12', status: 'Active' },
  { id: '7', name: 'Babatunde Raji', email: 'babatunde.r@example.com', phone: '09033445566', kycStatus: 'Pending', balance: 5000.00, dateJoined: '2024-03-01', status: 'Active' },
];

export const transactions: Transaction[] = [
  { id: 'TXN-OINZ-849204', sender: 'Chukwudi Okafor', receiver: 'Amina Yusuf', type: 'Transfer', amount: 50000, fee: 10, status: 'Success', date: '2024-05-06 14:30' },
  { id: 'TXN-OINZ-128394', sender: 'Ibrahim Danjuma', receiver: 'MTN Nigeria', type: 'Airtime', amount: 2000, fee: 0, status: 'Success', date: '2024-05-06 12:15' },
  { id: 'TXN-OINZ-992837', sender: 'Olumide Bakare', receiver: 'OINZ Invest', type: 'Investment', amount: 100000, fee: 0, status: 'Pending', date: '2024-05-06 10:00' },
  { id: 'TXN-OINZ-447283', sender: 'Amina Yusuf', receiver: 'Glo World', type: 'Data', amount: 5000, fee: 0, status: 'Failed', date: '2024-05-05 20:45' },
  { id: 'TXN-OINZ-662839', sender: 'Ngozi Okonjo', receiver: 'Smart Savings', type: 'Savings', amount: 250000, fee: 0, status: 'Success', date: '2024-05-05 16:20' },
  { id: 'TXN-OINZ-332123', sender: 'Babatunde Raji', receiver: 'Chinelo Adewale', type: 'Transfer', amount: 1500, fee: 10, status: 'Success', date: '2024-05-05 09:10' },
];

export const airtimeRecords: AirtimeRecord[] = [
  { id: '1', user: 'Chukwudi Okafor', phone: '08031234567', network: 'MTN', amount: 1000, status: 'Success', date: '2024-05-06 14:30' },
  { id: '2', user: 'Amina Yusuf', phone: '08109876543', network: 'Airtel', amount: 2000, status: 'Success', date: '2024-05-06 12:15' },
  { id: '3', user: 'Olumide Bakare', phone: '09012348765', network: 'Glo', amount: 500, status: 'Success', date: '2024-05-06 10:00' },
  { id: '4', user: 'Ibrahim Danjuma', phone: '08055554444', network: '9mobile', amount: 1500, status: 'Failed', date: '2024-05-05 20:45' },
];

export const savingsPlans: SavingsPlan[] = [
  { id: '1', user: 'Chukwudi Okafor', planName: 'December Wedding', targetAmount: 2000000, currentAmount: 850000, startDate: '2024-01-01', maturityDate: '2024-12-01', status: 'Active' },
  { id: '2', user: 'Amina Yusuf', planName: 'New Car', targetAmount: 5000000, currentAmount: 1200000, startDate: '2023-10-01', maturityDate: '2025-10-01', status: 'Active' },
  { id: '3', user: 'Ibrahim Danjuma', planName: 'Rent 2024', targetAmount: 1500000, currentAmount: 1500000, startDate: '2023-05-01', maturityDate: '2024-05-01', status: 'Completed' },
];

export const investments: Investment[] = [
  { id: '1', user: 'Ngozi Okonjo', type: 'Real Estate', amount: 5000000, returns: 750000, duration: '12 Months', status: 'Active', date: '2023-09-15' },
  { id: '2', user: 'Chukwudi Okafor', type: 'Agriculture', amount: 200000, returns: 30000, duration: '6 Months', status: 'Matured', date: '2023-11-01' },
];

export const chartData = [
  { date: 'Apr 07', volume: 1200000 },
  { date: 'Apr 09', volume: 1500000 },
  { date: 'Apr 11', volume: 1100000 },
  { date: 'Apr 13', volume: 1800000 },
  { date: 'Apr 15', volume: 2200000 },
  { date: 'Apr 17', volume: 1900000 },
  { date: 'Apr 19', volume: 2500000 },
  { date: 'Apr 21', volume: 2100000 },
  { date: 'Apr 23', volume: 2800000 },
  { date: 'Apr 25', volume: 3200000 },
  { date: 'Apr 27', volume: 2900000 },
  { date: 'Apr 29', volume: 3500000 },
  { date: 'May 01', volume: 4100000 },
  { date: 'May 03', volume: 3800000 },
  { date: 'May 05', volume: 4500000 },
  { date: 'May 07', volume: 4200000 },
];

export const donutData = [
  { name: 'Airtime & Data', value: 35, color: '#2979FF' },
  { name: 'Send & Receive', value: 45, color: '#00C49F' },
  { name: 'Invest & Grow', value: 10, color: '#FFBB28' },
  { name: 'Smart Savings', value: 10, color: '#FF8042' },
];
