import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Button, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme, NeumorphicInset, PillButton } from '@repo/ui';

const TwoColumnPicker = ({ mhaData, onMhaChange, selectedMha, displayName, isLoading, error, state: propState }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(propState || '');
  const [tempSelectedMha, setTempSelectedMha] = useState(selectedMha);

  const mhasInState = useMemo(() => {
    if (selectedState && mhaData && mhaData[selectedState]) {
        return mhaData[selectedState];
    }
    return [];
  }, [selectedState, mhaData]);

  useEffect(() => {
    if (modalVisible) {
        if (mhaData && Object.keys(mhaData).length > 0) {
            const stateKeys = Object.keys(mhaData).filter(k => k !== 'ON BASE').sort();
            const stateList = ['...', ...stateKeys];
            setStates(stateList);
            
            // Set initial state based on selectedMha
            if (selectedMha === 'initial') {
                setSelectedState('...');
                setTempSelectedMha('');
            } else if (selectedMha === 'ON_BASE') {
                // If ON_BASE is selected, we retain the previously selected state
                setSelectedState(propState || '...');
                setTempSelectedMha('ON_BASE');
            } else if (selectedMha) {
                const state = selectedMha.substring(0, 2);
                setSelectedState(state);
                setTempSelectedMha(selectedMha);
            } else {
                setSelectedState('...');
                setTempSelectedMha('');
            }
        }
    }
}, [mhaData, modalVisible, selectedMha]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    if (state === '...') {
        setTempSelectedMha('');
    } else if (state === 'ON BASE') {
        setTempSelectedMha('ON_BASE');
    } else if (state) {
        const newMhas = mhaData[state] || [];
        if (newMhas.length > 0) {
          setTempSelectedMha(newMhas[0].value);
        } else {
          setTempSelectedMha(null);
        }
    } else {
        setTempSelectedMha(null);
    }
  };

  const handleConfirm = () => {
    onMhaChange(tempSelectedMha, selectedState);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedMha(selectedMha);
    setModalVisible(false);
  };

  const styles = useMemo(() => StyleSheet.create({
    pressableInput: {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.s,
        backgroundColor: theme.colors.inputBackground,
    },
    pressableText: {
        ...theme.typography.body,
        color: theme.colors.text,
        textAlign: 'left',
    },
    placeholderText: {
        color: theme.colors.placeholder,
        textAlign: 'left',
    },
    errorText: {
        color: theme.colors.error,
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
        padding: theme.spacing.s,
        minHeight: 300,
    },
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftPicker: {
      flex: 1,
    },
    rightPicker: {
      flex: 3,
    },
    pickerItem: {
        ...theme.typography.label,
        color: theme.colors.text,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.s,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
  }), [theme]);

  const getDisplayText = () => {
    if (isLoading) return 'Loading MHA Data...';
    if (error) return error;
    return displayName;
  };

  return (
    <>
        <Pressable onPress={() => setModalVisible(true)} disabled={isLoading || !!error}>
            <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                <View style={styles.pressableInput}>
                    <Text style={[styles.pressableText, selectedMha === 'initial' && styles.placeholderText, error && styles.errorText]}>
                        {getDisplayText()}
                    </Text>
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
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={{...theme.typography.body, color: theme.colors.text, marginTop: theme.spacing.m}}>Loading MHAs...</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedState}
                                    onValueChange={handleStateChange}
                                    style={styles.leftPicker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {states.map(state => (
                                    <Picker.Item key={state} label={state} value={state} />
                                    ))}
                                </Picker>
                                <Picker
                                    selectedValue={tempSelectedMha}
                                    onValueChange={(itemValue) => setTempSelectedMha(itemValue)}
                                    style={styles.rightPicker}
                                    enabled={selectedState !== 'N/A' && mhasInState.length > 0}
                                    itemStyle={styles.pickerItem}
                                >
                                    {selectedState === '...' ? (
                                        <Picker.Item label="Select a state" value="" enabled={false} />
                                    ) : mhasInState.length === 0 ? (
                                        <Picker.Item label="No MHAs" value="" enabled={false} />
                                    ) : (
                                      mhasInState.map(mha => (
                                        <Picker.Item key={mha.value} label={mha.label} value={mha.value} />
                                      ))
                                    )}
                                </Picker>
                            </View>
                            <View style={styles.buttonContainer}>
                                <PillButton title="Cancel" onPress={handleCancel} backgroundColor={theme.colors.error} textColor={theme.colors.primaryText} />
                                <View style={{ width: theme.spacing.s }} />
                                <PillButton title="Done" onPress={handleConfirm} disabled={!tempSelectedMha} backgroundColor={theme.colors.primary} />
                            </View>
                        </>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    </>
  );
};

export default TwoColumnPicker;