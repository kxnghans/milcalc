/**
 * @file DocumentModal.tsx
 * @description This file defines a dynamic modal component that displays a list of documents fetched from the database.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, ActivityIndicator, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, PillButton, MASCOT_URLS } from '@repo/ui';
import { getDocumentsByCategory, openDocument, Tables } from '@repo/utils';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';

const DOCUMENTS_MASCOT = { uri: MASCOT_URLS.DOCUMENTS };

interface DocumentModalProps {
  category: string;
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function DocumentModal({ category, isModalVisible, setModalVisible }: DocumentModalProps) {
    const { theme } = useTheme();
    const [documents, setDocuments] = useState<Tables<'documents'>[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTopChevron, setShowTopChevron] = useState(false);
    const [showBottomChevron, setShowBottomChevron] = useState(false);
    const bounceAnim = useSharedValue(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    useEffect(() => {
        bounceAnim.value = withRepeat(
            withSequence(
                withTiming(5, { duration: 300 }),
                withTiming(0, { duration: 300 })
            ),
            -1,
            true
        );
    }, [bounceAnim]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: bounceAnim.value }],
        };
    });

    useEffect(() => {
        const fetchDocs = async () => {
            if (isModalVisible && category) {
                setIsLoading(true);
                setShowTopChevron(false);
                setShowBottomChevron(false);
                const fetchedDocuments = await getDocumentsByCategory(category);
                setDocuments(fetchedDocuments || []);
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, [isModalVisible, category]);

    const handleScroll = (event: { nativeEvent: { layoutMeasurement: { height: number }; contentOffset: { y: number }; contentSize: { height: number } } }) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtTop = contentOffset.y <= 0;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
        setShowTopChevron(!isAtTop);
        setShowBottomChevron(!isAtBottom);
    };

    const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
        const isScrollable = contentHeight > scrollViewHeight;
        setShowBottomChevron(isScrollable);
        if (!isScrollable) {
            setShowTopChevron(false);
        }
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
        loadingIndicator: {
            marginVertical: theme.spacing.xl,
        },
        documentItemContainer: {
            alignItems: 'center',
            marginBottom: 10,
        },
        documentRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        audioIcon: {
            marginRight: 5,
        },
        learnMoreText: {
            ...theme.typography.body,
            color: theme.colors.primary,
        }
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
                        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
                    ) : (
                        <>
                            {/* Persistent Header */}
                            <View style={styles.headerContainer}>
                                <ExpoImage source={DOCUMENTS_MASCOT} style={styles.mascot} contentFit="contain" />
                                <View style={styles.chevronContainer}>
                                    {showTopChevron && (
                                        <Animated.View style={animatedStyle}>
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
                                        <View key={index} style={styles.documentItemContainer}>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => openDocument(doc)}
                                                activeOpacity={1}
                                            >
                                                <View style={styles.documentRow}>
                                                    {doc.type === 'audio' && (
                                                        <MaterialCommunityIcons 
                                                            name="music-note" 
                                                            size={theme.typography.subtitle.fontSize} 
                                                            color={theme.colors.text} 
                                                            style={styles.audioIcon} 
                                                        />
                                                    )}
                                                    <Text style={styles.textStyle}>
                                                        {doc.name}
                                                        {doc.learn_more_uri && (
                                                            <Text style={styles.learnMoreText}> - Details</Text>
                                                        )}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Persistent Footer */}
                            <View style={styles.footerContainer}>
                                <View style={styles.chevronContainer}>
                                    {showBottomChevron && (
                                        <Animated.View style={animatedStyle}>
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
