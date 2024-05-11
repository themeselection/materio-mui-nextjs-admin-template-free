import { parse } from 'papaparse'

export const CreditTypes = ['Construccion', 'Adquisicion', 'Terminacion', 'Ampliacion'] as const
export type CreditType = typeof CreditTypes[number]

export const Provinces = [
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
export type Province = typeof Provinces[number]

export interface Credit {
  Banco: string
  Tipo: CreditType
  Link: string
  Nombre: string
  'Sueldo En Banco': 'TRUE' | 'FALSE'
  Duracion: number
  'Monto Maximo en UVAs': number
  '% Maximo de Financiacion': number
  'Relacion Cuota Ingreso': number
  Tasa: number
  'Tasa especial por tiempo definido': number
  'Duracion Tasa Especial en Meses': number
  'Ingresos Minimos': number
  'Pre-Cancelacion': string
  'Prima de seguro': number
  Provincias: string
}

export async function loadDataFromCSV<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    const csvData = await response.text()

    const parsedData = parse<T>(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => results.data as T[]
    })

    return parsedData.data
  } catch (error) {
    console.error('Error loading CSV data:', error)

    return []
  }
}

// URL de tu Google Sheet publicado como CSV
export const creditsCsvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYyAS7elxTeGdl4XN_neWSy75oMLTl_z6oRgBjsKUj9cctAXj8HmMLrcvTV7xi9nFLKaShH0IUYpyq/pub?gid=0&single=true&output=csv'
export const banksCsvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYyAS7elxTeGdl4XN_neWSy75oMLTl_z6oRgBjsKUj9cctAXj8HmMLrcvTV7xi9nFLKaShH0IUYpyq/pub?gid=478920528&single=true&output=csv'
export const provincesCsvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYyAS7elxTeGdl4XN_neWSy75oMLTl_z6oRgBjsKUj9cctAXj8HmMLrcvTV7xi9nFLKaShH0IUYpyq/pub?gid=1268043676&single=true&output=csv'

// export let credits: Credit[] | undefined
// loadDataFromCSV<Credit>(creditsCsvUrl)
//   .then(result => (credits = result))
//   .catch(console.error)

// export let banks: string[] | undefined
// loadDataFromCSV<{ Banco: string }>(banksCsvUrl)
//   .then(result => (banks = result.map(b => b.Banco)))
//   .catch(console.error)

// export let provinces: string[] | undefined
// loadDataFromCSV<{ Provincia: string }>(provincesCsvUrl)
//   .then(result => (provinces = result.map(p => p.Provincia)))
//   .catch(console.error)
