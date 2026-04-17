import React, { createContext, ReactNode, useContext, useState } from "react";

export interface PTCalculatorDemographics {
  age: string;
  gender: string;
  altitudeGroup: string;
  waist: string;
  heightFeet: string;
  heightInches: string;
  isHeightInInches: boolean;
}

interface CalculatorStateContextType {
  ptDemographics: PTCalculatorDemographics;
  setPtDemographics: (data: Partial<PTCalculatorDemographics>) => void;
  resetPtDemographics: (profileAge: string, profileGender: string) => void;
}

const DEFAULT_PT_DEMOGRAPHICS: PTCalculatorDemographics = {
  age: "",
  gender: "male",
  altitudeGroup: "normal",
  waist: "",
  heightFeet: "",
  heightInches: "",
  isHeightInInches: false,
};

const CalculatorStateContext = createContext<
  CalculatorStateContextType | undefined
>(undefined);

export const useCalculatorState = () => {
  const context = useContext(CalculatorStateContext);
  if (!context) {
    throw new Error(
      "useCalculatorState must be used within a CalculatorStateProvider",
    );
  }
  return context;
};

export const CalculatorStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ptDemographics, setPtDemographicsState] =
    useState<PTCalculatorDemographics>(DEFAULT_PT_DEMOGRAPHICS);

  const setPtDemographics = React.useCallback(
    (data: Partial<PTCalculatorDemographics>) => {
      setPtDemographicsState((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const resetPtDemographics = React.useCallback(
    (profileAge: string, profileGender: string) => {
      setPtDemographicsState({
        ...DEFAULT_PT_DEMOGRAPHICS,
        age: profileAge,
        gender: profileGender,
      });
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      ptDemographics,
      setPtDemographics,
      resetPtDemographics,
    }),
    [ptDemographics, setPtDemographics, resetPtDemographics],
  );

  return (
    <CalculatorStateContext.Provider value={value}>
      {children}
    </CalculatorStateContext.Provider>
  );
};
