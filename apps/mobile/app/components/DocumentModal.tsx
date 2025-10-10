/**
 * @file DocumentModal.tsx
 * @description This file defines a modal component that displays a list of relevant PDF documents
 * for the user to view. It handles opening both local and web-based PDFs.
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';
import { useTheme, NeumorphicOutset, PillButton } from '@repo/ui';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Asset } from 'expo-asset';

/**
 * A modal component that presents a list of PDF documents for the user to open.
 * @param {object} props - The component props.
 * @param {boolean} props.isModalVisible - Whether the modal is currently visible.
 * @param {(visible: boolean) => void} props.setModalVisible - A function to set the modal's visibility.
 * @param {number} [props.shadowOpacity] - Custom shadow opacity for the neumorphic effect.
 * @param {number} [props.highlightOpacity] - Custom highlight opacity for the neumorphic effect.
 * @param {number} [props.shadowRadius] - Custom shadow radius for the neumorphic effect.
 * @param {number} [props.highlightRadius] - Custom highlight radius for the neumorphic effect.
 * @param {string} [props.highlightColor] - Custom highlight color for the neumorphic effect.
 * @returns {JSX.Element} The rendered PDF modal component.
 */
export default function DocumentModal({ isModalVisible, setModalVisible, shadowOpacity, highlightOpacity, shadowRadius, highlightRadius, highlightColor: highlightColorProp }) {
    const { theme, isDarkMode } = useTheme();

    // An array of PDF documents to be displayed in the modal.
    const pdfs = [
        {
            name: "Fitness Screening Questionnaire",
            type: 'local', // 'local' PDFs are bundled with the app.
            module: require('../../../../packages/data/pt_data/Air Force Physical Fitness Screening Questionnaire v5.pdf'),
        },
        {
            name: "Fitness Assessment Scorecard",
            type: 'local',
            module: require('../../../../packages/data/pt_data/daf4446.pdf'),
        },
        {
            name: "5 Year Chart Scoring",
            type: 'local',
            module: require('../../../../packages/data/pt_data/5 Year Chart Scoring Including Optional Component Standards - 20211111 0219.pdf'),
        },
        {
            name: "DAFMAN 36-2905",
            type: 'local',
            module: require('../../../../packages/data/pt_data/dafman36-2905.pdf'),
        },
        {
            name: "Altitude Adjustments",
            type: 'local',
            module: require('../../../../packages/data/pt_data/dafman36-2905 altitude adjustments.pdf'),
        },
        {
            name: "Walk Standards",
            type: 'local',
            module: require('../../../../packages/data/pt_data/dafman36-2905 walk.pdf'),
        }
    ];

    /**
     * Handles the press event for a PDF item. It opens the PDF using the device's default viewer.
     * @param {object} pdf - The PDF object from the `pdfs` array.
     */
    const handlePress = async (pdf) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (pdf.type === 'web') {
            // For web PDFs, open the URL directly.
            await Linking.openURL(pdf.url);
        } else if (pdf.type === 'local') {
            // For local PDFs, use Expo's Asset and Linking APIs.
            const asset = Asset.fromModule(pdf.module);
            await asset.downloadAsync(); // Ensure the asset is downloaded and available locally.
            await Linking.openURL(asset.localUri); // Open the local file URI.
        }
    };

    const highlightColor = highlightColorProp || 'rgba(0,0,0,1)';
    const finalHighlightOpacity = isDarkMode ? 0.05 : 0.02;

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            marginBottom: 10,
        },
        textStyle: {
            ...theme.typography.subtitle,
            color: theme.colors.text,
        }

    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ flex: 1 }}>
                {/* A blurred background that closes the modal when pressed. */}
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                {/* The main modal content, centered on the screen. */}
                <View style={styles.centeredView} pointerEvents="box-none">
                    <NeumorphicOutset
                        shadowOpacity={shadowOpacity}
                        highlightOpacity={highlightOpacity || finalHighlightOpacity}
                        shadowRadius={shadowRadius}
                        highlightRadius={highlightRadius}
                        highlightColor={highlightColor}
                    >
                        <View style={styles.modalView}>
                            {pdfs.map((pdf, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.button}
                                    onPress={() => handlePress(pdf)}
                                >
                                    <Text style={styles.textStyle}>{pdf.name}</Text>
                                </TouchableOpacity>
                            ))}
                            <PillButton title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </NeumorphicOutset>
                </View>
            </View>
        </Modal>
    );
};