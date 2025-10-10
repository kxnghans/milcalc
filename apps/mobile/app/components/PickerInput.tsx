import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native';
import { NeumorphicInset, useTheme, StyledPicker, PillButton } from '@repo/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PickerInputProps {
  items: { label: string; value: any }[];
  selectedValue: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
}

const PickerInput: React.FC<PickerInputProps> = ({ items, selectedValue, onValueChange, placeholder }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = (items || []).find(item => item.value === selectedValue)?.label || placeholder || 'Select...';
  const textColor = selectedValue ? theme.colors.text : theme.colors.placeholder;

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

  return (
    <View style={styles.wrapper}>
        <NeumorphicInset style={{ borderRadius: theme.borderRadius.m, backgroundColor: theme.colors.inputBackground }}>
            <Pressable onPress={() => setModalVisible(true)} style={styles.pressable}>
                <Text style={{ color: textColor }}>{selectedLabel}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.text} />
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
                            items={items || []}
                            selectedValue={selectedValue}
                            onValueChange={(value) => {
                                if (value !== null) {
                                    onValueChange(value);
                                }
                            }}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    </View>
  );
};

export default PickerInput;
