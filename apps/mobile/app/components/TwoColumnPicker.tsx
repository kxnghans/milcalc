import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Button, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme, NeumorphicInset } from '@repo/ui';

const TwoColumnPicker = ({ mhaData, onMhaChange, selectedMha }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [mhasInState, setMhasInState] = useState([]);
  const [tempSelectedMha, setTempSelectedMha] = useState(selectedMha);

  // This effect runs when the modal is opened
  useEffect(() => {
    if (modalVisible) {
        const stateList = Object.keys(mhaData).sort();
        setStates(stateList);
        if (stateList.length > 0) {
            // Try to find the state and MHA name from the current selection
            const currentMhaCode = selectedMha;
            let initialState = stateList[0];
            let initialMhaName = '';

            if (currentMhaCode) {
                const stateFromCode = currentMhaCode.substring(0, 2);
                if (mhaData[stateFromCode]) {
                    initialState = stateFromCode;
                    const mhaObject = mhaData[stateFromCode].find(m => m.value === currentMhaCode);
                    if (mhaObject) {
                        initialMhaName = mhaObject.label;
                    }
                }
            }
            setSelectedState(initialState);
            setTempSelectedMha(currentMhaCode);
        }
    }
  }, [mhaData, modalVisible, selectedMha]);

  // Update the list of MHAs when a state is selected
  useEffect(() => {
    if (selectedState && mhaData[selectedState]) {
      setMhasInState(mhaData[selectedState]);
    } else {
      setMhasInState([]);
    }
  }, [selectedState, mhaData]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    if (mhaData[state] && mhaData[state].length > 0) {
      setTempSelectedMha(mhaData[state][0].value);
    }
  };

  const handleConfirm = () => {
    onMhaChange(tempSelectedMha);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const getDisplayName = () => {
      if (!selectedMha || !mhaData) return "Select MHA...";
      const state = selectedMha.substring(0, 2);
      if (mhaData[state]) {
          const mhaObject = mhaData[state].find(m => m.value === selectedMha);
          return mhaObject ? mhaObject.label : "Select MHA...";
      }
      return "Select MHA...";
  }

  const styles = StyleSheet.create({
    pressableInput: {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        backgroundColor: theme.colors.inputBackground,
    },
    pressableText: {
        ...theme.typography.body,
        color: theme.colors.text,
        textAlign: 'center',
    },
    placeholderText: {
        color: theme.colors.placeholder,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.l,
        borderTopRightRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
    },
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    picker: {
      flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: theme.spacing.m,
    }
  });

  return (
    <>
        <Pressable onPress={() => setModalVisible(true)}>
            <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                <View style={styles.pressableInput}>
                    <Text style={[styles.pressableText, !selectedMha && styles.placeholderText]}>{getDisplayName()}</Text>
                </View>
            </NeumorphicInset>
        </Pressable>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCancel}
        >
            <SafeAreaView style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedState}
                            onValueChange={handleStateChange}
                            style={styles.picker}
                            itemStyle={{ color: theme.colors.text }}
                        >
                            {states.map(state => (
                            <Picker.Item key={state} label={state} value={state} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={tempSelectedMha}
                            onValueChange={(itemValue) => setTempSelectedMha(itemValue)}
                            style={styles.picker}
                            enabled={mhasInState.length > 0}
                            itemStyle={{ color: theme.colors.text }}
                        >
                            {mhasInState.map(mha => (
                            <Picker.Item key={mha.value} label={mha.label} value={mha.value} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={handleCancel} color={theme.colors.error} />
                        <View style={{ width: theme.spacing.m }} />
                        <Button title="Done" onPress={handleConfirm} />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    </>
  );
};

export default TwoColumnPicker;
