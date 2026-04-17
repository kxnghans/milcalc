import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { getAlphaColor } from "../theme";
import { PillButton } from "./PillButton";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: (date: Date | undefined) => void;
  value: Date | undefined;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onDone,
  value,
}) => {
  const { theme } = useTheme();
  const [tempDate, setTempDate] = React.useState(value);

  React.useEffect(() => {
    if (visible) {
      setTempDate(value || new Date());
    }
  }, [value, visible]);

  const overlayColor = getAlphaColor("#000000", 0.5);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <Pressable>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.colors.background,
                  padding: theme.spacing.m,
                },
              ]}
            >
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  style={styles.picker}
                  value={tempDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(_event, date) => {
                    if (date) {
                      setTempDate(date);
                    }
                  }}
                  textColor={theme.colors.text}
                />
              </View>
              <View style={styles.buttonContainer}>
                <PillButton title="Done" onPress={() => onDone(tempDate)} />
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    width: "100%",
    transform: [{ scale: 0.95 }],
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
