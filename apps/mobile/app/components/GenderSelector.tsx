import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton, useTheme } from '@repo/ui';
import { ICONS, ICON_SETS } from '@repo/ui/icons';

export default function GenderSelector({ gender, setGender }) {
    const { theme, isDarkMode } = useTheme();
    const styles = StyleSheet.create({
        genderSelectorContainer: {
            flexDirection: "row",
            overflow: 'hidden',
            borderRadius: theme.borderRadius.m,
        },
    });

    return (
        <View style={styles.genderSelectorContainer}>
            <StyledButton
                title="Male"
                onPress={() => setGender("male")}
                variant={gender === 'male' ? 'primary' : 'secondary'}
                size="small"
                style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                iconSet={ICON_SETS.FONTISTO}
                icon={ICONS.GENDER_MALE}
                highlightOpacity={isDarkMode ? 0.33 : undefined}
            />
            <StyledButton
                title="Female"
                onPress={() => setGender("female")}
                variant={gender === 'female' ? 'primary' : 'secondary'}
                size="small"
                style={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                iconSet={ICON_SETS.FONTISTO}
                icon={ICONS.GENDER_FEMALE}
                highlightOpacity={isDarkMode ? 0.33 : undefined}
            />
        </View>
    );
};