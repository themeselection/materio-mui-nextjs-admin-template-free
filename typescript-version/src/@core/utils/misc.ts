import { Credit } from 'src/configs/constants'
import { UserData } from '../layouts/HipotecarLayout'

export interface CreditEvaluationResult {
  creditosCompatibles: Credit[]
  razonesDeLosRestantes: string[]
}

export const getCompatibleCredits = (credits: Credit[], userData: UserData): CreditEvaluationResult => {
  console.log('credits', credits)
  console.log('userData', userData)

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

    if (userData?.duration && credit['Plazo hasta en Meses'] < userData.duration) {
      reasons.push(
        `El plazo máximo ofrecido de ${credit['Plazo hasta en Meses']} meses es menor que el plazo deseado de ${userData.duration} meses.`
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

    console.log(credit)
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
      razonesDeLosRestantes.push(`Crédito en ${credit.Banco}: ${reasons.join(' ')}\n`)
    }
  })

  return {
    creditosCompatibles,
    razonesDeLosRestantes
  }
}
