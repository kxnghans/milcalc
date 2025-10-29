/**
 * @file GenderSelector.tsx
 * @description This file defines a component for selecting gender, consisting of two
 * styled buttons for "Male" and "Female".
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton, useTheme } from '@repo/ui';
import { ICONS, ICON_SETS } from '@repo/ui/icons';

/**
 * A component that renders a gender selection control using two styled buttons.
 * @param {object} props - The component props.
 * @param {string} props.gender - The currently selected gender ('male' or 'female').
 * @param {(gender: string) => void} props.setGender - The function to update the selected gender.
 * @returns {JSX.Element} The rendered gender selector component.
 */
export default function GenderSelector({ gender, setGender }) {
    const { theme, isDarkMode } = useTheme();
    const styles = StyleSheet.create({
        genderSelectorContainer: {
            flexDirection: "row",
            overflow: 'hidden',
            borderRadius: theme.borderRadius.m,
        },
        // Custom style for the text of the inactive button.
        inactiveText: {
            textShadowColor: isDarkMode ? 'black' : undefined,
            textShadowRadius: 1,
            textShadowOffset: { width: 0, height: 0 },
            color: theme.colors.primary,
        }
    });

    return (
        <View style={styles.genderSelectorContainer}>
            <StyledButton
                title="Male"
                onPress={() => setGender("male")}
                // The button variant is 'primary' if selected, otherwise 'secondary'.
                variant={gender === 'male' ? 'primary' : 'secondary'}
                textStyle={gender !== 'male' ? styles.inactiveText : {}}
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
                textStyle={gender !== 'female' ? styles.inactiveText : {}}
                size="small"
                style={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                iconSet={ICON_SETS.FONTISTO}
                icon={ICONS.GENDER_FEMALE}
                highlightOpacity={isDarkMode ? 0.33 : undefined}
            />
        </View>
    );
};