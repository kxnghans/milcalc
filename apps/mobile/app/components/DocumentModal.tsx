/**
 * @file DocumentModal.tsx
 * @description This file defines a dynamic modal component that displays a list of documents fetched from the database.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, TouchableWithoutFeedback, ActivityIndicator, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, PillButton } from '@repo/ui';
import { getDocumentsByCategory } from '@repo/utils';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Asset } from 'expo-asset';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mascotAsset = require('../../assets/3d_documents.png');

// Asset map to link database source keys to local require() paths
const localAssetMap = {
    'FITNESS_SCREENING_QUESTIONNAIRE': require('../../../../packages/data/pt_data/Air Force Physical Fitness Screening Questionnaire v5.pdf'),
    'FITNESS_ASSESSMENT_SCORECARD': require('../../../../packages/data/pt_data/daf4446.pdf'),
    '5_YEAR_CHART_SCORING': require('../../../../packages/data/pt_data/5 Year Chart Scoring Including Optional Component Standards - 20211111 0219.pdf'),
    'DAFMAN_36_2905': require('../../../../packages/data/pt_data/dafman36-2905.pdf'),
    'ALTITUDE_ADJUSTMENTS': require('../../../../packages/data/pt_data/dafman36-2905 altitude adjustments.pdf'),
    'WALK_STANDARDS': require('../../../../packages/data/pt_data/dafman36-2905 walk.pdf'),
    'FMR_BASE_PAY': require('../../../../packages/data/pay_data/finance_charts/DoD 7000.14-R Financial Management Regulation Base Pay.pdf'),
    'FMR_BAS': require('../../../../packages/data/pay_data/finance_charts/DoD 7000.14-R Financial Management Regulation Basic Allowance for Subsistence BAS.pdf'),
    'IRS_TAX_ADJUSTMENTS_2025': require('../../../../packages/data/pay_data/finance_charts/IRS Revenue Procedure 2024-40.pdf'),
    'BAH_RATES_2025': require('../../../../packages/data/pay_data/BAH/2025 BAH Rates.pdf'),
    'BAH_OOP_2025': require('../../../../packages/data/pay_data/BAH/2025a-BAH_OOP_Amounts.pdf'),
    'BAH_COMPONENTS_2025': require('../../../../packages/data/pay_data/BAH/2025a-BAH-Rate-Component-Breakdown.pdf'),
    'BAH_NON_LOCALITY_2025': require('../../../../packages/data/pay_data/BAH/2025a-Non-Locality-BAH-Rates.pdf'),
};

export default function DocumentModal({ category, isModalVisible, setModalVisible }) {
    const { theme } = useTheme();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTopChevron, setShowTopChevron] = useState(false);
    const [showBottomChevron, setShowBottomChevron] = useState(false);
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 5,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [bounceAnim]);

    useEffect(() => {
        const fetchDocs = async () => {
            if (isModalVisible && category) {
                setIsLoading(true);
                setShowTopChevron(false);
                setShowBottomChevron(false);
                const fetchedDocuments = await getDocumentsByCategory(category);
                setDocuments(fetchedDocuments);
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, [isModalVisible, category]);

    const handleScroll = (event: { nativeEvent: { layoutMeasurement: { height: any; }; contentOffset: { y: any; }; contentSize: { height: any; }; }; }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtTop = contentOffset.y <= 0;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
        setShowTopChevron(!isAtTop);
        setShowBottomChevron(!isAtBottom);
    };

    const handleContentSizeChange = (contentWidth: any, contentHeight: number) => {
        const isScrollable = contentHeight > scrollViewHeight;
        setShowBottomChevron(isScrollable);
        if (!isScrollable) {
            setShowTopChevron(false);
        }
    };

    const handlePress = async (doc: { type: string; source: any; }) => {
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

    const handleLearnMore = (uri: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL(uri);
    };

    const CHEVRON_HEIGHT = 24 + theme.spacing.s;
    const HEADER_HEIGHT = theme.mascot.height + CHEVRON_HEIGHT;
    const FOOTER_HEIGHT = CHEVRON_HEIGHT + 44 + theme.spacing.l; // chevron + button height + padding
    const MAX_SCROLL_HEIGHT = Dimensions.get('window').height * 0.85 - HEADER_HEIGHT - FOOTER_HEIGHT - (theme.spacing.l * 2);

    const styles = StyleSheet.create({
        mascot: {
            width: theme.mascot.width,
            height: theme.mascot.height,
        },
        centeredView: {
            flex: 1,
            alignItems: "center",
        },
        modalView: {
            margin: 20,
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
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
            marginTop: 'auto',
            marginBottom: 'auto',
            maxHeight: Dimensions.get('window').height * 0.85,
            overflow: 'hidden',
        },
        headerContainer: {
            width: '100%',
            alignItems: 'center',
            paddingTop: theme.spacing.l,
            paddingHorizontal: theme.spacing.l,
            backgroundColor: theme.colors.surface,
        },
        chevronContainer: {
            height: CHEVRON_HEIGHT,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        scrollContainer: {
            width: '100%',
            maxHeight: MAX_SCROLL_HEIGHT,
            paddingHorizontal: theme.spacing.l,
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
        },
        footerContainer: {
            width: '100%',
            alignItems: 'center',
            paddingBottom: theme.spacing.l,
            paddingHorizontal: theme.spacing.l,
            backgroundColor: theme.colors.surface,
        },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={styles.centeredView}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
                    ) : (
                        <>
                            {/* Persistent Header */}
                            <View style={styles.headerContainer}>
                                <Image source={mascotAsset} style={styles.mascot} resizeMode="contain" />
                                <View style={styles.chevronContainer}>
                                    {showTopChevron && (
                                        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                                            <MaterialCommunityIcons name="chevron-up" size={24} color={theme.colors.primary} />
                                        </Animated.View>
                                    )}
                                </View>
                            </View>

                            {/* Scrollable Content */}
                            <View style={styles.scrollContainer}>
                                <ScrollView
                                    ref={scrollViewRef}
                                    showsVerticalScrollIndicator={false}
                                    onScroll={handleScroll}
                                    onContentSizeChange={handleContentSizeChange}
                                    onLayout={(event) => {
                                        const { height } = event.nativeEvent.layout;
                                        setScrollViewHeight(height);
                                    }}
                                    scrollEventThrottle={16}
                                >
                                    {documents.map((doc, index) => (
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
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Persistent Footer */}
                            <View style={styles.footerContainer}>
                                <View style={styles.chevronContainer}>
                                    {showBottomChevron && (
                                        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                                            <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.primary} />
                                        </Animated.View>
                                    )}
                                </View>
                                <PillButton title="Close" onPress={() => setModalVisible(false)} />
                            </View>
                        </>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
}