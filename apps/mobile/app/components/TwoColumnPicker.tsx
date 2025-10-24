import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Button, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme, NeumorphicInset, PillButton } from '@repo/ui';

const TwoColumnPicker = ({ data, onChange, selectedValue, displayName, isLoading, error, primaryColumnValue: propPrimaryColumnValue, primaryPlaceholder = '...', secondaryPlaceholder = 'Select an option' }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [primaryColumnItems, setPrimaryColumnItems] = useState([]);
  const [selectedPrimary, setSelectedPrimary] = useState(propPrimaryColumnValue || '');
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);

  const secondaryColumnItems = useMemo(() => {
    if (selectedPrimary && data && data[selectedPrimary]) {
        return data[selectedPrimary];
    }
    return [];
  }, [selectedPrimary, data]);

  useEffect(() => {
    if (modalVisible) {
        if (data && Object.keys(data).length > 0) {
            const primaryKeys = Object.keys(data).sort();
            const primaryList = [primaryPlaceholder, ...primaryKeys];
            setPrimaryColumnItems(primaryList);
            
            if (selectedValue === 'initial') {
                setSelectedPrimary(primaryPlaceholder);
                setTempSelectedValue('');
            } else if (selectedValue) {
                const primary = propPrimaryColumnValue || primaryPlaceholder;
                setSelectedPrimary(primary);
                setTempSelectedValue(selectedValue);
            } else {
                setSelectedPrimary(primaryPlaceholder);
                setTempSelectedValue('');
            }
        }
    }
}, [data, modalVisible, selectedValue, propPrimaryColumnValue, primaryPlaceholder]);

  const handlePrimaryChange = (primary) => {
    setSelectedPrimary(primary);
    if (primary === primaryPlaceholder) {
        setTempSelectedValue('');
    } else if (primary) {
        const newSecondaryItems = data[primary] || [];
        if (newSecondaryItems.length > 0) {
          setTempSelectedValue(newSecondaryItems[0].value);
        } else {
          setTempSelectedValue(null);
        }
    } else {
        setTempSelectedValue(null);
    }
  };

  const handleConfirm = () => {
    onChange(tempSelectedValue, selectedPrimary);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedValue(selectedValue);
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
    if (isLoading) return 'Loading Data...';
    if (error) return error;
    return displayName;
  };

  return (
    <>
        <Pressable onPress={() => setModalVisible(true)} disabled={isLoading || !!error}>
            <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                <View style={styles.pressableInput}>
                    <Text style={[styles.pressableText, (!selectedValue || selectedValue === 'initial') && styles.placeholderText, error && styles.errorText]}>
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
                            <Text style={{...theme.typography.body, color: theme.colors.text, marginTop: theme.spacing.m}}>Loading...</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedPrimary}
                                    onValueChange={handlePrimaryChange}
                                    style={styles.leftPicker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {primaryColumnItems.map(item => (
                                    <Picker.Item key={item} label={item} value={item} />
                                    ))}
                                </Picker>
                                <Picker
                                    selectedValue={tempSelectedValue}
                                    onValueChange={(itemValue) => setTempSelectedValue(itemValue)}
                                    style={styles.rightPicker}
                                    enabled={selectedPrimary !== primaryPlaceholder && secondaryColumnItems.length > 0}
                                    itemStyle={styles.pickerItem}
                                >
                                    {selectedPrimary === primaryPlaceholder ? (
                                        <Picker.Item label={secondaryPlaceholder} value="" enabled={false} />
                                    ) : secondaryColumnItems.length === 0 ? (
                                        <Picker.Item label="No options" value="" enabled={false} />
                                    ) : (
                                      secondaryColumnItems.map(item => (
                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                      ))
                                    )}
                                </Picker>
                            </View>
                            <View style={styles.buttonContainer}>
                                <PillButton title="Cancel" onPress={handleCancel} backgroundColor={theme.colors.error} textColor={theme.colors.primaryText} />
                                <View style={{ width: theme.spacing.s }} />
                                <PillButton title="Done" onPress={handleConfirm} disabled={!tempSelectedValue} backgroundColor={theme.colors.primary} />
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