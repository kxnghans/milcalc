import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import type { ViewProps } from 'react-native';

const DismissKeyboardView = ({ children, ...props }: ViewProps) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
    <View {...props} style={[{ flex: 1 }, props.style]}>
      {children}
    </View>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
