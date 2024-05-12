import React, { useState, useEffect } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { WalletOutline } from 'mdi-material-ui';

interface CurrencyTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyTextField: React.FC<CurrencyTextFieldProps> = ({ onChange, value: propsValue, ...props }) => {
  // Use local state to handle input value and formatting
  const [value, setValue] = useState('');

  // Initialize value
  useEffect(() => {
    if (propsValue != null) {
      setValue(formatNumberAsCurrency(propsValue));
    }
  }, [propsValue]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // Convert formatted string to a plain number string on focus
    setValue(propsValue?.toString() || '');
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Convert back to number and format on blur
    const numericalValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numericalValue)) {
      setValue(formatNumberAsCurrency(numericalValue));
      onChange && onChange(numericalValue);
    } else {
      // Handle invalid number
      setValue(formatNumberAsCurrency(propsValue || 0));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const formatNumberAsCurrency = (amount: number): string => {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    });
  };

  return (
    <TextField
      {...props}
      type="text"
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <WalletOutline />
          </InputAdornment>
        ),
        inputMode: 'numeric',
      }}
    />
  );
};

export default CurrencyTextField;
