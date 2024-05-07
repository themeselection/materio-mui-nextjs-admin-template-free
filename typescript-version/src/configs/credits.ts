export const Banks = ['BBVA', 'Santander', 'Hipotecario', 'Supervielle', 'Nacion', 'Ciudad'] as const
export type Bank = typeof Banks[number]

export const CreditTypes = ['Construccion', 'Adquisicion', 'Terminacion', 'Ampliacion'] as const
export type CreditType = typeof CreditTypes[number]

export const Neighborhoods = [
  'Agronomía',
  'Almagro',
  'Balvanera',
  'Barracas',
  'Belgrano',
  'Boedo',
  'Caballito',
  'Chacarita',
  'Coghlan',
  'Colegiales',
  'Constitución',
  'Flores',
  'Floresta',
  'La Boca',
  'La Paternal',
  'Liniers',
  'Mataderos',
  'Monte Castro',
  'Montserrat',
  'Nueva Pompeya',
  'Nuñez',
  'Palermo',
  'Parque Avellaneda',
  'Parque Chacabuco',
  'Parque Chas',
  'Parque Patricios',
  'Puerto Madero',
  'Recoleta',
  'Retiro',
  'Saavedra',
  'San Cristóbal',
  'San Nicolás',
  'San Telmo',
  'Versalles',
  'Villa Crespo',
  'Villa Devoto',
  'Villa General Mitre',
  'Villa Lugano',
  'Villa Luro',
  'Villa Ortúzar',
  'Villa Pueyrredón',
  'Villa Real',
  'Villa Riachuelo',
  'Villa Santa Rita',
  'Villa Soldati',
  'Villa Urquiza',
  'Villa del Parque',
  'Vélez Sarsfield'
] as const
export type Neighborhood = typeof Neighborhoods[number]

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
  alreadyClientsSpecialQuota?: number
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
    tna: 6.5,
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
    tna: 6.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Adquisicion Banco Hipotecario',
    bank: 'Hipotecario',
    type: 'Adquisicion',
    maxFinancingPercentage: 80,
    maxAmount: 250000,
    maxTermInMonths: 360,
    tna: 6.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Terminacion Banco Hipotecario',
    bank: 'Hipotecario',
    type: 'Ampliacion',
    maxFinancingPercentage: 50,
    maxAmount: 125000,
    maxTermInMonths: 360,
    tna: 6.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },

  {
    name: 'Construccion Banco Ciudad',
    bank: 'Ciudad',
    type: 'Construccion',
    maxFinancingPercentage: 80,
    maxAmount: 250000,
    maxTermInMonths: 360,
    tna: 4.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Terminacion Banco Ciudad',
    bank: 'Ciudad',
    type: 'Terminacion',
    maxFinancingPercentage: 50,
    maxAmount: 125000,
    maxTermInMonths: 360,
    tna: 4.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Adquisicion Banco Ciudad',
    bank: 'Ciudad',
    type: 'Adquisicion',
    maxFinancingPercentage: 80,
    maxAmount: 250000,
    maxTermInMonths: 360,
    tna: 4.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Terminacion Banco Ciudad',
    bank: 'Ciudad',
    type: 'Ampliacion',
    maxFinancingPercentage: 50,
    maxAmount: 125000,
    maxTermInMonths: 360,
    tna: 4.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },

  {
    name: 'Construccion Banco Nacion',
    bank: 'Nacion',
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
    name: 'Terminacion Banco Nacion',
    bank: 'Nacion',
    type: 'Terminacion',
    maxFinancingPercentage: 50,
    maxAmount: 125000,
    maxTermInMonths: 360,
    tna: 8.5,
    houseNumberAllowed: 2,
    quotaIncomeRelationPercentage: 25,
    alreadyClientsSpecialQuota: 4.25,
    alreadyClientsSpecialQuotaDurationInMonths: 12
  },
  {
    name: 'Adquisicion Banco Nacion',
    bank: 'Nacion',
    type: 'Adquisicion',
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
    name: 'Terminacion Banco Nacion',
    bank: 'Nacion',
    type: 'Ampliacion',
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
