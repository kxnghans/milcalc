import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, StyleProp, ViewStyle } from 'react-native';
import { NeumorphicInset, useTheme, StyledPicker, PillButton } from '@repo/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PickerInputProps {
  items: { label: string; value: any }[];
  selectedValue: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const PickerInput: React.FC<PickerInputProps> = ({ items, selectedValue, onValueChange, placeholder, style, disabled }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = (items || []).find(item => item.value === selectedValue)?.label || placeholder || 'Select...';
  const textColor = disabled ? theme.colors.disabled : (selectedValue ? theme.colors.text : theme.colors.placeholder);

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    pressable: {
      ...theme.typography.label,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.borderRadius.l,
        borderTopRightRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
    },

  });

  const pickerItems = [
    { label: placeholder || 'Select...', value: null },
    ...(items || []),
  ];

  return (
    <View style={[styles.wrapper, style]}>
        <NeumorphicInset style={{ borderRadius: theme.borderRadius.m, backgroundColor: theme.colors.inputBackground }}>
            <Pressable onPress={() => setModalVisible(true)} style={styles.pressable} disabled={disabled}>
                <Text style={{ color: textColor, flex: 1, textAlign: 'center' }}>{selectedLabel}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={disabled ? theme.colors.disabled : theme.colors.text} />
            </Pressable>
        </NeumorphicInset>

        <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <Pressable>
                    <View style={styles.modalContent}>
                        <PillButton title="Done" onPress={() => setModalVisible(false)} style={{ alignSelf: 'flex-end' }} />
                        <StyledPicker
                            items={pickerItems}
                            selectedValue={selectedValue}
                            onValueChange={onValueChange}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    </View>
  );
};

export default PickerInput;
