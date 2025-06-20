export interface Location {
  code: string
  name: string
  type: 'state' | 'territory' | 'district'
  region: string
  timezone: string
  gasTax: number
  salesTax: number
  incomeTax: number
  propertyTax: number
}

export const US_LOCATIONS: Location[] = [
  // States
  { code: 'AL', name: 'Alabama', type: 'state', region: 'Southeast', timezone: 'CST', gasTax: 0.28, salesTax: 4.0, incomeTax: 5.0, propertyTax: 0.41 },
  { code: 'AK', name: 'Alaska', type: 'state', region: 'West', timezone: 'AKST', gasTax: 0.0895, salesTax: 0.0, incomeTax: 0.0, propertyTax: 1.19 },
  { code: 'AZ', name: 'Arizona', type: 'state', region: 'Southwest', timezone: 'MST', gasTax: 0.19, salesTax: 5.6, incomeTax: 2.59, propertyTax: 0.62 },
  { code: 'AR', name: 'Arkansas', type: 'state', region: 'Southeast', timezone: 'CST', gasTax: 0.245, salesTax: 6.5, incomeTax: 4.9, propertyTax: 0.63 },
  { code: 'CA', name: 'California', type: 'state', region: 'West', timezone: 'PST', gasTax: 0.51, salesTax: 7.25, incomeTax: 13.3, propertyTax: 0.76 },
  { code: 'CO', name: 'Colorado', type: 'state', region: 'West', timezone: 'MST', gasTax: 0.22, salesTax: 2.9, incomeTax: 4.55, propertyTax: 0.51 },
  { code: 'CT', name: 'Connecticut', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.25, salesTax: 6.35, incomeTax: 6.99, propertyTax: 1.73 },
  { code: 'DE', name: 'Delaware', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.23, salesTax: 0.0, incomeTax: 6.6, propertyTax: 0.57 },
  { code: 'FL', name: 'Florida', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.04, salesTax: 6.0, incomeTax: 0.0, propertyTax: 0.89 },
  { code: 'GA', name: 'Georgia', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.287, salesTax: 4.0, incomeTax: 5.75, propertyTax: 0.87 },
  { code: 'HI', name: 'Hawaii', type: 'state', region: 'West', timezone: 'HST', gasTax: 0.16, salesTax: 4.0, incomeTax: 11.0, propertyTax: 0.28 },
  { code: 'ID', name: 'Idaho', type: 'state', region: 'West', timezone: 'MST', gasTax: 0.32, salesTax: 6.0, incomeTax: 5.8, propertyTax: 0.69 },
  { code: 'IL', name: 'Illinois', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.39, salesTax: 6.25, incomeTax: 4.95, propertyTax: 2.27 },
  { code: 'IN', name: 'Indiana', type: 'state', region: 'Midwest', timezone: 'EST', gasTax: 0.33, salesTax: 7.0, incomeTax: 3.23, propertyTax: 0.85 },
  { code: 'IA', name: 'Iowa', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.30, salesTax: 6.0, incomeTax: 5.7, propertyTax: 1.53 },
  { code: 'KS', name: 'Kansas', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.24, salesTax: 6.5, incomeTax: 5.7, propertyTax: 1.29 },
  { code: 'KY', name: 'Kentucky', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.26, salesTax: 6.0, incomeTax: 5.0, propertyTax: 0.86 },
  { code: 'LA', name: 'Louisiana', type: 'state', region: 'Southeast', timezone: 'CST', gasTax: 0.20, salesTax: 4.45, incomeTax: 4.25, propertyTax: 0.55 },
  { code: 'ME', name: 'Maine', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.30, salesTax: 5.5, incomeTax: 7.15, propertyTax: 1.09 },
  { code: 'MD', name: 'Maryland', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.36, salesTax: 6.0, incomeTax: 5.75, propertyTax: 1.09 },
  { code: 'MA', name: 'Massachusetts', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.24, salesTax: 6.25, incomeTax: 5.0, propertyTax: 1.23 },
  { code: 'MI', name: 'Michigan', type: 'state', region: 'Midwest', timezone: 'EST', gasTax: 0.27, salesTax: 6.0, incomeTax: 4.25, propertyTax: 1.54 },
  { code: 'MN', name: 'Minnesota', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.285, salesTax: 6.875, incomeTax: 9.85, propertyTax: 1.05 },
  { code: 'MS', name: 'Mississippi', type: 'state', region: 'Southeast', timezone: 'CST', gasTax: 0.18, salesTax: 7.0, incomeTax: 5.0, propertyTax: 0.81 },
  { code: 'MO', name: 'Missouri', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.17, salesTax: 4.225, incomeTax: 4.95, propertyTax: 0.99 },
  { code: 'MT', name: 'Montana', type: 'state', region: 'West', timezone: 'MST', gasTax: 0.32, salesTax: 0.0, incomeTax: 6.75, propertyTax: 0.84 },
  { code: 'NE', name: 'Nebraska', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.285, salesTax: 5.5, incomeTax: 6.84, propertyTax: 1.65 },
  { code: 'NV', name: 'Nevada', type: 'state', region: 'West', timezone: 'PST', gasTax: 0.23, salesTax: 6.85, incomeTax: 0.0, propertyTax: 0.60 },
  { code: 'NH', name: 'New Hampshire', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.22, salesTax: 0.0, incomeTax: 0.0, propertyTax: 2.18 },
  { code: 'NJ', name: 'New Jersey', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.42, salesTax: 6.625, incomeTax: 10.75, propertyTax: 2.49 },
  { code: 'NM', name: 'New Mexico', type: 'state', region: 'Southwest', timezone: 'MST', gasTax: 0.17, salesTax: 5.125, incomeTax: 5.9, propertyTax: 0.80 },
  { code: 'NY', name: 'New York', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.17, salesTax: 4.0, incomeTax: 8.82, propertyTax: 1.40 },
  { code: 'NC', name: 'North Carolina', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.36, salesTax: 4.75, incomeTax: 4.99, propertyTax: 0.84 },
  { code: 'ND', name: 'North Dakota', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.23, salesTax: 5.0, incomeTax: 2.9, propertyTax: 0.99 },
  { code: 'OH', name: 'Ohio', type: 'state', region: 'Midwest', timezone: 'EST', gasTax: 0.385, salesTax: 5.75, incomeTax: 3.99, propertyTax: 1.56 },
  { code: 'OK', name: 'Oklahoma', type: 'state', region: 'Southwest', timezone: 'CST', gasTax: 0.19, salesTax: 4.5, incomeTax: 5.0, propertyTax: 0.87 },
  { code: 'OR', name: 'Oregon', type: 'state', region: 'West', timezone: 'PST', gasTax: 0.38, salesTax: 0.0, incomeTax: 9.9, propertyTax: 0.97 },
  { code: 'PA', name: 'Pennsylvania', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.58, salesTax: 6.0, incomeTax: 3.07, propertyTax: 1.58 },
  { code: 'RI', name: 'Rhode Island', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.34, salesTax: 7.0, incomeTax: 5.99, propertyTax: 1.53 },
  { code: 'SC', name: 'South Carolina', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.26, salesTax: 6.0, incomeTax: 7.0, propertyTax: 0.57 },
  { code: 'SD', name: 'South Dakota', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.28, salesTax: 4.5, incomeTax: 0.0, propertyTax: 1.31 },
  { code: 'TN', name: 'Tennessee', type: 'state', region: 'Southeast', timezone: 'CST', gasTax: 0.26, salesTax: 7.0, incomeTax: 0.0, propertyTax: 0.71 },
  { code: 'TX', name: 'Texas', type: 'state', region: 'Southwest', timezone: 'CST', gasTax: 0.20, salesTax: 6.25, incomeTax: 0.0, propertyTax: 1.69 },
  { code: 'UT', name: 'Utah', type: 'state', region: 'West', timezone: 'MST', gasTax: 0.31, salesTax: 6.1, incomeTax: 4.85, propertyTax: 0.63 },
  { code: 'VT', name: 'Vermont', type: 'state', region: 'Northeast', timezone: 'EST', gasTax: 0.31, salesTax: 6.0, incomeTax: 8.75, propertyTax: 1.90 },
  { code: 'VA', name: 'Virginia', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.26, salesTax: 5.3, incomeTax: 5.75, propertyTax: 0.82 },
  { code: 'WA', name: 'Washington', type: 'state', region: 'West', timezone: 'PST', gasTax: 0.49, salesTax: 6.5, incomeTax: 0.0, propertyTax: 0.98 },
  { code: 'WV', name: 'West Virginia', type: 'state', region: 'Southeast', timezone: 'EST', gasTax: 0.36, salesTax: 6.0, incomeTax: 6.5, propertyTax: 0.59 },
  { code: 'WI', name: 'Wisconsin', type: 'state', region: 'Midwest', timezone: 'CST', gasTax: 0.33, salesTax: 5.0, incomeTax: 7.65, propertyTax: 1.68 },
  { code: 'WY', name: 'Wyoming', type: 'state', region: 'West', timezone: 'MST', gasTax: 0.24, salesTax: 4.0, incomeTax: 0.0, propertyTax: 0.61 },
  
  // District
  { code: 'DC', name: 'District of Columbia', type: 'district', region: 'Northeast', timezone: 'EST', gasTax: 0.235, salesTax: 6.0, incomeTax: 8.95, propertyTax: 0.55 },
  
  // Territories
  { code: 'AS', name: 'American Samoa', type: 'territory', region: 'Pacific', timezone: 'SST', gasTax: 0.16, salesTax: 0.0, incomeTax: 0.0, propertyTax: 0.0 },
  { code: 'GU', name: 'Guam', type: 'territory', region: 'Pacific', timezone: 'ChST', gasTax: 0.04, salesTax: 4.0, incomeTax: 0.0, propertyTax: 0.0 },
  { code: 'MP', name: 'Northern Mariana Islands', type: 'territory', region: 'Pacific', timezone: 'ChST', gasTax: 0.04, salesTax: 0.0, incomeTax: 0.0, propertyTax: 0.0 },
  { code: 'PR', name: 'Puerto Rico', type: 'territory', region: 'Caribbean', timezone: 'AST', gasTax: 0.16, salesTax: 11.5, incomeTax: 0.0, propertyTax: 0.0 },
  { code: 'VI', name: 'U.S. Virgin Islands', type: 'territory', region: 'Caribbean', timezone: 'AST', gasTax: 0.14, salesTax: 0.0, incomeTax: 0.0, propertyTax: 0.0 }
]

export const getLocationByCode = (code: string): Location | undefined => {
  return US_LOCATIONS.find(loc => loc.code === code)
}

export const getDefaultLocation = (): Location => {
  return US_LOCATIONS.find(loc => loc.code === 'CA') || US_LOCATIONS[0]
} 