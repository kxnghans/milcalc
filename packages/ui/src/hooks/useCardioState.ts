import { useState } from 'react';

export function useCardioState(
  initialComponent: string = 'run',
  initialRunMinutes: string = '',
  initialRunSeconds: string = '',
  initialShuttles: string = '',
  initialWalkMinutes: string = '',
  initialWalkSeconds: string = ''
) {
  const [cardioComponent, setCardioComponent] = useState(initialComponent);
  const [runMinutes, setRunMinutes] = useState(initialRunMinutes);
  const [runSeconds, setRunSeconds] = useState(initialRunSeconds);
  const [shuttles, setShuttles] = useState(initialShuttles);
  const [walkMinutes, setWalkMinutes] = useState(initialWalkMinutes);
  const [walkSeconds, setWalkSeconds] = useState(initialWalkSeconds);

  return {
    cardioComponent,
    setCardioComponent,
    runMinutes,
    setRunMinutes,
    runSeconds,
    setRunSeconds,
    shuttles,
    setShuttles,
    walkMinutes,
    setWalkMinutes,
    walkSeconds,
    setWalkSeconds,
  };
}
