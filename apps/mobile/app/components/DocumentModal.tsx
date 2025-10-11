/**
 * @file DocumentModal.tsx
 * @description This file defines a dynamic modal component that displays a list of documents fetched from the database.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useTheme, NeumorphicOutset, PillButton } from '@repo/ui';
import { getDocumentsByCategory } from '@repo/utils';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Asset } from 'expo-asset';

// Asset map to link database source keys to local require() paths
const localAssetMap = {
    'FITNESS_SCREENING_QUESTIONNAIRE': require('../../../../packages/data/pt_data/Air Force Physical Fitness Screening Questionnaire v5.pdf'),
    'FITNESS_ASSESSMENT_SCORECARD': require('../../../../packages/data/pt_data/daf4446.pdf'),
    '5_YEAR_CHART_SCORING': require('../../../../packages/data/pt_data/5 Year Chart Scoring Including Optional Component Standards - 20211111 0219.pdf'),
    'DAFMAN_36_2905': require('../../../../packages/data/pt_data/dafman36-2905.pdf'),
    'ALTITUDE_ADJUSTMENTS': require('../../../../packages/data/pt_data/dafman36-2905 altitude adjustments.pdf'),
    'WALK_STANDARDS': require('../../../../packages/data/pt_data/dafman36-2905 walk.pdf'),
    'FMR_HDIP': require('../../../../packages/data/pay_data/finance_charts/DoD 7000.14-R Financial Management Regulation Hazardous Duty Incentive Pay HDIP Aerial.pdf'),
    'FMR_BAS': require('../../../../packages/data/pay_data/finance_charts/DoD 7000.14-R Financial Management Regulation Basic Allowance for Subsistence BAS.pdf'),
    'IRS_TAX_ADJUSTMENTS_2025': require('../../../../packages/data/pay_data/finance_charts/IRS Revenue Procedure 2024-40.pdf'),
    'BAH_RATES_2025': require('../../../../packages/data/pay_data/BAH/2025 BAH Rates.pdf'),
    'BAH_OOP_2025': require('../../../../packages/data/pay_data/BAH/2025a-BAH_OOP_Amounts.pdf'),
    'BAH_COMPONENTS_2025': require('../../../../packages/data/pay_data/BAH/2025a-BAH-Rate-Component-Breakdown.pdf'),
    'BAH_NON_LOCALITY_2025': require('../../../../packages/data/pay_data/BAH/2025a-Non-Locality-BAH-Rates.pdf'),
    'FMR_BAH': require('../../../../packages/data/pay_data/BAH/DoD 7000.14-R Financial Management Regulation 07a_26.pdf'),
};

export default function DocumentModal({ category, isModalVisible, setModalVisible, shadowOpacity, highlightOpacity, shadowRadius, highlightRadius, highlightColor: highlightColorProp }) {
    const { theme, isDarkMode } = useTheme();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            if (isModalVisible && category) {
                setIsLoading(true);
                const fetchedDocuments = await getDocumentsByCategory(category);
                setDocuments(fetchedDocuments);
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, [isModalVisible, category]);

    const handlePress = async (doc) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (doc.type === 'web') {
            await Linking.openURL(doc.source);
        } else if (doc.type === 'local') {
            const assetModule = localAssetMap[doc.source];
            if (assetModule) {
                const asset = Asset.fromModule(assetModule);
                await asset.downloadAsync();
                await Linking.openURL(asset.localUri);
            }
        }
    };

    const handleLearnMore = (uri) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL(uri);
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
            padding: theme.spacing.l,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            maxWidth: '90%',
            minWidth: '40%',
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
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <View style={styles.centeredView} pointerEvents="box-none">
                    <NeumorphicOutset
                        shadowOpacity={shadowOpacity}
                        highlightOpacity={highlightOpacity || finalHighlightOpacity}
                        shadowRadius={shadowRadius}
                        highlightRadius={highlightRadius}
                        highlightColor={highlightColor}
                    >
                        <View style={styles.modalView}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            ) : (
                                documents.map((doc, index) => (
                                                                                                    <View key={index} style={{alignItems: 'center', marginBottom: 10}}>
                                                                                                        <TouchableOpacity
                                                                                                            style={styles.button}
                                                                                                            onPress={() => doc.learn_more_uri ? handleLearnMore(doc.learn_more_uri) : handlePress(doc)}
                                                                                                        >
                                                                                                            <Text style={styles.textStyle}>
                                                                                                                {doc.name}
                                                                                                                {doc.learn_more_uri && (
                                                                                                                    <Text style={{...theme.typography.body, color: theme.colors.primary}}> - Details</Text>
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </TouchableOpacity>
                                                                                                    </View>                                ))
                            )}
                            <PillButton title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </NeumorphicOutset>
                </View>
            </View>
        </Modal>
    );
};