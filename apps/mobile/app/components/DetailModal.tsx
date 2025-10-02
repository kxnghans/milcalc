/**
 * @file DetailModal.tsx
 * @description This file defines a modal component that displays detailed help information
 * for a specific PT component, sourced from a JSON file.
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, NeumorphicOutset } from '@repo/ui';
import { BlurView } from 'expo-blur';
import helpDetails from '../../../../packages/ui/src/pt_data/help-details.json';
import { getDynamicHelpText } from '@repo/utils';

interface DetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  contentKey: string | null;
  age?: number;
  gender?: string;
  performance?: any;
}

export default function DetailModal({ isVisible, onClose, contentKey, age, gender, performance }: DetailModalProps) {
    const { theme } = useTheme();
    const content = contentKey ? helpDetails[contentKey] : null;

    const dynamicHelpText = (contentKey && age && gender && performance) 
        ? getDynamicHelpText(contentKey, age, gender, performance) 
        : null;

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.l,
        },
        modalView: {
            width: '100%',
            flexShrink: 1, // Allow the view to shrink to its content's size
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: theme.spacing.l,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        title: {
            ...theme.typography.title,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.m,
        },
        sectionHeader: {
            ...theme.typography.subtitle,
            color: theme.colors.text,
            marginTop: theme.spacing.m,
            marginBottom: theme.spacing.s,
        },
        sectionContent: {
            ...theme.typography.body,
            color: theme.colors.text,
        },
        dynamicScoring: {
            ...theme.typography.body,
            color: theme.colors.primary,
            textAlign: 'center',
            marginTop: theme.spacing.m,
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            marginTop: theme.spacing.l,
        },
        buttonClose: {
            backgroundColor: "#2196F3",
        },
        textStyle: {
            color: theme.colors.primaryText,
            fontWeight: "bold",
            textAlign: "center"
        },
    });

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {/* A blurred background that closes the modal when pressed. */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                {/* The main modal content, centered on the screen. */}
                <View style={styles.centeredView} pointerEvents="box-none">
                    <NeumorphicOutset>
                        <View style={styles.modalView}>
                            {content ? (
                                <>
                                    <Text style={styles.title}>{content.title}</Text>
                                    <ScrollView>
                                        {content.sections.map((section, index) => (
                                            <View key={index}>
                                                <Text style={styles.sectionHeader}>{section.header}</Text>
                                                <Text style={styles.sectionContent}>{section.content}</Text>
                                            </View>
                                        ))}
                                        {dynamicHelpText && <Text style={styles.dynamicScoring}>{dynamicHelpText}</Text>}
                                    </ScrollView>
                                    <NeumorphicOutset>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={onClose}
                                        >
                                            <Text style={styles.textStyle}>Close</Text>
                                        </TouchableOpacity>
                                    </NeumorphicOutset>
                                </>
                            ) : (
                                // Fallback in case contentKey is invalid
                                <Text style={styles.title}>Information not available.</Text>
                            )}
                        </View>
                    </NeumorphicOutset>
                </View>
            </SafeAreaView>
        </Modal>
    );
};