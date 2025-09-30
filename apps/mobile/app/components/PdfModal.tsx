import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';
import { useTheme, NeumorphicOutset } from '@repo/ui';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Asset } from 'expo-asset';

export default function PdfModal({ isModalVisible, setModalVisible, shadowOpacity, highlightOpacity, shadowRadius, highlightRadius, highlightColor: highlightColorProp }) {
    const { theme, isDarkMode } = useTheme();

    const pdfs = [
        {
            name: "Fitness Screening Questionnaire",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/Air Force Physical Fitness Screening Questionnaire v5.pdf'),
        },
        {
            name: "Fitness Assessment Scorecard",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/daf4446.pdf'),
        },
        {
            name: "5 Year Chart Scoring",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/5 Year Chart Scoring Including Optional Component Standards - 20211111 0219.pdf'),
        },
        {
            name: "DAFMAN 36-2905",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/dafman36-2905.pdf'),
        },
        {
            name: "Altitude Adjustments",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/dafman36-2905 altitude adjustments.pdf'),
        },
        {
            name: "Walk Standards",
            type: 'local',
            module: require('../../../../packages/ui/src/pt_data/dafman36-2905 walk.pdf'),
        }
    ];

    const handlePress = async (pdf) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (pdf.type === 'web') {
            await Linking.openURL(pdf.url);
        } else if (pdf.type === 'local') {
            const asset = Asset.fromModule(pdf.module);
            await asset.downloadAsync(); // Ensure the asset is downloaded
            await Linking.openURL(asset.localUri);
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
        buttonClose: {
            backgroundColor: "#2196F3",
        },
        textStyle: {
            color: theme.colors.text,
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            color: theme.colors.text
        },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ flex: 1 }}>
                {/* Background blur that closes modal */}
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                {/* Centered white card that does NOT close */}
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
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </NeumorphicOutset>
                </View>
            </View>
        </Modal>
    );
};