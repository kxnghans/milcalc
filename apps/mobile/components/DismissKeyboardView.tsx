import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';

const DismissKeyboardView = ({ children, ...props }: ViewProps) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <View {...props} style={[styles.container, props.style]}>
      {children}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DismissKeyboardView;
