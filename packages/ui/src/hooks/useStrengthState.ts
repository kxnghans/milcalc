import { useState } from 'react';

export function useStrengthState(initialComponent: string = 'push_ups_1min', initialPushups: string = '') {
  const [pushupComponent, setPushupComponent] = useState(initialComponent);
  const [pushups, setPushups] = useState(initialPushups);

  return {
    pushupComponent,
    setPushupComponent,
    pushups,
    setPushups,
  };
}
