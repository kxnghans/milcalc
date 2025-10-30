import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, NeumorphicOutset, PillButton } from '@repo/ui';
import { BlurView } from 'expo-blur';
import { getHelpContentFromSource } from '@repo/utils';

interface DetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  contentKey: string | null;
  source: 'pt' | 'pay' | 'retirement';
  mascotAsset?: ImageSourcePropType;
}

export default function DetailModal({ isVisible, onClose, contentKey, source, mascotAsset }: DetailModalProps) {
    const { theme } = useTheme();
    const [content, setContent] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isVisible && contentKey && source) {
            const fetchContent = async () => {
                setIsLoading(true);
                const data = await getHelpContentFromSource(source, contentKey);
                setContent(data);
                setIsLoading(false);
            };
            fetchContent();
        } else {
            setContent(null);
        }
    }, [isVisible, contentKey, source]);

    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.l,
        },
        mascot: {
            width: theme.mascot.width,
            height: theme.mascot.height,
        },
        modalView: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: theme.spacing.l,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            maxHeight: '75%',
            flexShrink: 1,
            maxWidth: '90%',
            minWidth: '40%',
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
    });

    const parseMarkdown = (text) => {
        const paragraphs = text.split('\n\n');

        return paragraphs.map((paragraph, pIndex) => {
            const parts = paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

            const styledText = parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
                } else if (part.startsWith('*') && part.endsWith('*')) {
                    return <Text key={index} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
                }
                return <Text key={index}>{part}</Text>;
            });

            return <Text key={pIndex} style={[styles.sectionContent, { marginBottom: theme.spacing.s }]}>{styledText}</Text>;
        });
    };

    const renderSections = (item: any) => {
        const sections = [];

        const addSection = (headerField: string, contentField: string) => {
            if (item[contentField]) {
                let header = item[headerField];
                if (source !== 'pt') {
                    header = headerField.replace(/_/g, ' ').replace(/\b(\w)/g, s => s.toUpperCase());
                }
                sections.push(
                    <View key={headerField}>
                        <Text style={styles.sectionHeader}>{header}</Text>
                        {parseMarkdown(item[contentField])}
                    </View>
                );
            }
        };

        switch (source) {
            case 'pt':
                addSection('section_header', 'section_content');
                break;
            case 'pay':
                addSection('purpose_description', 'purpose_description');
                addSection('recipient_group', 'recipient_group');
                addSection('report_section', 'report_section');
                break;
            case 'retirement':
                addSection('purpose_description', 'purpose_description');
                addSection('calculation_details', 'calculation_details');
                addSection('example', 'example');
                break;
            case 'best_score':
                addSection('section_header', 'section_content');
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
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    ) : content && content.length > 0 ? (
                        <>
                            {mascotAsset && <Image source={mascotAsset} style={styles.mascot} resizeMode="contain" />}
                            <Text style={styles.title}>{content[0].title}</Text>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                                {content.map((item, index) => <View key={index}>{renderSections(item)}</View>)}
                            </ScrollView>
                            <PillButton title="Close" onPress={onClose} style={{ marginTop: theme.spacing.l }} />
                        </>
                    ) : (
                        <Text style={styles.title}>Information not available.</Text>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};