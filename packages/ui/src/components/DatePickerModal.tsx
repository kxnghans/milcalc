
import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';
import { PillButton } from './PillButton';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: (date: Date | undefined) => void;
  value: Date | undefined;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, onClose, onDone, value }) => {
  const { theme } = useTheme();
  const [tempDate, setTempDate] = React.useState(value);

  React.useEffect(() => {
    if (visible) {
      setTempDate(value || new Date());
    }
  }, [value, visible]);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable>
            <View style={{ backgroundColor: theme.colors.background, padding: theme.spacing.m, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <DateTimePicker
                  style={{ width: '100%', transform: [{ scale: 0.95 }] }}
                  value={tempDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) {
                      setTempDate(date);
                    }
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <PillButton title="Done" onPress={() => onDone(tempDate)} />
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
