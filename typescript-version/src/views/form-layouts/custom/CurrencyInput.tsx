import React, { useState } from 'react'
import { TextField, InputAdornment, TextFieldProps } from '@mui/material'
import { WalletOutline } from 'mdi-material-ui'

function formatCurrency(value: string): string {
  // Remove any non-digit characters, except minus sign
  const number = value.replace(/[^0-9-]/g, '')

  // Convert the string to a number and format it as currency
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(number))
}

function CurrencyInput(props: TextFieldProps) {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Format the input value as currency
    const formattedValue = formatCurrency(event.target.value)
    setValue(formattedValue)
  }

  return (
    <TextField
      {...props}
      fullWidth
      type='text' // Changed to text to handle formatted input
      value={value}
      label='Presupuesto del inmueble (en ARS)'
      onChange={handleChange}
      placeholder='$100,000,000'
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <WalletOutline />
          </InputAdornment>
        )
      }}
    />
  )
}

export default CurrencyInput
