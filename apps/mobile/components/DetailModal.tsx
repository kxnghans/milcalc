import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, ActivityIndicator, ImageSourcePropType, Dimensions } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, PillButton } from '@repo/ui';
import { BlurView } from 'expo-blur';
import { getHelpContentFromSource } from '@repo/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';

import { Tables } from '@repo/utils';

type HelpContent = Tables<'pt_help_details'> & Tables<'pay_help_details'> & Tables<'retirement_help_details'> & Tables<'best_score_help_details'>;

interface DetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  contentKey: string | null;
  source: 'pt' | 'pay' | 'retirement' | 'best_score';
  mascotAsset?: ImageSourcePropType | null;
}

export default function DetailModal({ isVisible, onClose, contentKey, source, mascotAsset }: DetailModalProps) {
    const { theme } = useTheme();
    const [content, setContent] = useState<HelpContent[] | null>(null);
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
        if (isVisible && contentKey && source) {
            const fetchContent = async () => {
                setIsLoading(true);
                setContent(null);
                setShowTopChevron(false);
                setShowBottomChevron(false);
                const data = await getHelpContentFromSource(source, contentKey);
                setContent(data as HelpContent[]);
                setIsLoading(false);
            };
            fetchContent();
        } else {
            setContent(null);
        }
    }, [isVisible, contentKey, source]);

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
    const TITLE_HEIGHT = theme.typography.title.fontSize + theme.spacing.xs;
    const HEADER_HEIGHT = theme.mascot.height + TITLE_HEIGHT + CHEVRON_HEIGHT;
    const FOOTER_HEIGHT = CHEVRON_HEIGHT + 44 + theme.spacing.l; // chevron + button height + padding
    const MAX_SCROLL_HEIGHT = Dimensions.get('window').height * 0.85 - HEADER_HEIGHT - FOOTER_HEIGHT - (theme.spacing.l * 2);

    const styles = React.useMemo(() => StyleSheet.create({
        safeArea: {
            flex: 1,
            alignItems: "center",
            paddingHorizontal: theme.spacing.l,
        },
        mascot: {
            width: theme.mascot.width,
            height: theme.mascot.height,
        },
        modalView: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
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
        title: {
            ...theme.typography.title,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.xs,
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
        sectionHeader: {
            ...theme.typography.subtitle,
            color: theme.colors.text,
            marginTop: theme.spacing.m,
            marginBottom: theme.spacing.s,
            textAlign: 'left',
        },
        sectionContent: {
            ...theme.typography.body,
            color: theme.colors.text,
            textAlign: 'left',
        },
        footerContainer: {
            width: '100%',
            alignItems: 'center',
            paddingBottom: theme.spacing.l,
            paddingHorizontal: theme.spacing.l,
            backgroundColor: theme.colors.surface,
        },
        boldText: {
            fontWeight: 'bold',
        },
        italicText: {
            fontStyle: 'italic',
        },
        underlineText: {
            textDecorationLine: 'underline',
        },
        markdownParagraph: {
            marginBottom: theme.spacing.s,
        },
        loadingIndicator: {
            marginVertical: theme.spacing.xl,
        },
    }), [theme, MAX_SCROLL_HEIGHT, CHEVRON_HEIGHT]);

    const parseMarkdown = (text: string) => {
        if (!text) return null;
        // Handle literal \n string sequences that may come from DB/JSON escaping
        const cleanedText = text.replace(/\\n/g, '\n');
        const paragraphs = cleanedText.split('\n\n');
        return paragraphs.map((paragraph, pIndex) => {
            const parts = paragraph.match(/[^*_]+|(\*\*.*?\*\*|\*.*?\*|_.*?_)/g) || [];
            const styledText = parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <Text key={index} style={styles.boldText}>{part.slice(2, -2)}</Text>;
                } else if (part.startsWith('*') && part.endsWith('*')) {
                    return <Text key={index} style={styles.italicText}>{part.slice(1, -1)}</Text>;
                } else if (part.startsWith('_') && part.endsWith('_')) {
                    return <Text key={index} style={styles.underlineText}>{part.slice(1, -1)}</Text>;
                }
                return <Text key={index}>{part}</Text>;
            });
            return <Text key={pIndex} style={[styles.sectionContent, styles.markdownParagraph]}>{styledText}</Text>;
        });
    };

    const renderSections = (item: HelpContent) => {
        const sections: React.ReactElement[] = [];
        const createSection = (header: string, content: string, key: string) => {
            sections.push(
                <View key={key}> 
                    <Text style={styles.sectionHeader}>{header}</Text>
                    {parseMarkdown(content)}
                </View>
            );
        }
        switch (source) {
            case 'pt':
            case 'best_score':
                if (item.section_header && item.section_content) {
                    createSection(item.section_header, item.section_content, item.section_header);
                }
                break;
            case 'pay':
                if (item.purpose_description) {
                    createSection("Purpose Description", item.purpose_description, "purpose_description");
                }
                if (item.calculation_details) {
                    createSection("Calculation Details", item.calculation_details, "calculation_details");
                }
                if (item.example) {
                    createSection("Example", item.example, "example");
                }
                if (item.recipient_group) {
                    createSection("Recipient Group", item.recipient_group, "recipient_group");
                }
                if (item.report_section) {
                    createSection("Report Section", item.report_section, "report_section");
                }
                break;
            case 'retirement':
                if (item.purpose_description) {
                    createSection("Purpose Description", item.purpose_description, "purpose_description");
                }
                if (item.calculation_details) {
                    createSection("Calculation Details", item.calculation_details, "calculation_details");
                }
                if (item.example) {
                    createSection("Example", item.example, "example");
                }
                break;
        }
        return sections;
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
                    ) : content && content.length > 0 ? (
                        <>
                            {/* Persistent Header */}
                            <View style={styles.headerContainer}>
                                {mascotAsset && <ExpoImage source={mascotAsset} style={styles.mascot} contentFit="contain" />}
                                <Text style={styles.title}>{content[0].title}</Text>
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
                                    contentContainerStyle={{ }}
                                >
                                    {[...content]
                                        .sort((a, b) => {
                                            const sectionOrder = ['Performance', 'Resting', 'Scoring', 'Exemption'];
                                            const aIndex = sectionOrder.indexOf(a.section_header || '');
                                            const bIndex = sectionOrder.indexOf(b.section_header || '');
                                            return aIndex - bIndex;
                                        })
                                        .map((item, index) => <View key={index}>{renderSections(item)}</View>)}
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
                                <PillButton title="Close" onPress={onClose} />
                            </View>
                        </>
                    ) : (
                        <Text style={styles.title}>Information not available.</Text>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
}
