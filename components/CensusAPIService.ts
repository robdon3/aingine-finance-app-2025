export interface CensusData {
  state: string
  stateCode: string
  population?: number
  medianIncome?: number
  povertyRate?: number
  housingUnits?: number
  lastUpdated: string
  source: string
}

// Public Census data from 2020 Census and other public sources
const publicCensusData: Record<string, any> = {
  'AL': { 
    population: 5024279, 
    name: 'Alabama',
    medianIncome: 54263,
    povertyRate: 15.5,
    housingUnits: 2230000
  },
  'AK': { 
    population: 733391, 
    name: 'Alaska',
    medianIncome: 77340,
    povertyRate: 10.2,
    housingUnits: 320000
  },
  'AZ': { 
    population: 7151502, 
    name: 'Arizona',
    medianIncome: 65275,
    povertyRate: 13.5,
    housingUnits: 3100000
  },
  'AR': { 
    population: 3011524, 
    name: 'Arkansas',
    medianIncome: 52225,
    povertyRate: 16.2,
    housingUnits: 1350000
  },
  'CA': { 
    population: 39538223, 
    name: 'California',
    medianIncome: 84116,
    povertyRate: 12.3,
    housingUnits: 14500000
  },
  'CO': { 
    population: 5773714, 
    name: 'Colorado',
    medianIncome: 77489,
    povertyRate: 10.3,
    housingUnits: 2500000
  },
  'CT': { 
    population: 3605944, 
    name: 'Connecticut',
    medianIncome: 83328,
    povertyRate: 10.0,
    housingUnits: 1500000
  },
  'DE': { 
    population: 989948, 
    name: 'Delaware',
    medianIncome: 72231,
    povertyRate: 11.3,
    housingUnits: 450000
  },
  'FL': { 
    population: 21538187, 
    name: 'Florida',
    medianIncome: 61447,
    povertyRate: 13.6,
    housingUnits: 10000000
  },
  'GA': { 
    population: 10711908, 
    name: 'Georgia',
    medianIncome: 61820,
    povertyRate: 14.3,
    housingUnits: 4500000
  },
  'HI': { 
    population: 1455271, 
    name: 'Hawaii',
    medianIncome: 88485,
    povertyRate: 9.3,
    housingUnits: 550000
  },
  'ID': { 
    population: 1839106, 
    name: 'Idaho',
    medianIncome: 60729,
    povertyRate: 11.2,
    housingUnits: 750000
  },
  'IL': { 
    population: 12812508, 
    name: 'Illinois',
    medianIncome: 72463,
    povertyRate: 12.1,
    housingUnits: 5500000
  },
  'IN': { 
    population: 6785528, 
    name: 'Indiana',
    medianIncome: 62243,
    povertyRate: 13.1,
    housingUnits: 2900000
  },
  'IA': { 
    population: 3190369, 
    name: 'Iowa',
    medianIncome: 65700,
    povertyRate: 11.2,
    housingUnits: 1400000
  },
  'KS': { 
    population: 2937880, 
    name: 'Kansas',
    medianIncome: 64264,
    povertyRate: 11.9,
    housingUnits: 1300000
  },
  'KY': { 
    population: 4505836, 
    name: 'Kentucky',
    medianIncome: 55290,
    povertyRate: 16.3,
    housingUnits: 2000000
  },
  'LA': { 
    population: 4657757, 
    name: 'Louisiana',
    medianIncome: 51973,
    povertyRate: 19.0,
    housingUnits: 2100000
  },
  'ME': { 
    population: 1362359, 
    name: 'Maine',
    medianIncome: 63489,
    povertyRate: 11.8,
    housingUnits: 650000
  },
  'MD': { 
    population: 6177224, 
    name: 'Maryland',
    medianIncome: 91431,
    povertyRate: 9.0,
    housingUnits: 2500000
  },
  'MA': { 
    population: 7029917, 
    name: 'Massachusetts',
    medianIncome: 89445,
    povertyRate: 10.3,
    housingUnits: 2900000
  },
  'MI': { 
    population: 10077331, 
    name: 'Michigan',
    medianIncome: 63202,
    povertyRate: 13.0,
    housingUnits: 4500000
  },
  'MN': { 
    population: 5706494, 
    name: 'Minnesota',
    medianIncome: 74282,
    povertyRate: 9.0,
    housingUnits: 2500000
  },
  'MS': { 
    population: 2961279, 
    name: 'Mississippi',
    medianIncome: 48511,
    povertyRate: 19.6,
    housingUnits: 1300000
  },
  'MO': { 
    population: 6154913, 
    name: 'Missouri',
    medianIncome: 61243,
    povertyRate: 13.2,
    housingUnits: 2800000
  },
  'MT': { 
    population: 1084225, 
    name: 'Montana',
    medianIncome: 60760,
    povertyRate: 12.9,
    housingUnits: 500000
  },
  'NE': { 
    population: 1961504, 
    name: 'Nebraska',
    medianIncome: 66344,
    povertyRate: 10.8,
    housingUnits: 850000
  },
  'NV': { 
    population: 3104614, 
    name: 'Nevada',
    medianIncome: 63584,
    povertyRate: 13.0,
    housingUnits: 1300000
  },
  'NH': { 
    population: 1377529, 
    name: 'New Hampshire',
    medianIncome: 77449,
    povertyRate: 7.3,
    housingUnits: 600000
  },
  'NJ': { 
    population: 9288994, 
    name: 'New Jersey',
    medianIncome: 89503,
    povertyRate: 9.2,
    housingUnits: 3800000
  },
  'NM': { 
    population: 2117522, 
    name: 'New Mexico',
    medianIncome: 54340,
    povertyRate: 18.2,
    housingUnits: 900000
  },
  'NY': { 
    population: 20201249, 
    name: 'New York',
    medianIncome: 75268,
    povertyRate: 13.6,
    housingUnits: 8500000
  },
  'NC': { 
    population: 10439388, 
    name: 'North Carolina',
    medianIncome: 60206,
    povertyRate: 13.6,
    housingUnits: 4700000
  },
  'ND': { 
    population: 779094, 
    name: 'North Dakota',
    medianIncome: 68637,
    povertyRate: 10.6,
    housingUnits: 350000
  },
  'OH': { 
    population: 11799448, 
    name: 'Ohio',
    medianIncome: 61602,
    povertyRate: 13.1,
    housingUnits: 5200000
  },
  'OK': { 
    population: 3959353, 
    name: 'Oklahoma',
    medianIncome: 56440,
    povertyRate: 15.2,
    housingUnits: 1800000
  },
  'OR': { 
    population: 4237256, 
    name: 'Oregon',
    medianIncome: 70784,
    povertyRate: 11.4,
    housingUnits: 1900000
  },
  'PA': { 
    population: 13002700, 
    name: 'Pennsylvania',
    medianIncome: 67051,
    povertyRate: 12.0,
    housingUnits: 5800000
  },
  'RI': { 
    population: 1097379, 
    name: 'Rhode Island',
    medianIncome: 74289,
    povertyRate: 12.9,
    housingUnits: 470000
  },
  'SC': { 
    population: 5118425, 
    name: 'South Carolina',
    medianIncome: 58234,
    povertyRate: 13.8,
    housingUnits: 2300000
  },
  'SD': { 
    population: 886667, 
    name: 'South Dakota',
    medianIncome: 63191,
    povertyRate: 11.9,
    housingUnits: 400000
  },
  'TN': { 
    population: 6910840, 
    name: 'Tennessee',
    medianIncome: 58206,
    povertyRate: 15.0,
    housingUnits: 3000000
  },
  'TX': { 
    population: 29145505, 
    name: 'Texas',
    medianIncome: 67210,
    povertyRate: 14.7,
    housingUnits: 12000000
  },
  'UT': { 
    population: 3271616, 
    name: 'Utah',
    medianIncome: 75579,
    povertyRate: 8.6,
    housingUnits: 1200000
  },
  'VT': { 
    population: 643077, 
    name: 'Vermont',
    medianIncome: 67292,
    povertyRate: 10.2,
    housingUnits: 300000
  },
  'VA': { 
    population: 8631393, 
    name: 'Virginia',
    medianIncome: 80463,
    povertyRate: 10.6,
    housingUnits: 3600000
  },
  'WA': { 
    population: 7705281, 
    name: 'Washington',
    medianIncome: 82343,
    povertyRate: 10.2,
    housingUnits: 3200000
  },
  'WV': { 
    population: 1793716, 
    name: 'West Virginia',
    medianIncome: 49450,
    povertyRate: 17.8,
    housingUnits: 850000
  },
  'WI': { 
    population: 5893718, 
    name: 'Wisconsin',
    medianIncome: 67200,
    povertyRate: 10.4,
    housingUnits: 2700000
  },
  'WY': { 
    population: 576851, 
    name: 'Wyoming',
    medianIncome: 65504,
    povertyRate: 11.1,
    housingUnits: 280000
  },
  'DC': { 
    population: 689545, 
    name: 'District of Columbia',
    medianIncome: 93388,
    povertyRate: 14.6,
    housingUnits: 320000
  }
}

export class CensusAPIService {
  private static instance: CensusAPIService
  private cache: Map<string, { data: CensusData; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    // No API key needed - using public data only
  }

  public static getInstance(): CensusAPIService {
    if (!CensusAPIService.instance) {
      CensusAPIService.instance = new CensusAPIService()
    }
    return CensusAPIService.instance
  }

  // Get state demographic data from public sources
  public async getStateData(stateCode: string): Promise<CensusData> {
    // Check cache first
    const cached = this.cache.get(stateCode)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    const stateData = publicCensusData[stateCode.toUpperCase()]
    
    if (!stateData) {
      throw new Error(`No data available for state: ${stateCode}`)
    }

    const censusData: CensusData = {
      state: stateData.name,
      stateCode: stateCode.toUpperCase(),
      population: stateData.population,
      medianIncome: stateData.medianIncome,
      povertyRate: stateData.povertyRate,
      housingUnits: stateData.housingUnits,
      lastUpdated: '2023-01-01T00:00:00.000Z', // Approximate date for public data
      source: 'U.S. Census Bureau Public Data (2020 Census & ACS Estimates)'
    }

    // Cache the result
    this.cache.set(stateCode, {
      data: censusData,
      timestamp: Date.now()
    })

    return censusData
  }

  // Get attribution notice
  public getAttribution(): string {
    return 'This product uses publicly available U.S. Census Bureau data'
  }

  // Clear cache for a specific state or all states
  public clearCache(stateCode?: string): void {
    if (stateCode) {
      this.cache.delete(stateCode)
    } else {
      this.cache.clear()
    }
  }

  // Get cache status
  public getCacheStatus(): { total: number; expired: number } {
    const now = Date.now()
    let expired = 0
    
    Array.from(this.cache.entries()).forEach(([_, entry]) => {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        expired++
      }
    })

    return {
      total: this.cache.size,
      expired
    }
  }

  // Get rate limit status (not applicable for public data)
  public getRateLimitStatus(): { requestsThisMinute: number; limit: number } {
    return {
      requestsThisMinute: 0,
      limit: 0 // No rate limits for public data
    }
  }
} 