export type Bank = 'BBVA' | 'Santander' | 'Hipotecario' | 'Supervielle' | 'Nacion'
export type CreditType = 'Construccion' | 'Adquisicion' | 'Terminacion' | 'Ampliacion'

export type Credits = {
  name: string
  bank: Bank
  type: CreditType
  maxFinancingPercentage: number
  maxAmount: number
  maxTermInMonths: number
  tna: number
  houseNumberAllowed: number
  quotaIncomeRelationPercentage: number | undefined
  alreadyClientsSpecialQuota?: number,
  alreadyClientsSpecialQuotaDurationInMonths?: number
}

export const credits: Credits[] = [
  {
    name: 'Construccion Banco Hipotecario',
    bank: 'Hipotecario',
    type: 'Construccion',
    maxFinancingPercentage: 80,
    maxAmount: 250000,
    maxTermInMonths: 360,
    tna: 8.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Terminacion Banco Hipotecario',
    bank: 'Hipotecario',
    type: 'Terminacion',
    maxFinancingPercentage: 50,
    maxAmount: 125000,
    maxTermInMonths: 360,
    tna: 8.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  }
]
