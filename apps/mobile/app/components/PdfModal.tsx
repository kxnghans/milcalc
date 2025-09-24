import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@repo/ui';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

export default function PdfModal({ isModalVisible, setModalVisible }) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.5)',
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
            onRequestClose={() => {
                setModalVisible(!isModalVisible);
            }}
        >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        
                        {[{
                            name: "5 Year Chart Scoring",
                            url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/5%20Year%20Chart%20Scoring%20Including%20Optional%20Component%20Standards%20-%2020211111%200219.pdf'
                        }, {
                            name: "DAFMAN 36-2905",
                            url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf'
                        }, {
                            name: "Altitude Adjustments",
                            url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf#page=57'
                        }, {
                            name: "Walk Standards",
                            url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf#page=23'
                        }].map((pdf, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.button}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    Linking.openURL(pdf.url);
                                }}
                            >
                                <Text style={styles.textStyle}>{pdf.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!isModalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};