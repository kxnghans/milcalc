import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset, NeumorphicInset, PillButton, getAlphaColor } from '@repo/ui';
import { BlurView } from 'expo-blur';
import { useProfile } from '../contexts/ProfileContext';

interface FullScreenPaywallProps {
  onComplete: () => void;
}

export const FullScreenPaywall: React.FC<FullScreenPaywallProps> = ({ onComplete }) => {
  const { theme, isDarkMode } = useTheme();
  const { setProfileData } = useProfile();

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const featureAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background,
      zIndex: 10000,
    },
    glowCircle: {
      position: 'absolute',
      width: 400,
      height: 400,
      borderRadius: 200,
      opacity: 0.6,
    },
    content: {
      flex: 1,
      padding: theme.spacing.l,
      paddingTop: 80,
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
    },
    heroIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    heroIconContent: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    brandText: {
      ...theme.typography.hero,
      fontSize: 42,
      color: theme.colors.text,
      marginTop: theme.spacing.l,
      textAlign: 'center',
    },
    proText: {
      color: theme.colors.primary,
      fontWeight: '900',
    },
    tagline: {
      ...theme.typography.title,
      color: theme.colors.text,
      opacity: 0.6,
      marginTop: 4,
      textAlign: 'center',
    },
    featuresContainer: {
      marginVertical: 40,
      gap: theme.spacing.m,
    },
    featureCard: {
      borderRadius: 20,
      padding: theme.spacing.m,
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureIconBox: {
      width: 54,
      height: 54,
    },
    featureIconInner: {
      width: 54,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      alignItems: 'center',
      paddingBottom: 30,
    },
    glassPriceCard: {
      width: '100%',
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: getAlphaColor('#FFFFFF', 0.1),
      alignItems: 'center',
    },
    priceText: {
      ...theme.typography.hero,
      fontSize: 48,
      color: theme.colors.text,
    },
    priceSub: {
      ...theme.typography.body,
      opacity: 0.5,
      fontSize: 18,
    },
    upgradeButton: {
      width: '100%',
      height: 64,
      borderRadius: 32,
    },
    skipText: {
      ...theme.typography.label,
      color: theme.colors.text,
      opacity: 0.5,
      marginTop: 20,
    }
  });

  useEffect(() => {
    // Entrance Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      )
    ]).start();

    // Staggered features
    Animated.stagger(150, featureAnims.map(anim => 
      Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true })
    )).start();
  }, [contentTranslateY, fadeAnim, featureAnims, glowAnim]);


  const handleUpgrade = () => {
    setProfileData({ accountType: 'premium' });
    onComplete();
  };

  const FeatureItem = ({ icon, title, description, index }: { icon: string; title: string; description: string, index: number }) => (
    <Animated.View style={{ 
      opacity: featureAnims[index], 
      transform: [{ translateX: featureAnims[index].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] 
    }}>
      <NeumorphicOutset containerStyle={{ borderRadius: 20 }} contentStyle={styles.featureCard}>
        <NeumorphicInset 
          containerStyle={[styles.featureIconBox, { borderRadius: 18, marginRight: theme.spacing.m }]} 
          contentStyle={styles.featureIconInner}
        >
          <Icon name={icon} size={24} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
        </NeumorphicInset>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodybold, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.text, opacity: 0.6, marginTop: 2 }]}>{description}</Text>
        </View>
      </NeumorphicOutset>
    </Animated.View>
  );

  const glowTranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] });
  const glowTranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Dynamic Background Glows */}
      <Animated.View style={[
        styles.glowCircle, 
        { 
          backgroundColor: getAlphaColor(theme.colors.primary, 0.12), 
          top: -100, 
          left: -100,
          transform: [{ translateX: glowTranslateX }, { translateY: glowTranslateY }]
        }
      ]} />
      <Animated.View style={[
        styles.glowCircle, 
        { 
          backgroundColor: getAlphaColor(theme.colors.secondary, 0.08), 
          bottom: -100, 
          right: -100,
          transform: [{ translateX: Animated.multiply(glowTranslateX, -1) }, { translateY: Animated.multiply(glowTranslateY, -1) }]
        }
      ]} />

      <Animated.View style={[styles.content, { transform: [{ translateY: contentTranslateY }] }]}>
        <View style={styles.header}>
          <NeumorphicOutset 
            containerStyle={styles.heroIconContainer} 
            contentStyle={styles.heroIconContent}
            highlightColor={getAlphaColor(theme.colors.primary, 0.4)}
          >
            <Icon name={ICONS.CROWN} size={54} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
          </NeumorphicOutset>
          
          <Text style={styles.brandText}>MilCalc <Text style={styles.proText}>PRO</Text></Text>
          <Text style={styles.tagline}>The standard for military excellence.</Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureItem 
            index={0}
            icon="shield-star" 
            title="Ad-Free Experience" 
            description="Pure focus, no distractions." 
          />
          <FeatureItem 
            index={1}
            icon="chart-areaspline" 
            title="Predictive Analytics" 
            description="Visualize your career trajectory." 
          />
          <FeatureItem 
            index={2}
            icon="vector-combine" 
            title="Unified Cloud Sync" 
            description="Data that moves at your speed." 
          />
        </View>

        <View style={styles.footer}>
          <BlurView intensity={isDarkMode ? 20 : 40} style={styles.glassPriceCard} tint={isDarkMode ? 'dark' : 'light'}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.priceText}>$4.99</Text>
              <Text style={styles.priceSub}> / month</Text>
            </View>
            <Text style={[theme.typography.caption, { color: theme.colors.text, opacity: 0.4, marginTop: 8 }]}>
              Secure billing via App Store • Cancel anytime
            </Text>
          </BlurView>

          <PillButton
            title="UPGRADE TO PRO"
            onPress={handleUpgrade}
            containerStyle={styles.upgradeButton}
            textStyle={[theme.typography.header, { fontSize: 18, letterSpacing: 1 }]}
            colorKey="primary"
          />
          
          <TouchableOpacity onPress={onComplete} activeOpacity={0.7}>
            <Text style={styles.skipText}>Not right now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};
