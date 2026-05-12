# OINZpay Admin Dashboard Interaction Inventory

This document tracks the operational state of all interactive elements across the dashboard.

## Classification System
- **1. FULLY FUNCTIONAL**: Works exactly as intended (Real or high-fidelity mock logic).
- **2. PARTIALLY FUNCTIONAL**: Triggers an action but result is incomplete or only UI-side.
- **3. VISUAL ONLY / PLACEHOLDER**: Component exists but does nothing or only triggers a "Coming Soon" toast.
- **4. BROKEN RUNTIME**: Causes a crash or console error.
- **5. MISSING STATE MANAGEMENT**: Interaction isn't connected to any state or hook.
- **6. BROKEN EXPORT**: Export button doesn't trigger a download.
- **7. BROKEN MODAL/DRAWER**: Modal/Drawer exists but doesn't open or close correctly.
- **8. BROKEN NAVIGATION**: Link points to non-existent or wrong route.
- **9. BROKEN GLOBAL SYNC**: Changes don't propagate (e.g., logo update).
- **10. ACCESSIBILITY ISSUE**: Keyboard/screen reader problems.

---

## Global Components

### [TopNavbar](file:///c:/Users/mickj/fintech-admin/src/components/layout/TopNavbar.tsx)
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Sidebar Toggles | 1. FULLY FUNCTIONAL | Uses LayoutContext correctly. |
| Global Search (Ctrl+K) | 2. PARTIALLY FUNCTIONAL | Focuses input, but search is toast-only. |
| Theme Toggle | 1. FULLY FUNCTIONAL | Syncs with next-themes. |
| Notification Drawer | 1. FULLY FUNCTIONAL | Opens and filters correctly. |
| Notif Action: Assign | 3. VISUAL ONLY | Triggers "Coming Soon" toast. |
| Notif Action: Resolve All | 1. FULLY FUNCTIONAL | Clears unread states. |
| Profile Card | 3. VISUAL ONLY | Triggers toast instead of profile menu. |

### [Sidebar](file:///c:/Users/mickj/fintech-admin/src/components/layout/Sidebar.tsx)
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Nav Links | 1. FULLY FUNCTIONAL | Active states and routing work. |
| Collapse/Expand | 1. FULLY FUNCTIONAL | Uses LayoutContext. |
| Bottom Profile Card | 3. VISUAL ONLY | Triggers toast instead of profile menu. |

---

## Module: Dashboard ([/dashboard](file:///c:/Users/mickj/fintech-admin/src/app/dashboard/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Date Range Picker | 3. VISUAL ONLY | Triggers "Coming Soon" toast. |
| Refresh Metrics | 2. PARTIALLY FUNCTIONAL | Triggers toast, no data reload. |
| KPI Card Hover | 1. FULLY FUNCTIONAL | Animations work. |
| Sales More Menu | 3. VISUAL ONLY | Triggers "Coming Soon" toast. |
| Goal More Menu | 3. VISUAL ONLY | Triggers "Coming Soon" toast. |
| Stats Tabs | 1. FULLY FUNCTIONAL | Updates activeTab state. |
| Ledger Row Click | 1. FULLY FUNCTIONAL | Navigates to transaction detail. |

---

## Module: Transactions ([/transactions](file:///c:/Users/mickj/fintech-admin/src/app/transactions/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Export CSV | 1. FULLY FUNCTIONAL | Connected to executeExport. |
| Review Queue Button | 2. PARTIALLY FUNCTIONAL | Navigates to compliance but doesn't open drawer. |
| Escalate Case Button | 1. FULLY FUNCTIONAL | Opens functional modal with mock API. |
| Search Bar | 1. FULLY FUNCTIONAL | Connected to useTableFilters. |
| Refresh Ledger | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Table: Eye Icon | 1. FULLY FUNCTIONAL | Navigates to detail. |
| Table: ShieldAlert | 1. FULLY FUNCTIONAL | Opens escalation modal. |
| Table: Copy ID | 1. FULLY FUNCTIONAL | Copies to clipboard. |
| Table: Export Receipt| 1. FULLY FUNCTIONAL | Connected to exportTransactionReceipt. |
| Table: Retry Payment | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Table: Freeze Profile| 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Advanced Filter | 3. VISUAL ONLY | Triggers toast. |

---

## Module: Transaction Detail ([/transactions/[id]](file:///c:/Users/mickj/fintech-admin/src/app/transactions/%5Bid%5D/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Back Button | 1. FULLY FUNCTIONAL | Uses router.back(). |
| Receipt Export | 3. VISUAL ONLY | Triggers toast. Needs connection to utility. |
| Reverse Payment | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Escalate Button | 2. PARTIALLY FUNCTIONAL | Triggers toast (should open modal like parent). |
| View Profile Link | 1. FULLY FUNCTIONAL | Navigates to user profile. |
| Forensic Report | 3. VISUAL ONLY | Triggers toast. |
| Quick Actions (Retry)| 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Quick Actions (Ticket)| 3. VISUAL ONLY | Triggers toast. |
| Quick Actions (Block)| 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Add Compliance Note | 3. VISUAL ONLY | Triggers toast. |

---

## Module: Users ([/users](file:///c:/Users/mickj/fintech-admin/src/app/users/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Export Directory | 1. FULLY FUNCTIONAL | Connected to executeExport. |
| New Account Button | 3. VISUAL ONLY | Triggers toast. |
| Search/Filters | 1. FULLY FUNCTIONAL | Connected to useTableFilters. |
| Table Row Click | 1. FULLY FUNCTIONAL | Opens user drawer. |
| Drawer: Freeze | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Drawer: Suspend | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Drawer: Upgrade | 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Drawer: Export | 1. FULLY FUNCTIONAL | Connected to exportUserStatement. |
| Drawer: Notes | 3. VISUAL ONLY | Textarea exists but doesn't save. |
| Pagination | 3. VISUAL ONLY | Triggers toast. |

---

## Module: Compliance ([/compliance](file:///c:/Users/mickj/fintech-admin/src/app/compliance/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| KYC Queue Tabs | 1. FULLY FUNCTIONAL | State managed. |
| KYC Action: Approve | 2. PARTIALLY FUNCTIONAL | Triggers toast, doesn't update state. |
| KYC Action: Reject | 2. PARTIALLY FUNCTIONAL | Triggers toast, doesn't update state. |
| Investigate Alert | 1. FULLY FUNCTIONAL | Opens investigation workspace. |
| Analyze Clusters | 1. FULLY FUNCTIONAL | Opens cluster drawer with mock load. |
| Audit Explorer Btn | 1. FULLY FUNCTIONAL | Opens modal. |
| Audit Explorer Export| 1. FULLY FUNCTIONAL | Connected to executeExport. |
| Workspace: SAR Export| 2. PARTIALLY FUNCTIONAL | Triggers toast. |
| Cluster: Freeze All | 2. PARTIALLY FUNCTIONAL | Triggers toast. |

---

## Module: Settings Overview ([/settings](file:///c:/Users/mickj/fintech-admin/src/app/settings/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Deep Audit View | 3. VISUAL ONLY | Triggers toast. |
| Governance Queue Btn| 1. FULLY FUNCTIONAL | Opens modal. |
| Queue: Approve/Reject| 2. PARTIALLY FUNCTIONAL | Triggers toast. |

---

## Module: Admin Management ([/settings/admins](file:///c:/Users/mickj/fintech-admin/src/app/settings/admins/page.tsx))
| Interaction | Status | Notes |
| :--- | :--- | :--- |
| Role Modal (Edit) | 1. FULLY FUNCTIONAL | Saves to state. |
| Role Modal (Delete) | 1. FULLY FUNCTIONAL | Removes from state. |
| Invite Admin Modal | 1. FULLY FUNCTIONAL | Adds to state. |
| Admin Status Toggle | 1. FULLY FUNCTIONAL | Updates state. |
| Admin Revoke | 1. FULLY FUNCTIONAL | Removes from state. |
| Governance Toggles | 1. FULLY FUNCTIONAL | State managed. |
| Policy Matrix Edits | 1. FULLY FUNCTIONAL | State managed. |
| Export Policy | 1. FULLY FUNCTIONAL | Connected to executeExport. |
