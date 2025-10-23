import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Button, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme, NeumorphicInset, PillButton } from '@repo/ui';

const DisabilityPicker = ({ onDisabilityChange, selectedDisability, displayName, isLoading, error, percentageItems, statusItems }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedPercentage, setTempSelectedPercentage] = useState(selectedDisability.percentage);
  const [tempSelectedStatus, setTempSelectedStatus] = useState(selectedDisability.status);

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

  const handleConfirm = () => {
    onDisabilityChange(tempSelectedPercentage, tempSelectedStatus);
    setModalVisible(false);
  };

  const getDisplayText = () => {
    if (isLoading) return 'Loading Disability Data...';
    if (error) return error;
    if (selectedDisability.percentage && selectedDisability.status) {
      return `${selectedDisability.percentage}% - ${selectedDisability.status}`;
    }
    return displayName;
  };

  const renderStatusPickerItems = () => {
    let items = [];
    if (tempSelectedPercentage === null) {
      items = [{ label: "No Disability", value: null }];
    } else {
      items = statusItems.filter(item => item.label !== 'No Disability');
    }

    if (items.length === 0) {
      return [<Picker.Item key="placeholder" label="Select status" value={null} enabled={false} />];
    }

    return items.map(item => (
      <Picker.Item key={item.label} label={item.label} value={item.value} />
    ));
  };

  return (
    <>
        <Pressable onPress={() => setModalVisible(true)} disabled={isLoading || !!error}>
            <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                <View style={styles.pressableInput}>
                    <Text style={[styles.pressableText, selectedDisability === 'initial' && styles.placeholderText, error && styles.errorText]}>
                        {getDisplayText()}
                    </Text>
                </View>
            </NeumorphicInset>
        </Pressable>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <SafeAreaView>
                    <View style={styles.modalContent}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={{...theme.typography.body, color: theme.colors.text, marginTop: theme.spacing.m}}>Loading Disability Data...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={tempSelectedPercentage}
                                        onValueChange={(itemValue) => {
                                            setTempSelectedPercentage(itemValue);
                                            setTempSelectedStatus(null);
                                        }}
                                        style={styles.leftPicker}
                                        itemStyle={styles.pickerItem}
                                    >
                                        <Picker.Item label="N/A" value={null} />
                                        {percentageItems.map(item => (
                                            <Picker.Item key={item.label} label={item.label} value={item.value} />
                                        ))}
                                    </Picker>
                                    <Picker
                                        selectedValue={tempSelectedStatus}
                                        onValueChange={(itemValue) => setTempSelectedStatus(itemValue)}
                                        style={styles.rightPicker}
                                        itemStyle={styles.pickerItem}
                                    >
                                        {renderStatusPickerItems()}
                                    </Picker>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <PillButton title="Cancel" onPress={() => setModalVisible(false)} backgroundColor={theme.colors.error} textColor={theme.colors.primaryText} />
                                    <View style={{ width: theme.spacing.s }} />
                                    <PillButton title="Done" onPress={handleConfirm} backgroundColor={theme.colors.primary} />
                                </View>
                            </>
                        )}
                    </View>
                </SafeAreaView>
            </Pressable>
        </Modal>
    </>
  );
};

export default DisabilityPicker;
