
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@repo/ui';
import NumberInput from './NumberInput';
import GenderSelector from './GenderSelector';

interface DemographicsProps {
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
}

export default function Demographics({ age, setAge, gender, setGender }: DemographicsProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
  });

  return (
    <>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 96, marginRight: theme.spacing.m}}>
              <Text style={[styles.cardTitle]}>Age</Text>
          </View>
          <View style={{flex: 1}}>
              <Text style={[styles.cardTitle, {textAlign: 'center'}]}>Gender</Text>
          </View>
      </View>
      <View style={styles.inlineInputContainer}>
          <View style={{width: 96, marginRight: theme.spacing.m}}>
              <NumberInput
                  value={age}
                  onChangeText={setAge}
                  placeholder=""
                  inputStyle={{paddingVertical: 6}}
              />
          </View>
          <View style={{flex: 1}}>
              <GenderSelector gender={gender} setGender={setGender} />
          </View>
      </View>
    </>
  );
}
