import { useState } from 'react';

export function useNumericInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const handleChangeText = (text: string) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  return {
    value,
    onChangeText: handleChangeText,
    setValue, // Also expose setValue for direct manipulation if needed
  };
}
