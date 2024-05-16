import { sql } from '@vercel/postgres'
import { UserData } from '../layouts/HipotecarLayout'
import { Credit } from 'src/configs/constants'

export const createRow = async (data: UserData, compatibleCredits: Credit[]) => {
  try {

    console.log('Successfully added row for in messages table')

    return
  } catch (error) {
    throw new Error(`Error while saving row in database: ${error}`)
  }
}
