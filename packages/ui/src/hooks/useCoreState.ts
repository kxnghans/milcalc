import { useState } from 'react';

export function useCoreState(
  initialComponent: string = 'sit_ups_1min',
  initialSitups: string = '',
  initialCrunches: string = '',
  initialPlankMinutes: string = '',
  initialPlankSeconds: string = ''
) {
  const [coreComponent, setCoreComponent] = useState(initialComponent);
  const [situps, setSitups] = useState(initialSitups);
  const [reverseCrunches, setReverseCrunches] = useState(initialCrunches);
  const [plankMinutes, setPlankMinutes] = useState(initialPlankMinutes);
  const [plankSeconds, setPlankSeconds] = useState(initialPlankSeconds);

  return {
    coreComponent,
    setCoreComponent,
    situps,
    setSitups,
    reverseCrunches,
    setReverseCrunches,
    plankMinutes,
    setPlankMinutes,
    plankSeconds,
    setPlankSeconds,
  };
}
