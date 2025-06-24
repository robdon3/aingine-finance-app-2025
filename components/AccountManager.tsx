'use client'

import React, { useState, useEffect } from 'react'
import { User, Users, LogOut, Save, Trash2, Plus, Settings, Shield, Download, Upload } from 'lucide-react'

interface FamilyMember {
  id: string
  name: string
  relationship: string
  age: number
  education: string
  income: number
  expenses: number
  goals: string[]
  accounts: Account[]
}

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'retirement' | 'credit' | 'loan' | 'other'
  institution: string
  balance: number
  interestRate?: number
  monthlyPayment?: number
  owner: string
  notes: string
}

interface Paycheck {
  id: string
  date: string
  grossPay: number
  netPay: number
  deductions: {
    taxes: number
    retirement: number
    insurance: number
    other: number
  }
  employer: string
  notes: string
}

// Storage keys for localStorage
const STORAGE_KEYS = {
  FAMILY_MEMBERS: 'aegis_family_members',
  ACCOUNTS: 'aegis_accounts',
  PAYCHECKS: 'aegis_paychecks',
  USER_LOGGED_IN: 'aegis_user_logged_in',
  CURRENT_USER: 'aegis_current_user',
  STARTED_WITH_BLANK_DATA: 'aegis_started_with_blank_data'
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// Add a helper to ensure the type is valid
const allowedAccountTypes: Account['type'][] = [
  'checking', 'savings', 'investment', 'retirement', 'credit', 'loan', 'other'
]
function toAccountType(type: string): Account['type'] {
  return allowedAccountTypes.includes(type as Account['type']) ? type as Account['type'] : 'other'
}

// Local storage helpers
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error)
      return null
    }
  },
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error)
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error)
    }
  }
}

// Helper function for other components to check if they should show blank data
export const shouldShowBlankData = () => {
  return storage.get(STORAGE_KEYS.STARTED_WITH_BLANK_DATA) === true
}

export default function AccountManager() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [paychecks, setPaychecks] = useState<Paycheck[]>([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddPaycheck, setShowAddPaycheck] = useState(false)
  const [startedWithBlankData, setStartedWithBlankData] = useState(false)

  // Form state for family member
  const [memberForm, setMemberForm] = useState({
    id: '', name: '', relationship: '', age: '', education: '', income: '', expenses: '', goals: ''
  })
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  // Form state for account
  const [accountForm, setAccountForm] = useState({
    id: '', name: '', type: 'checking', institution: '', balance: '', interestRate: '', monthlyPayment: '', owner: '', notes: ''
  })
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)

  // Form state for paycheck
  const [paycheckForm, setPaycheckForm] = useState({
    id: '', date: '', grossPay: '', netPay: '', taxes: '', retirement: '', insurance: '', other: '', employer: '', notes: ''
  })
  const [editingPaycheckId, setEditingPaycheckId] = useState<string | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLoginState = storage.get(STORAGE_KEYS.USER_LOGGED_IN)
    const savedUser = storage.get(STORAGE_KEYS.CURRENT_USER)
    const startedWithBlank = storage.get(STORAGE_KEYS.STARTED_WITH_BLANK_DATA)
    
    if (savedLoginState) {
      setIsLoggedIn(true)
      setCurrentUser(savedUser || '')
      setStartedWithBlankData(startedWithBlank || false)
      
      // Load saved data
      const savedMembers = storage.get(STORAGE_KEYS.FAMILY_MEMBERS) || []
      const savedAccounts = storage.get(STORAGE_KEYS.ACCOUNTS) || []
      const savedPaychecks = storage.get(STORAGE_KEYS.PAYCHECKS) || []
      
      setFamilyMembers(savedMembers)
      setAccounts(savedAccounts)
      setPaychecks(savedPaychecks)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      storage.set(STORAGE_KEYS.FAMILY_MEMBERS, familyMembers)
      storage.set(STORAGE_KEYS.ACCOUNTS, accounts)
      storage.set(STORAGE_KEYS.PAYCHECKS, paychecks)
    }
  }, [familyMembers, accounts, paychecks, isLoggedIn])

  // Sample data - only load if no existing data and user didn't choose blank data
  useEffect(() => {
    if (isLoggedIn && familyMembers.length === 0 && accounts.length === 0 && paychecks.length === 0 && !startedWithBlankData) {
      const sampleMembers: FamilyMember[] = [
        {
          id: '1',
          name: 'John Doe',
          relationship: 'Self',
          age: 30,
          education: 'Bachelor&apos;s',
          income: 75000,
          expenses: 45000,
          goals: ['Buy house', 'Save for retirement'],
          accounts: []
        },
        {
          id: '2',
          name: 'Jane Doe',
          relationship: 'Spouse',
          age: 28,
          education: 'Master&apos;s',
          income: 65000,
          expenses: 40000,
          goals: ['Start business', 'Travel'],
          accounts: []
        },
        {
          id: '3',
          name: 'Emma Doe',
          relationship: 'Child',
          age: 8,
          education: 'Elementary',
          income: 0,
          expenses: 12000,
          goals: ['College fund', 'Summer camp'],
          accounts: []
        }
      ]

      const sampleAccounts: Account[] = [
        {
          id: '1',
          name: 'Primary Checking',
          type: 'checking',
          institution: 'Chase Bank',
          balance: 8500,
          owner: 'John Doe',
          notes: 'Main account for bills and expenses'
        },
        {
          id: '2',
          name: '401(k)',
          type: 'retirement',
          institution: 'Fidelity',
          balance: 45000,
          owner: 'John Doe',
          notes: 'Employer match 6%'
        },
        {
          id: '3',
          name: 'Roth IRA',
          type: 'investment',
          institution: 'Vanguard',
          balance: 25000,
          owner: 'John Doe',
          notes: 'Index fund portfolio'
        },
        {
          id: '4',
          name: 'Car Loan',
          type: 'loan',
          institution: 'Bank of America',
          balance: -18000,
          interestRate: 4.5,
          monthlyPayment: 350,
          owner: 'John Doe',
          notes: '2022 Honda Accord'
        },
        {
          id: '5',
          name: '529 College Fund',
          type: 'investment',
          institution: 'State College Fund',
          balance: 15000,
          owner: 'Emma Doe',
          notes: 'Tax-advantaged college savings'
        }
      ]

      const samplePaychecks: Paycheck[] = [
        {
          id: '1',
          date: '2024-03-15',
          grossPay: 3200,
          netPay: 2400,
          deductions: {
            taxes: 600,
            retirement: 192,
            insurance: 150,
            other: 58
          },
          employer: 'Tech Corp',
          notes: 'Bi-weekly paycheck'
        }
      ]

      setFamilyMembers(sampleMembers)
      setAccounts(sampleAccounts)
      setPaychecks(samplePaychecks)
    }
  }, [isLoggedIn, familyMembers.length, accounts.length, paychecks.length, startedWithBlankData])

  const startFreshWithBlankData = () => {
    // Clear all data from localStorage to ensure fresh start
    storage.remove(STORAGE_KEYS.FAMILY_MEMBERS)
    storage.remove(STORAGE_KEYS.ACCOUNTS)
    storage.remove(STORAGE_KEYS.PAYCHECKS)
    
    setIsLoggedIn(true)
    setCurrentUser('New User')
    setFamilyMembers([])
    setAccounts([])
    setPaychecks([])
    setStartedWithBlankData(true)
    storage.set(STORAGE_KEYS.USER_LOGGED_IN, true)
    storage.set(STORAGE_KEYS.CURRENT_USER, 'New User')
    storage.set(STORAGE_KEYS.FAMILY_MEMBERS, [])
    storage.set(STORAGE_KEYS.ACCOUNTS, [])
    storage.set(STORAGE_KEYS.PAYCHECKS, [])
    storage.set(STORAGE_KEYS.STARTED_WITH_BLANK_DATA, true)
  }

  const startFreshWithSampleData = () => {
    // Clear localStorage first to ensure fresh start
    storage.remove(STORAGE_KEYS.FAMILY_MEMBERS)
    storage.remove(STORAGE_KEYS.ACCOUNTS)
    storage.remove(STORAGE_KEYS.PAYCHECKS)
    storage.remove(STORAGE_KEYS.STARTED_WITH_BLANK_DATA)
    setStartedWithBlankData(false)
    loadSampleUser()
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
    setFamilyMembers([])
    setAccounts([])
    setPaychecks([])
    setStartedWithBlankData(false)
    storage.remove(STORAGE_KEYS.USER_LOGGED_IN)
    storage.remove(STORAGE_KEYS.CURRENT_USER)
    storage.remove(STORAGE_KEYS.FAMILY_MEMBERS)
    storage.remove(STORAGE_KEYS.ACCOUNTS)
    storage.remove(STORAGE_KEYS.PAYCHECKS)
    storage.remove(STORAGE_KEYS.STARTED_WITH_BLANK_DATA)
  }

  const exportData = () => {
    // Get all data from localStorage
    const allData = {
      // Account Manager Data
      familyMembers,
      accounts,
      paychecks,
      
      // Financial Dashboard Data (if available)
      financialData: storage.get('aegis_financial_data') || [],
      
      // Net Worth Data (if available)
      netWorthData: storage.get('aegis_net_worth_data') || [],
      lifeMilestones: storage.get('aegis_life_milestones') || [],
      investments: storage.get('aegis_investments') || [],
      
      // Time Value Calculations (if available)
      timeValueCalculations: storage.get('aegis_time_value_calculations') || [],
      
      // True Cost Calculations (if available)
      trueCostCalculations: storage.get('aegis_true_cost_calculations') || [],
      
      // Life Context Data (if available)
      lifeContextData: storage.get('aegis_life_context_data') || [],
      
      // Export metadata
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      appName: 'Project Aegis',
      dataSummary: {
        familyMembers: familyMembers.length,
        accounts: accounts.length,
        paychecks: paychecks.length,
        totalNetWorth: accounts.reduce((sum, acc) => sum + acc.balance, 0),
        totalAssets: accounts.filter(acc => acc.balance > 0).reduce((sum, acc) => sum + acc.balance, 0),
        totalLiabilities: Math.abs(accounts.filter(acc => acc.balance < 0).reduce((sum, acc) => sum + acc.balance, 0))
      }
    }
    
    // Create JSON export
    const jsonBlob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const jsonUrl = URL.createObjectURL(jsonBlob)
    const jsonLink = document.createElement('a')
    jsonLink.href = jsonUrl
    jsonLink.download = `aegis-complete-data-${new Date().toISOString().split('T')[0]}.json`
    jsonLink.click()
    
    // Create CSV export for accounts
    const csvData = createCSVExport(allData)
    const csvBlob = new Blob([csvData], { type: 'text/csv' })
    const csvUrl = URL.createObjectURL(csvBlob)
    const csvLink = document.createElement('a')
    csvLink.href = csvUrl
    csvLink.download = `aegis-accounts-${new Date().toISOString().split('T')[0]}.csv`
    csvLink.click()
    
    // Create summary report
    const reportData = createSummaryReport(allData)
    const reportBlob = new Blob([reportData], { type: 'text/plain' })
    const reportUrl = URL.createObjectURL(reportBlob)
    const reportLink = document.createElement('a')
    reportLink.href = reportUrl
    reportLink.download = `aegis-summary-report-${new Date().toISOString().split('T')[0]}.txt`
    reportLink.click()
  }

  interface ExportData {
    familyMembers: FamilyMember[];
    accounts: Account[];
    paychecks: Paycheck[];
    dataSummary: {
      familyMembers: number;
      accounts: number;
      paychecks: number;
      totalNetWorth: number;
      totalAssets: number;
      totalLiabilities: number;
    };
    [key: string]: unknown;
  }
  const createCSVExport = (data: ExportData) => {
    let csv = 'Account Name,Type,Institution,Balance,Owner,Notes\n'
    
    // Add accounts
    data.accounts.forEach((account: Account) => {
      csv += `"${account.name}","${account.type}","${account.institution}",${account.balance},"${account.owner}","${account.notes}"\n`
    })
    
    csv += '\nFamily Member,Relationship,Age,Education,Income,Expenses\n'
    
    // Add family members
    data.familyMembers.forEach((member: FamilyMember) => {
      csv += `"${member.name}","${member.relationship}",${member.age},"${member.education}",${member.income},${member.expenses}\n`
    })
    
    csv += '\nPaycheck Date,Employer,Gross Pay,Net Pay,Taxes,Retirement,Insurance\n'
    
    // Add paychecks
    data.paychecks.forEach((paycheck: Paycheck) => {
      csv += `"${paycheck.date}","${paycheck.employer}",${paycheck.grossPay},${paycheck.netPay},${paycheck.deductions.taxes},${paycheck.deductions.retirement},${paycheck.deductions.insurance}\n`
    })
    
    return csv
  }

  const createSummaryReport = (data: ExportData) => {
    let report = 'PROJECT AEGIS - FINANCIAL SUMMARY REPORT\n'
    report += '=' .repeat(50) + '\n\n'
    report += `Generated: ${new Date().toLocaleString()}\n\n`
    
    // Family Summary
    report += 'FAMILY OVERVIEW\n'
    report += '-' .repeat(20) + '\n'
    report += `Total Family Members: ${data.familyMembers.length}\n`
    data.familyMembers.forEach((member: FamilyMember) => {
      report += `• ${member.name} (${member.relationship}): Age ${member.age}, ${member.education}\n`
      report += `  Income: $${member.income.toLocaleString()}, Expenses: $${member.expenses.toLocaleString()}\n`
    })
    report += '\n'
    
    // Financial Summary
    report += 'FINANCIAL ACCOUNTS\n'
    report += '-' .repeat(20) + '\n'
    report += `Total Accounts: ${data.accounts.length}\n`
    report += `Total Assets: $${data.dataSummary.totalAssets.toLocaleString()}\n`
    report += `Total Liabilities: $${data.dataSummary.totalLiabilities.toLocaleString()}\n`
    report += `Net Worth: $${data.dataSummary.totalNetWorth.toLocaleString()}\n\n`
    
    // Account breakdown
    const accountTypes = data.accounts.reduce((acc: Record<string, number>, account: Account) => {
      acc[account.type] = (acc[account.type] || 0) + account.balance
      return acc
    }, {})
    
    Object.entries(accountTypes).forEach(([type, balance]) => {
      report += `${type.charAt(0).toUpperCase() + type.slice(1)}: $${(balance as number).toLocaleString()}\n`
    })
    report += '\n'
    
    // Paycheck Summary
    if (data.paychecks.length > 0) {
      report += 'PAYCHECK SUMMARY\n'
      report += '-' .repeat(20) + '\n'
      const totalGross = data.paychecks.reduce((sum: number, p: Paycheck) => sum + p.grossPay, 0)
      const totalNet = data.paychecks.reduce((sum: number, p: Paycheck) => sum + p.netPay, 0)
      const totalTaxes = data.paychecks.reduce((sum: number, p: Paycheck) => sum + p.deductions.taxes, 0)
      report += `Total Paychecks: ${data.paychecks.length}\n`
      report += `Total Gross Pay: $${totalGross.toLocaleString()}\n`
      report += `Total Net Pay: $${totalNet.toLocaleString()}\n`
      report += `Total Taxes: $${totalTaxes.toLocaleString()}\n`
      report += `Average Tax Rate: ${((totalTaxes / totalGross) * 100).toFixed(1)}%\n\n`
    }
    
    // Recommendations
    report += 'QUICK INSIGHTS\n'
    report += '-' .repeat(20) + '\n'
    
    const debtToAssetRatio = data.dataSummary.totalLiabilities / data.dataSummary.totalAssets
    if (debtToAssetRatio > 0.5) {
      report += '⚠️  High debt-to-asset ratio. Consider debt reduction strategies.\n'
    }
    
    const positiveAccounts = data.accounts.filter((acc: Account) => acc.balance > 0)
    if (positiveAccounts.length < 3) {
      report += '💡 Consider diversifying your accounts across different institutions.\n'
    }
    
    const emergencyFund = data.accounts.find((acc: Account) => acc.type === 'savings')
    if (!emergencyFund || emergencyFund.balance < 10000) {
      report += '💰 Build up your emergency fund to 3-6 months of expenses.\n'
    }
    
    report += '\nThis report was generated by Project Aegis - Your Engine for Personal Agency\n'
    report += 'All data is stored locally on your device for complete privacy.\n'
    
    return report
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setFamilyMembers(data.familyMembers || [])
          setAccounts(data.accounts || [])
          setPaychecks(data.paychecks || [])
        } catch {
          alert('Error importing data. Please check file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const deleteAllData = () => {
    if (confirm('Are you sure you want to delete all data? This will log you out and start fresh. This cannot be undone.')) {
      // Clear all local state
      setIsLoggedIn(false)
      setCurrentUser('')
      setFamilyMembers([])
      setAccounts([])
      setPaychecks([])
      setShowAddMember(false)
      setShowAddAccount(false)
      setShowAddPaycheck(false)
      
      // Clear all localStorage data
      storage.remove(STORAGE_KEYS.USER_LOGGED_IN)
      storage.remove(STORAGE_KEYS.CURRENT_USER)
      storage.remove(STORAGE_KEYS.FAMILY_MEMBERS)
      storage.remove(STORAGE_KEYS.ACCOUNTS)
      storage.remove(STORAGE_KEYS.PAYCHECKS)
      
      // Clear all other Aegis data
      storage.remove('aegis_financial_data')
      storage.remove('aegis_net_worth_data')
      storage.remove('aegis_life_milestones')
      storage.remove('aegis_investments')
      storage.remove('aegis_time_value_calculations')
      storage.remove('aegis_true_cost_calculations')
      storage.remove('aegis_life_context_data')
      storage.remove('aegis_fred_api_key')
      storage.remove('aegis_census_api_key')
      
      // Force page refresh to ensure clean state
      window.location.reload()
    }
  }

  const loadSampleUser = () => {
    // Clear any existing data first
    setFamilyMembers([])
    setAccounts([])
    setPaychecks([])
    
    const sampleMembers: FamilyMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        relationship: 'Self',
        age: 32,
        education: 'Master&apos;s in Business',
        income: 85000,
        expenses: 52000,
        goals: ['Buy first home', 'Max out 401(k)', 'Start emergency fund'],
        accounts: []
      },
      {
        id: '2',
        name: 'Michael Johnson',
        relationship: 'Spouse',
        age: 30,
        education: 'Bachelor&apos;s in Engineering',
        income: 78000,
        expenses: 48000,
        goals: ['Pay off student loans', 'Save for vacation', 'Invest in side business'],
        accounts: []
      },
      {
        id: '3',
        name: 'Emma Johnson',
        relationship: 'Child',
        age: 5,
        education: 'Kindergarten',
        income: 0,
        expenses: 15000,
        goals: ['College fund', 'Summer activities', 'Music lessons'],
        accounts: []
      }
    ]

    const sampleAccounts: Account[] = [
      {
        id: '1',
        name: 'Primary Checking',
        type: 'checking',
        institution: 'Chase Bank',
        balance: 12500,
        owner: 'Sarah Johnson',
        notes: 'Main account for bills and daily expenses'
      },
      {
        id: '2',
        name: 'Emergency Fund',
        type: 'savings',
        institution: 'Ally Bank',
        balance: 25000,
        interestRate: 4.25,
        owner: 'Sarah Johnson',
        notes: 'High-yield savings for emergencies'
      },
      {
        id: '3',
        name: '401(k) Retirement',
        type: 'retirement',
        institution: 'Fidelity',
        balance: 45000,
        owner: 'Sarah Johnson',
        notes: 'Employer-sponsored retirement plan'
      },
      {
        id: '4',
        name: 'Roth IRA',
        type: 'investment',
        institution: 'Vanguard',
        balance: 18000,
        owner: 'Sarah Johnson',
        notes: 'Tax-advantaged retirement savings'
      },
      {
        id: '5',
        name: 'Spouse Checking',
        type: 'checking',
        institution: 'Wells Fargo',
        balance: 8200,
        owner: 'Michael Johnson',
        notes: 'Michael&apos;s primary account'
      },
      {
        id: '6',
        name: 'Student Loan',
        type: 'loan',
        institution: 'Sallie Mae',
        balance: -35000,
        interestRate: 5.8,
        monthlyPayment: 450,
        owner: 'Michael Johnson',
        notes: 'Federal student loans'
      },
      {
        id: '7',
        name: 'Credit Card',
        type: 'credit',
        institution: 'American Express',
        balance: -2800,
        interestRate: 18.99,
        monthlyPayment: 150,
        owner: 'Sarah Johnson',
        notes: 'Travel rewards card'
      },
      {
        id: '8',
        name: '529 College Fund',
        type: 'investment',
        institution: 'Schwab',
        balance: 8500,
        owner: 'Emma Johnson',
        notes: 'Tax-advantaged college savings'
      }
    ]

    const samplePaychecks: Paycheck[] = [
      {
        id: '1',
        date: '2024-01-15',
        grossPay: 3269.23,
        netPay: 2451.92,
        deductions: {
          taxes: 490.38,
          retirement: 326.92,
          insurance: 245.19,
          other: 155.74
        },
        employer: 'TechCorp Inc.',
        notes: 'Bi-weekly paycheck'
      },
      {
        id: '2',
        date: '2024-01-01',
        grossPay: 3269.23,
        netPay: 2451.92,
        deductions: {
          taxes: 490.38,
          retirement: 326.92,
          insurance: 245.19,
          other: 155.74
        },
        employer: 'TechCorp Inc.',
        notes: 'Bi-weekly paycheck'
      },
      {
        id: '3',
        date: '2024-01-15',
        grossPay: 3000.00,
        netPay: 2250.00,
        deductions: {
          taxes: 450.00,
          retirement: 300.00,
          insurance: 225.00,
          other: 175.00
        },
        employer: 'Engineering Solutions',
        notes: 'Michael&apos;s bi-weekly paycheck'
      }
    ]

    // Set sample data
    setFamilyMembers(sampleMembers)
    setAccounts(sampleAccounts)
    setPaychecks(samplePaychecks)
    
    // Log in as sample user
    setIsLoggedIn(true)
    setCurrentUser('Sample User - Sarah Johnson')
    storage.set(STORAGE_KEYS.USER_LOGGED_IN, true)
    storage.set(STORAGE_KEYS.CURRENT_USER, 'Sample User - Sarah Johnson')
    storage.set(STORAGE_KEYS.FAMILY_MEMBERS, sampleMembers)
    storage.set(STORAGE_KEYS.ACCOUNTS, sampleAccounts)
    storage.set(STORAGE_KEYS.PAYCHECKS, samplePaychecks)
  }

  // Handlers for Family Member
  const handleMemberFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value })
  }
  const handleAddOrEditMember = () => {
    if (!memberForm.name) return
    if (editingMemberId) {
      setFamilyMembers(familyMembers.map(m => m.id === editingMemberId ? {
        ...m,
        ...memberForm,
        age: Number(memberForm.age),
        income: Number(memberForm.income),
        expenses: Number(memberForm.expenses),
        goals: memberForm.goals.split(',').map(g => g.trim())
      } : m))
      setEditingMemberId(null)
    } else {
      setFamilyMembers([
        ...familyMembers,
        {
          id: generateId(),
          name: memberForm.name,
          relationship: memberForm.relationship,
          age: Number(memberForm.age),
          education: memberForm.education,
          income: Number(memberForm.income),
          expenses: Number(memberForm.expenses),
          goals: memberForm.goals.split(',').map(g => g.trim()),
          accounts: []
        }
      ])
    }
    setShowAddMember(false)
    setMemberForm({ id: '', name: '', relationship: '', age: '', education: '', income: '', expenses: '', goals: '' })
  }
  const handleEditMember = (member: FamilyMember) => {
    setEditingMemberId(member.id)
    setShowAddMember(true)
    setMemberForm({
      id: member.id,
      name: member.name,
      relationship: member.relationship,
      age: member.age.toString(),
      education: member.education,
      income: member.income.toString(),
      expenses: member.expenses.toString(),
      goals: member.goals.join(', ')
    })
  }
  const handleDeleteMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id))
  }

  // Handlers for Account
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value })
  }
  const handleAddOrEditAccount = () => {
    if (!accountForm.name) return
    if (editingAccountId) {
      setAccounts(accounts.map(a => a.id === editingAccountId ? {
        ...a,
        ...accountForm,
        type: toAccountType(accountForm.type),
        balance: Number(accountForm.balance),
        interestRate: accountForm.interestRate ? Number(accountForm.interestRate) : undefined,
        monthlyPayment: accountForm.monthlyPayment ? Number(accountForm.monthlyPayment) : undefined
      } : a))
      setEditingAccountId(null)
    } else {
      setAccounts([
        ...accounts,
        {
          id: generateId(),
          name: accountForm.name,
          type: toAccountType(accountForm.type),
          institution: accountForm.institution,
          balance: Number(accountForm.balance),
          interestRate: accountForm.interestRate ? Number(accountForm.interestRate) : undefined,
          monthlyPayment: accountForm.monthlyPayment ? Number(accountForm.monthlyPayment) : undefined,
          owner: accountForm.owner,
          notes: accountForm.notes
        } as Account
      ])
    }
    setShowAddAccount(false)
    setAccountForm({ id: '', name: '', type: 'checking', institution: '', balance: '', interestRate: '', monthlyPayment: '', owner: '', notes: '' })
  }
  const handleEditAccount = (account: Account) => {
    setEditingAccountId(account.id)
    setShowAddAccount(true)
    setAccountForm({
      id: account.id,
      name: account.name,
      type: account.type,
      institution: account.institution,
      balance: account.balance.toString(),
      interestRate: account.interestRate?.toString() || '',
      monthlyPayment: account.monthlyPayment?.toString() || '',
      owner: account.owner,
      notes: account.notes
    })
  }
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id))
  }

  // Handlers for Paycheck
  const handlePaycheckFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaycheckForm({ ...paycheckForm, [e.target.name]: e.target.value })
  }
  const handleAddOrEditPaycheck = () => {
    if (!paycheckForm.date || !paycheckForm.grossPay) return
    if (editingPaycheckId) {
      setPaychecks(paychecks.map(p => p.id === editingPaycheckId ? {
        ...p,
        ...paycheckForm,
        grossPay: Number(paycheckForm.grossPay),
        netPay: Number(paycheckForm.netPay),
        deductions: {
          taxes: Number(paycheckForm.taxes),
          retirement: Number(paycheckForm.retirement),
          insurance: Number(paycheckForm.insurance),
          other: Number(paycheckForm.other)
        }
      } : p))
      setEditingPaycheckId(null)
    } else {
      setPaychecks([
        ...paychecks,
        {
          id: generateId(),
          date: paycheckForm.date,
          grossPay: Number(paycheckForm.grossPay),
          netPay: Number(paycheckForm.netPay),
          deductions: {
            taxes: Number(paycheckForm.taxes),
            retirement: Number(paycheckForm.retirement),
            insurance: Number(paycheckForm.insurance),
            other: Number(paycheckForm.other)
          },
          employer: paycheckForm.employer,
          notes: paycheckForm.notes
        }
      ])
    }
    setShowAddPaycheck(false)
    setPaycheckForm({ id: '', date: '', grossPay: '', netPay: '', taxes: '', retirement: '', insurance: '', other: '', employer: '', notes: '' })
  }
  const handleEditPaycheck = (paycheck: Paycheck) => {
    setEditingPaycheckId(paycheck.id)
    setShowAddPaycheck(true)
    setPaycheckForm({
      id: paycheck.id,
      date: paycheck.date,
      grossPay: paycheck.grossPay.toString(),
      netPay: paycheck.netPay.toString(),
      taxes: paycheck.deductions.taxes.toString(),
      retirement: paycheck.deductions.retirement.toString(),
      insurance: paycheck.deductions.insurance.toString(),
      other: paycheck.deductions.other.toString(),
      employer: paycheck.employer,
      notes: paycheck.notes
    })
  }
  const handleDeletePaycheck = (id: string) => {
    setPaychecks(paychecks.filter(p => p.id !== id))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="aegis-card max-w-md w-full">
          <div className="text-center">
            <Shield className="h-12 w-12 text-aegis-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Project Aegis</h2>
            <p className="text-gray-600 mb-6">Your engine for personal agency and wealth generation</p>
            
            <div className="space-y-3">
              <button
                onClick={startFreshWithBlankData}
                className="aegis-button w-full"
              >
                Start Fresh with Blank Data
              </button>
              
              <button
                onClick={startFreshWithSampleData}
                className="aegis-button-secondary w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Start Fresh with Sample Data
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Choose Your Start:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>Blank Data:</strong> Start completely fresh with no pre-filled information</li>
                <li><strong>Sample Data:</strong> Explore with realistic family profile and financial accounts</li>
                <li>• Complete family profile with realistic data</li>
                <li>• 8 different account types (checking, savings, investments, loans)</li>
                <li>• Sample paycheck data with deductions</li>
                <li>• Explore all Project Aegis features safely</li>
                <li>• Data is temporary and won&apos;t be saved</li>
              </ul>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              All data is stored locally on your device for complete privacy
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Manager</h2>
          <p className="text-gray-600">Manage your family, accounts, and financial data</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-sm text-gray-600">Welcome, {currentUser}</span>
            {currentUser.includes('Sample User') && (
              <div className="text-xs text-blue-600 font-medium flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Sample Mode</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="aegis-button-secondary flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sample User Notice */}
      {currentUser.includes('Sample User') && (
        <div className="aegis-card bg-blue-50 border border-blue-200">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Sample User Mode</h4>
              <p className="text-sm text-blue-800">
                You&apos;re exploring Project Aegis with sample data. This data is temporary and won&apos;t be permanently saved. 
                Feel free to modify, add, or delete data to see how the app works!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-aegis-600" />
          <span>Data Management</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="aegis-button-secondary flex items-center justify-center space-x-2 w-full"
            >
              <Download className="h-4 w-4" />
              <span>Export All Data</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              Downloads JSON, CSV, and summary report
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="aegis-button-secondary flex items-center justify-center space-x-2 cursor-pointer w-full">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Restore from backup JSON file
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={deleteAllData}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete All Data</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              Permanently remove all data
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Export includes:</strong> Family members, accounts, paychecks, financial data, net worth tracking, time value calculations, and life context data. All data is stored locally in your browser for complete privacy.
          </p>
        </div>
      </div>

      {/* Family Members */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="h-5 w-5 text-liberty-600" />
            <span>Family Members</span>
          </h3>
          <button
            onClick={() => { setShowAddMember(!showAddMember); setEditingMemberId(null); setMemberForm({ id: '', name: '', relationship: '', age: '', education: '', income: '', expenses: '', goals: '' }) }}
            className="aegis-button text-sm flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddMember && !editingMemberId ? 'Cancel' : 'Add Member'}</span>
          </button>
        </div>
        {showAddMember && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={memberForm.name} onChange={handleMemberFormChange} placeholder="Name" className="px-3 py-2 border rounded-lg" />
              <input name="relationship" value={memberForm.relationship} onChange={handleMemberFormChange} placeholder="Relationship" className="px-3 py-2 border rounded-lg" />
              <input name="age" value={memberForm.age} onChange={handleMemberFormChange} placeholder="Age" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="education" value={memberForm.education} onChange={handleMemberFormChange} placeholder="Education" className="px-3 py-2 border rounded-lg" />
              <input name="income" value={memberForm.income} onChange={handleMemberFormChange} placeholder="Income" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="expenses" value={memberForm.expenses} onChange={handleMemberFormChange} placeholder="Expenses" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="goals" value={memberForm.goals} onChange={handleMemberFormChange} placeholder="Goals (comma separated)" className="px-3 py-2 border rounded-lg col-span-2" />
            </div>
            <div className="mt-4 flex space-x-2">
              <button onClick={handleAddOrEditMember} className="aegis-button">{editingMemberId ? 'Save Changes' : 'Add Member'}</button>
              <button onClick={() => { setShowAddMember(false); setEditingMemberId(null); setMemberForm({ id: '', name: '', relationship: '', age: '', education: '', income: '', expenses: '', goals: '' }) }} className="aegis-button-secondary">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <User className="h-6 w-6 text-aegis-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{member.relationship}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Age:</span><span className="font-medium">{member.age}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Education:</span><span className="font-medium">{member.education}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Income:</span><span className="font-medium">${member.income.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Expenses:</span><span className="font-medium">${member.expenses.toLocaleString()}</span></div>
              </div>
              {member.goals.length > 0 && (
                <div className="mt-3"><div className="text-xs font-medium text-gray-700 mb-1">Goals:</div><div className="space-y-1">{member.goals.slice(0, 2).map((goal, index) => (<div key={index} className="text-xs text-gray-600">• {goal}</div>))}</div></div>
              )}
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleEditMember(member)} className="aegis-button-secondary text-xs">Edit</button>
                <button onClick={() => handleDeleteMember(member.id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-1 px-3 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Accounts */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Save className="h-5 w-5 text-green-600" />
            <span>Financial Accounts</span>
          </h3>
          <button
            onClick={() => { setShowAddAccount(!showAddAccount); setEditingAccountId(null); setAccountForm({ id: '', name: '', type: 'checking', institution: '', balance: '', interestRate: '', monthlyPayment: '', owner: '', notes: '' }) }}
            className="aegis-button text-sm flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddAccount && !editingAccountId ? 'Cancel' : 'Add Account'}</span>
          </button>
        </div>
        {showAddAccount && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={accountForm.name} onChange={handleAccountFormChange} placeholder="Account Name" className="px-3 py-2 border rounded-lg" />
              <select name="type" value={accountForm.type} onChange={handleAccountFormChange} className="px-3 py-2 border rounded-lg">
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="retirement">Retirement</option>
                <option value="credit">Credit</option>
                <option value="loan">Loan</option>
                <option value="other">Other</option>
              </select>
              <input name="institution" value={accountForm.institution} onChange={handleAccountFormChange} placeholder="Institution" className="px-3 py-2 border rounded-lg" />
              <input name="balance" value={accountForm.balance} onChange={handleAccountFormChange} placeholder="Balance" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="interestRate" value={accountForm.interestRate} onChange={handleAccountFormChange} placeholder="Interest Rate (%)" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="monthlyPayment" value={accountForm.monthlyPayment} onChange={handleAccountFormChange} placeholder="Monthly Payment" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="owner" value={accountForm.owner} onChange={handleAccountFormChange} placeholder="Owner" className="px-3 py-2 border rounded-lg" />
              <input name="notes" value={accountForm.notes} onChange={handleAccountFormChange} placeholder="Notes" className="px-3 py-2 border rounded-lg col-span-2" />
            </div>
            <div className="mt-4 flex space-x-2">
              <button onClick={handleAddOrEditAccount} className="aegis-button">{editingAccountId ? 'Save Changes' : 'Add Account'}</button>
              <button onClick={() => { setShowAddAccount(false); setEditingAccountId(null); setAccountForm({ id: '', name: '', type: 'checking', institution: '', balance: '', interestRate: '', monthlyPayment: '', owner: '', notes: '' }) }} className="aegis-button-secondary">Cancel</button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Account</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Institution</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{account.name}</div>
                      {account.notes && (<div className="text-xs text-gray-500">{account.notes}</div>)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      account.type === 'checking' ? 'bg-blue-100 text-blue-800' :
                      account.type === 'savings' ? 'bg-green-100 text-green-800' :
                      account.type === 'investment' ? 'bg-purple-100 text-purple-800' :
                      account.type === 'retirement' ? 'bg-orange-100 text-orange-800' :
                      account.type === 'credit' ? 'bg-red-100 text-red-800' :
                      account.type === 'loan' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.institution}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>${account.balance.toLocaleString()}</span>
                    {account.interestRate && (<div className="text-xs text-gray-500">{account.interestRate}% APR</div>)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.owner}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEditAccount(account)} className="aegis-button-secondary text-xs mr-2">Edit</button>
                    <button onClick={() => handleDeleteAccount(account.id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-1 px-3 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paycheck Tracking */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Save className="h-5 w-5 text-blue-600" />
            <span>Paycheck Tracking</span>
          </h3>
          <button
            onClick={() => { setShowAddPaycheck(!showAddPaycheck); setEditingPaycheckId(null); setPaycheckForm({ id: '', date: '', grossPay: '', netPay: '', taxes: '', retirement: '', insurance: '', other: '', employer: '', notes: '' }) }}
            className="aegis-button text-sm flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{showAddPaycheck && !editingPaycheckId ? 'Cancel' : 'Add Paycheck'}</span>
          </button>
        </div>
        {showAddPaycheck && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="date" value={paycheckForm.date} onChange={handlePaycheckFormChange} placeholder="Date (YYYY-MM-DD)" className="px-3 py-2 border rounded-lg" />
              <input name="employer" value={paycheckForm.employer} onChange={handlePaycheckFormChange} placeholder="Employer" className="px-3 py-2 border rounded-lg" />
              <input name="grossPay" value={paycheckForm.grossPay} onChange={handlePaycheckFormChange} placeholder="Gross Pay" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="netPay" value={paycheckForm.netPay} onChange={handlePaycheckFormChange} placeholder="Net Pay" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="taxes" value={paycheckForm.taxes} onChange={handlePaycheckFormChange} placeholder="Taxes" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="retirement" value={paycheckForm.retirement} onChange={handlePaycheckFormChange} placeholder="Retirement" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="insurance" value={paycheckForm.insurance} onChange={handlePaycheckFormChange} placeholder="Insurance" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="other" value={paycheckForm.other} onChange={handlePaycheckFormChange} placeholder="Other Deductions" type="number" className="px-3 py-2 border rounded-lg" />
              <input name="notes" value={paycheckForm.notes} onChange={handlePaycheckFormChange} placeholder="Notes" className="px-3 py-2 border rounded-lg col-span-2" />
            </div>
            <div className="mt-4 flex space-x-2">
              <button onClick={handleAddOrEditPaycheck} className="aegis-button">{editingPaycheckId ? 'Save Changes' : 'Add Paycheck'}</button>
              <button onClick={() => { setShowAddPaycheck(false); setEditingPaycheckId(null); setPaycheckForm({ id: '', date: '', grossPay: '', netPay: '', taxes: '', retirement: '', insurance: '', other: '', employer: '', notes: '' }) }} className="aegis-button-secondary">Cancel</button>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {paychecks.map((paycheck) => (
            <div key={paycheck.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{paycheck.employer}</h4>
                  <p className="text-sm text-gray-600">{paycheck.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${paycheck.netPay.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Net Pay</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-600">Gross Pay:</span><div className="font-medium">${paycheck.grossPay.toLocaleString()}</div></div>
                <div><span className="text-gray-600">Taxes:</span><div className="font-medium">${paycheck.deductions.taxes.toLocaleString()}</div></div>
                <div><span className="text-gray-600">Retirement:</span><div className="font-medium">${paycheck.deductions.retirement.toLocaleString()}</div></div>
                <div><span className="text-gray-600">Insurance:</span><div className="font-medium">${paycheck.deductions.insurance.toLocaleString()}</div></div>
              </div>
              {paycheck.notes && (<div className="mt-3 text-sm text-gray-600"><span className="font-medium">Notes:</span> {paycheck.notes}</div>)}
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleEditPaycheck(paycheck)} className="aegis-button-secondary text-xs">Edit</button>
                <button onClick={() => handleDeletePaycheck(paycheck.id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-1 px-3 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="aegis-card hover:bg-aegis-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-aegis-600" />
              <div>
                <div className="font-semibold text-gray-900">Add Family Member</div>
                <div className="text-sm text-gray-600">Track spouse, children, dependents</div>
              </div>
            </div>
          </button>
          
          <button className="aegis-card hover:bg-aegis-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Save className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900">Add Account</div>
                <div className="text-sm text-gray-600">Bank accounts, investments, loans</div>
              </div>
            </div>
          </button>
          
          <button className="aegis-card hover:bg-aegis-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Save className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">Add Paycheck</div>
                <div className="text-sm text-gray-600">Track income and deductions</div>
              </div>
            </div>
          </button>
          
          <button className="aegis-card hover:bg-aegis-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-900">Backup Data</div>
                <div className="text-sm text-gray-600">Export your financial data</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
} 