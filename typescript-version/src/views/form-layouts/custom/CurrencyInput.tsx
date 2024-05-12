import React, { useState } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setValue(propsValue?.toString() || '');
    props.onFocus && props.onFocus(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const numericalValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numericalValue)) {
      onChange && onChange(numericalValue);
    }
    props.onBlur && props.onBlur(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const formatNumberAsCurrency = (amount: number) => {
    return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
  };

  return (
    <TextField
      {...props}
      type="text"
      value={isFocused ? value : formatNumberAsCurrency(propsValue || 0)}
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
