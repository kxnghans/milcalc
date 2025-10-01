import { useState } from 'react';

export function useTimeInput(initialMinutes: string = '', initialSeconds: string = '') {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  const handleMinutesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setMinutes(numericValue);
  };

  const handleSecondsChange = (text: string) => {
    const numericValue = text.replace(/[^0-g]/g, '');
    setSeconds(numericValue);
  };

  return {
    minutes,
    seconds,
    setMinutes: handleMinutesChange,
    setSeconds: handleSecondsChange,
  };
}
