import { useState } from 'react';

export function useDemographicsState(initialAge: string = '', initialGender: string = 'male', initialAltitudeGroup: string = 'normal') {
  const [age, setAge] = useState(initialAge);
  const [gender, setGender] = useState(initialGender);
  const [altitudeGroup, setAltitudeGroup] = useState(initialAltitudeGroup);

  return {
    age,
    setAge,
    gender,
    setGender,
    altitudeGroup,
    setAltitudeGroup,
  };
}
