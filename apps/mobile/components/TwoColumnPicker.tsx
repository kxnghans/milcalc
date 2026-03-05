import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme, NeumorphicInset, PillButton, getAlphaColor } from '@repo/ui';

interface TwoColumnPickerProps {
  data: Record<string, { label: string; value: string | number | null }[]> | null;
  onChange: (value: string | number | null, primary: string) => void;
  selectedValue: string | number | null;
  displayName: string;
  isLoading: boolean;
  error: unknown;
  primaryColumnValue?: string | null;
  primaryItems?: string[];
  primaryPlaceholder?: string;
  secondaryPlaceholder?: string;
  primarySort?: (a: string, b: string) => number;
  style?: ViewStyle | ViewStyle[];
}

const TwoColumnPicker: React.FC<TwoColumnPickerProps> = ({ 
  data, 
  onChange, 
  selectedValue, 
  displayName, 
  isLoading, 
  error, 
  primaryColumnValue: propPrimaryColumnValue, 
  primaryItems: propPrimaryItems,
  primaryPlaceholder = '...', 
  secondaryPlaceholder = 'Select an option', 
  primarySort, 
  style 
}) => {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [primaryColumnItems, setPrimaryColumnItems] = useState<string[]>([]);
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
        if (propPrimaryItems) {
            setPrimaryColumnItems([primaryPlaceholder, ...propPrimaryItems]);
        } else if (data && Object.keys(data).length > 0) {
            const primaryKeys = Object.keys(data).sort(primarySort);
            const primaryList = [primaryPlaceholder, ...primaryKeys];
            setPrimaryColumnItems(primaryList);
        }

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
}, [data, modalVisible, selectedValue, propPrimaryColumnValue, primaryPlaceholder, propPrimaryItems, primarySort]);

  const handlePrimaryChange = (primary: string) => {
    setSelectedPrimary(primary);
    if (primary === primaryPlaceholder) {
        setTempSelectedValue('');
    } else if (primary && data) {
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

  const styles = StyleSheet.create({
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
        backgroundColor: getAlphaColor('#000000', 0.5),
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
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginTop: theme.spacing.m,
    },
    spacer: {
        width: theme.spacing.s,
    }
  });

  const getDisplayText = () => {
    if (isLoading) return 'Loading Data...';
    if (error) return String(error);
    return displayName;
  };

  return (
    <View style={style}>
        <Pressable onPress={() => setModalVisible(true)} disabled={isLoading || !!error}>
            <NeumorphicInset style={{ borderRadius: theme.borderRadius.m }}>
                <View style={styles.pressableInput}>
                    <Text style={[styles.pressableText, (!selectedValue || selectedValue === 'initial') && styles.placeholderText, !!error && (styles.errorText as TextStyle)]}>
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
            <Pressable style={styles.modalOverlay} onPress={handleCancel}>
                <Pressable>
                    <View style={[styles.modalContent, { paddingBottom: bottom || theme.spacing.s }]}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.loadingText}>Loading...</Text>
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
                                        enabled={selectedPrimary !== primaryPlaceholder}
                                        itemStyle={styles.pickerItem}
                                    >
                                        {secondaryColumnItems.length > 0 ? (
                                        secondaryColumnItems.map((item: { label: string; value: string | number | null }) => (
                                            <Picker.Item key={String(item.value)} label={item.label} value={item.value} />
                                        ))
                                        ) : (
                                            <Picker.Item label={secondaryPlaceholder} value="" enabled={false} />
                                        )}
                                    </Picker>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <PillButton title="Cancel" onPress={handleCancel} backgroundColor={theme.colors.error} textColor={theme.colors.primaryText} />
                                    <View style={styles.spacer} />
                                    <PillButton title="Done" onPress={handleConfirm} disabled={!selectedPrimary || selectedPrimary === primaryPlaceholder} backgroundColor={theme.colors.primary} />
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    </View>
  );
};

export default TwoColumnPicker;
