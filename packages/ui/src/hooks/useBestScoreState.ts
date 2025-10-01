import { useState, useEffect } from 'react';
import { getScoreForExercise, calculateBestScore, checkWalkPass } from '@repo/utils';
import { useDebounce } from './useDebounce';

export function useBestScoreState(age: string, gender: string, altitudeGroup: string) {
  const [pushUps, setPushUps] = useState("");
  const [hrPushUps, setHrPushUps] = useState("");
  const [sitUps, setSitUps] = useState("");
  const [crunches, setCrunches] = useState("");
  const [plankMinutes, setPlankMinutes] = useState("");
  const [plankSeconds, setPlankSeconds] = useState("");
  const [runMinutes, setRunMinutes] = useState("");
  const [runSeconds, setRunSeconds] = useState("");
  const [shuttles, setShuttles] = useState("");
  const [walkMinutes, setWalkMinutes] = useState("");
  const [walkSeconds, setWalkSeconds] = useState("");

  const [scores, setScores] = useState({});
  const [bestScore, setBestScore] = useState(0);

  const debouncedAge = useDebounce(age, 500);
  const debouncedGender = useDebounce(gender, 500);
  const debouncedAltitudeGroup = useDebounce(altitudeGroup, 500);
  const debouncedPushUps = useDebounce(pushUps, 500);
  const debouncedHrPushUps = useDebounce(hrPushUps, 500);
  const debouncedSitUps = useDebounce(sitUps, 500);
  const debouncedCrunches = useDebounce(crunches, 500);
  const debouncedPlankMinutes = useDebounce(plankMinutes, 500);
  const debouncedPlankSeconds = useDebounce(plankSeconds, 500);
  const debouncedRunMinutes = useDebounce(runMinutes, 500);
  const debouncedRunSeconds = useDebounce(runSeconds, 500);
  const debouncedShuttles = useDebounce(shuttles, 500);
  const debouncedWalkMinutes = useDebounce(walkMinutes, 500);
  const debouncedWalkSeconds = useDebounce(walkSeconds, 500);

  useEffect(() => {
    const newScores = {
        push_ups_1min: getScoreForExercise(Number(debouncedAge), debouncedGender, 'push_ups_1min', { reps: Number(debouncedPushUps) }),
        hand_release_pushups_2min: getScoreForExercise(Number(debouncedAge), debouncedGender, 'hand_release_pushups_2min', { reps: Number(debouncedHrPushUps) }),
        sit_ups_1min: getScoreForExercise(Number(debouncedAge), debouncedGender, 'sit_ups_1min', { reps: Number(debouncedSitUps) }),
        cross_leg_reverse_crunch_2min: getScoreForExercise(Number(debouncedAge), debouncedGender, 'cross_leg_reverse_crunch_2min', { reps: Number(debouncedCrunches) }),
        forearm_plank_time: getScoreForExercise(Number(debouncedAge), debouncedGender, 'forearm_plank_time', { minutes: Number(debouncedPlankMinutes), seconds: Number(debouncedPlankSeconds) }),
        run: getScoreForExercise(Number(debouncedAge), debouncedGender, 'run', { minutes: Number(debouncedRunMinutes), seconds: Number(debouncedRunSeconds) }, debouncedAltitudeGroup),
        shuttles: getScoreForExercise(Number(debouncedAge), debouncedGender, 'shuttles', { shuttles: Number(debouncedShuttles) }, debouncedAltitudeGroup),
        walk: checkWalkPass(Number(debouncedAge), debouncedGender, Number(debouncedWalkMinutes), Number(debouncedWalkSeconds), debouncedAltitudeGroup),
    };
    setScores(newScores);
    setBestScore(calculateBestScore(newScores));
  }, [debouncedAge, debouncedGender, debouncedPushUps, debouncedHrPushUps, debouncedSitUps, debouncedCrunches, debouncedPlankMinutes, debouncedPlankSeconds, debouncedRunMinutes, debouncedRunSeconds, debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds, debouncedAltitudeGroup]);

  return {
    inputs: {
        pushUps, setPushUps,
        hrPushUps, setHrPushUps,
        sitUps, setSitUps,
        crunches, setCrunches,
        plankMinutes, setPlankMinutes,
        plankSeconds, setPlankSeconds,
        runMinutes, setRunMinutes,
        runSeconds, setRunSeconds,
        shuttles, setShuttles,
        walkMinutes, setWalkMinutes,
        walkSeconds, setWalkSeconds,
    },
    outputs: {
        scores,
        bestScore,
    }
  };
}
