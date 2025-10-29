/**
 * @file page.tsx
 * @description This file defines the PT Calculator page for the web application.
 * It includes a form for users to enter their PT data and a button to calculate their score.
 * NOTE: This component appears to be a work in progress and has inconsistencies in its use of UI components.
 */

"use client";

import * as React from "react";
// These components are imported from the shared UI library but do not seem to be used correctly below.
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";

/**
 * The main page component for the PT Calculator.
 * It manages the state for all user inputs and displays the calculated score.
 */
export default function PtCalculatorPage() {
  // State for the user's demographic and performance data.
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("male");
  const [pushups, setPushups] = React.useState("");
  const [situps, setSitups] = React.useState("");
  const [runMinutes, setRunMinutes] = React.useState("");
  const [runSeconds, setRunSeconds] = React.useState("");
  const [score, setScore] = React.useState(null);

  /**
   * A placeholder function to calculate the PT score.
   * The actual calculation logic is not yet implemented.
   */
  const calculateScore = () => {
    // Logic to calculate the score will go here
    // For now, we'll just set a dummy score
    setScore(85);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Air Force PT Calculator</h1>
      {/* The Card component is used here, but the implementation seems to be custom HTML/CSS, not the shared component. */}
      <Card title="Enter Your Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* The TextInput component is used here, but the implementation seems to be custom HTML/CSS. */}
          <TextInput
            label="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            type="number"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <TextInput
            label="Push-up Repetitions"
            value={pushups}
            onChange={(e) => setPushups(e.target.value)}
            placeholder="Enter push-up count"
            type="number"
          />
          <TextInput
            label="Sit-up Repetitions"
            value={situps}
            onChange={(e) => setSitups(e.target.value)}
            placeholder="Enter sit-up count"
            type="number"
          />
          <TextInput
            label="1.5-Mile Run Minutes"
            value={runMinutes}
            onChange={(e) => setRunMinutes(e.target.value)}
            placeholder="Minutes"
            type="number"
          />
          <TextInput
            label="1.5-Mile Run Seconds"
            value={runSeconds}
            onChange={(e) => setRunSeconds(e.target.value)}
            placeholder="Seconds"
            type="number"
          />
        </div>
        <div className="mt-4">
          {/* The Button component is used here, but the implementation seems to be custom HTML/CSS. */}
          <Button onClick={calculateScore}>Calculate Score</Button>
        </div>
        {/* Display the score if it has been calculated. */}
        {score !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-bold">Your Score: {score}</h2>
          </div>
        )}
      </Card>
    </div>
  );
}