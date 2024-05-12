import { Credit } from 'src/configs/constants'
import { UserData } from '../layouts/HipotecarLayout'

export interface CreditEvaluationResult {
  creditosCompatibles: Credit[]
  razonesDeLosRestantes: string[]
}

export const getCompatibleCredits = (credits: Credit[], userData: UserData): CreditEvaluationResult => {
  const creditosCompatibles: Credit[] = []
  const razonesDeLosRestantes: string[] = []

  credits.forEach(credit => {
    const reasons = []
    let isCompatible = true

    if (userData?.salary && credit['Ingresos Minimos'] && credit['Ingresos Minimos'] <= userData.salary) {
      reasons.push(
        `El ingreso mínimo requerido de ${credit['Ingresos Minimos']} es mayor que su salario actual de ${userData.salary}.`
      )
      isCompatible = false
    }

    if (userData?.duration && credit['Duracion'] < userData.duration) {
      reasons.push(
        `El plazo máximo ofrecido de ${credit['Duracion']} meses es menor que el plazo deseado de ${userData.duration} meses.`
      )
      isCompatible = false
    }

    if (userData?.budget && credit['Monto Maximo en UVAs'] && credit['Monto Maximo en UVAs'] * 922 < userData.budget) {
      reasons.push(
        `El monto máximo financiable de ${
          credit['Monto Maximo en UVAs'] * 922
        } es menor que el presupuesto necesario de ${userData.budget}.`
      )
      isCompatible = false
    }

    if (userData?.creditType && credit.Tipo !== userData.creditType) {
      reasons.push(`El tipo de crédito requerido es '${userData.creditType}', pero el disponible es '${credit.Tipo}'.`)
      isCompatible = false
    }

    if (credit['Sueldo En Banco'] == 'TRUE') {
      if (userData?.banks && !userData.banks.includes(credit.Banco)) {
        reasons.push(
          `El crédito requiere que el sueldo esté en el banco '${credit.Banco}', que no está en su lista de bancos.`
        )
        isCompatible = false
      }
    }

    if (isCompatible) {
      creditosCompatibles.push(credit)
    } else {
      razonesDeLosRestantes.push(`Crédito '${credit.Nombre}' en ${credit.Banco}: ${reasons.join(' ')}\n`)
    }
  })

  // Sort by Tasa
  creditosCompatibles.sort((a, b) => a.Tasa - b.Tasa)

  return {
    creditosCompatibles,
    razonesDeLosRestantes
  }
}

export function calcularCuotaMensual(montoPrestamo: number, tasaAnual: number, plazoAnios: number): number {
  const tasaMensual = tasaAnual / 12 / 100; // Convertir la tasa anual en decimal y dividirla por 12 para obtener la tasa mensual
  const plazoMeses = plazoAnios * 12; // Convertir el plazo de años a meses
  const cuotaMensual =
    (montoPrestamo * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);

  return cuotaMensual;
}

export function calcularAdelanto(montoPrestamo: number, maximoFinanciacion: number): number {
  return montoPrestamo * (100 - maximoFinanciacion) / 100;
}

