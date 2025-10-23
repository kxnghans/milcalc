import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { getDisabilityData } from '@repo/utils';

export const useRetirementCalculatorState = () => {
  const [component, setComponent] = useState('Active');
  const [retirementSystem, setRetirementSystem] = useState('High 3');

  // High 3 State
  const [high3Year1, setHigh3Year1] = useState(null);
  const [high3Year2, setHigh3Year2] = useState(null);
  const [high3Year3, setHigh3Year3] = useState(null);
  const [tspAmount, setTspAmount] = useState('');
  const [servicePoints, setServicePoints] = useState('');
  const [goodYears, setGoodYears] = useState('');

  // TSP Calculator State
  const [isTspCalculatorVisible, setIsTspCalculatorVisible] = useState(false);
  const [tspContributionAmount, setTspContributionAmount] = useState('');
  const [tspContributionPercentage, setTspContributionPercentage] = useState('');
  const [tspContributionYears, setTspContributionYears] = useState('');

  // Disability State
  const [disabilityPercentage, setDisabilityPercentage] = useState(null);
  const [dependentStatus, setDependentStatus] = useState(null);
  const [disabilityData, setDisabilityData] = useState([]);
  const [isDisabilityLoading, setIsDisabilityLoading] = useState(false);
  const [disabilityError, setDisabilityError] = useState(null);

  // Conditional Inputs
  const [showServicePoints, setShowServicePoints] = useState(true);
  const [showGoodYears, setShowGoodYears] = useState(true);

  useEffect(() => {
    if (component === 'Active') {
      setShowServicePoints(false);
      setShowGoodYears(false);
    } else {
      setShowServicePoints(true);
      setShowGoodYears(true);
    }
  }, [component]);

  const percentageItems = [
    { label: '10%', value: '10' },
    { label: '20%', value: '20' },
    { label: '30%', value: '30' },
    { label: '40%', value: '40' },
    { label: '50%', value: '50' },
    { label: '60%', value: '60' },
    { label: '70%', value: '70' },
    { label: '80%', value: '80' },
    { label: '90%', value: '90' },
    { label: '100%', value: '100' },
  ];

  const statusItems = useMemo(() => {
    if (!disabilityData) return [];
    return disabilityData.map(item => ({ label: item.dependent_status, value: item.dependent_status }));
  }, [disabilityData]);

  useEffect(() => {
    const fetchDisabilityData = async () => {
      setIsDisabilityLoading(true);
      try {
        const data = await getDisabilityData();
        setDisabilityData(data);
      } catch (error) {
        setDisabilityError(error.message);
      } finally {
        setIsDisabilityLoading(false);
      }
    };
    fetchDisabilityData();
  }, []);

  const resetState = () => {
    setComponent('Active');
    setRetirementSystem('High 3');
    setHigh3Year1(null);
    setHigh3Year2(null);
    setHigh3Year3(null);
    setTspAmount('');
    setServicePoints('');
    setGoodYears('');
    setDisabilityPercentage(null);
    setDependentStatus(null);
    setIsTspCalculatorVisible(false);
    setTspContributionAmount('');
    setTspContributionPercentage('');
    setTspContributionYears('');
  };

  return {
    component,
    setComponent,
    retirementSystem,
    setRetirementSystem,
    high3Year1,
    setHigh3Year1,
    high3Year2,
    setHigh3Year2,
    high3Year3,
    setHigh3Year3,
    tspAmount,
    setTspAmount,
    servicePoints,
    setServicePoints,
    goodYears,
    setGoodYears,
    resetState,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
    isDisabilityLoading,
    disabilityError,
    percentageItems,
    statusItems,
    isTspCalculatorVisible,
    setIsTspCalculatorVisible,
    tspContributionAmount,
    setTspContributionAmount,
    tspContributionPercentage,
    setTspContributionPercentage,
    tspContributionYears,
    setTspContributionYears,
    showServicePoints,
    showGoodYears,
  };
};
