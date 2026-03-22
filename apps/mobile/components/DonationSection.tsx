import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  Animated, TextInput,
} from 'react-native';
import { useTheme, NeumorphicOutset, NeumorphicInset, Icon, ICON_SETS, getAlphaColor, Card, PillButton } from '@repo/ui';
import { useProfile } from '../contexts/ProfileContext';

interface DonationSectionProps {
  onDonationComplete?: () => void;
  onUpgradePress?: () => void;
}

interface TierPillProps {
  amount: number;
  icon: string;
  onPress: () => void;
}

const TierPill: React.FC<TierPillProps> = ({ amount, icon, onPress }) => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  const onOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start();

  const s = React.useMemo(() => StyleSheet.create({
    card: { borderRadius: 18, flex: 1, height: 72 },
    content: {
      flex: 1, borderRadius: 18,
      justifyContent: 'center', alignItems: 'center',
      gap: 4,
    },
    amount: { ...theme.typography.header, color: theme.colors.primary, fontSize: 20 },
  }), [theme]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={onIn} 
        onPressOut={onOut} 
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <NeumorphicOutset containerStyle={s.card} contentStyle={s.content} highlightColor={getAlphaColor(theme.colors.primary, 0.08)}>
          <Icon name={icon} size={18} color={getAlphaColor(theme.colors.primary, 0.6)} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
          <Text style={s.amount}>${amount}</Text>
        </NeumorphicOutset>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DonationSection: React.FC<DonationSectionProps> = ({ onDonationComplete, onUpgradePress }) => {
  const { theme } = useTheme();
  const { setProfileData, donationTotal, accountType } = useProfile();
  const [customAmount, setCustomAmount] = useState('');

  const isPremium = accountType === 'premium';

  const styles = React.useMemo(() => StyleSheet.create({
    section: { marginTop: 8, width: '100%', gap: 16 },
    premiumHeader: {
      alignItems: 'center',
      gap: 8,
      marginBottom: theme.spacing.s,
    },
    premiumTitle: {
      ...theme.typography.title, color: theme.colors.primary,
      textTransform: 'uppercase', letterSpacing: 2,
    },
    taglineRow: {
      alignItems: 'center',
      gap: 2,
    },
    taglineText: {
      ...theme.typography.label,
      color: theme.colors.text,
      opacity: 0.9,
    },
    benefitInset: {
      borderRadius: 16,
      width: '100%',
    },
    benefitInsetContent: {
      padding: theme.spacing.m,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
      gap: 12,
    },
    benefitText: {
      ...theme.typography.body,
      color: theme.colors.text,
      opacity: 0.9,
    },
    missionHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      marginBottom: theme.spacing.xs, gap: 8,
    },
    title: {
      ...theme.typography.title, color: theme.colors.primary,
      textTransform: 'uppercase', letterSpacing: 2,
    },
    subtitle: {
      ...theme.typography.caption, color: theme.colors.text, opacity: 0.65,
      textAlign: 'center', marginBottom: theme.spacing.m,
    },
    pillRow: { 
      flexDirection: 'row', 
      gap: theme.spacing.m, 
      marginBottom: theme.spacing.m,
      width: '100%',
    },
    customRow: { flexDirection: 'row', gap: theme.spacing.m, alignItems: 'center' },
    inputBox: { flex: 1, borderRadius: 16, height: 52 },
    inputContent: {
      flex: 1, borderRadius: 16,
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: theme.spacing.m, gap: 4,
    },
    dollarSign: { ...theme.typography.label, color: theme.colors.text, fontSize: 18, opacity: 0.5 },
    input: {
      flex: 1, ...theme.typography.label, fontSize: 18,
      color: theme.colors.text, padding: 0,
    },
    sendBtn: { borderRadius: 16, height: 52, width: 60 },
    sendContent: {
      borderRadius: 16, height: 52,
      justifyContent: 'center', alignItems: 'center',
    },
    maybeLater: {
      alignSelf: 'center',
      padding: theme.spacing.s,
      marginTop: 8,
    },
    maybeLaterText: {
      ...theme.typography.label,
      color: theme.colors.text,
      opacity: 0.6,
    },
  }), [theme]);

  const BenefitItem = ({ text }: { text: string }) => (
    <View style={styles.benefitItem}>
      <Icon name="check-circle" size={18} color={theme.colors.success} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );

  const confirm = (amount: number) => {
    if (!amount || amount <= 0) return;
    setProfileData({ donationTotal: (donationTotal || 0) + amount });
    setCustomAmount('');
    Alert.alert(
      '🫡  Thank You!',
      `$${amount} received. You're helping keep MilCalc free for every veteran.`,
      [{ text: 'Continue', onPress: onDonationComplete }]
    );
  };

  const defaultTiers = [
    { amount: 5, icon: 'coffee' },
    { amount: 10, icon: 'shield-star' },
    { amount: 20, icon: 'crown' },
  ];

  const parsedCustom = parseFloat(customAmount);

  return (
    <View style={styles.section}>
      {/* Premium Header Outset */}
      <Card>
        <View style={styles.premiumHeader}>
          <Icon name="crown" size={48} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.taglineText}>Pure Focus</Text>
            <Text style={styles.taglineText}>Priority Support</Text>
          </View>
        </View>
      </Card>

      {!isPremium && (
        <>
          <NeumorphicInset 
            containerStyle={styles.benefitInset} 
            contentStyle={styles.benefitInsetContent}
          >
            <BenefitItem text="Ad-free experience" />
            <BenefitItem text="Priority support on tickets" />
            <BenefitItem text="Support our veteran community" />
          </NeumorphicInset>

          <PillButton 
            title="Upgrade Now - $0.99/mo" 
            onPress={onUpgradePress || (() => {})}
          />
        </>
      )}

      {isPremium && (
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <Text style={[theme.typography.bodybold, { color: theme.colors.success }]}>
            Premium Active 🫡
          </Text>
        </View>
      )}

      {/* Support Mission Frame */}
      <Card>
        <View style={styles.missionHeader}>
          <Icon name="hand-heart" size={18} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
          <Text style={styles.title}>Support Our Mission</Text>
        </View>
        <Text style={styles.subtitle}>Help us stay free for every veteran.</Text>

        <View style={styles.pillRow}>
          {defaultTiers.map((t) => (
            <TierPill key={t.amount} amount={t.amount} icon={t.icon} onPress={() => confirm(t.amount)} />
          ))}
        </View>

        {/* Custom amount */}
        <View style={styles.customRow}>
          <NeumorphicInset containerStyle={styles.inputBox} contentStyle={styles.inputContent}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={getAlphaColor(theme.colors.text, 0.3)}
              keyboardType="decimal-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
            />
          </NeumorphicInset>

            <TouchableOpacity
              onPress={() => confirm(parsedCustom)}
              disabled={!parsedCustom || parsedCustom <= 0}
              activeOpacity={0.8}
            >
              <NeumorphicOutset
                containerStyle={[
                  styles.sendBtn,
                  { backgroundColor: parsedCustom > 0 ? theme.colors.primary : 'transparent' }
                ]}
                contentStyle={styles.sendContent}
                highlightColor={parsedCustom > 0 ? getAlphaColor(theme.colors.primary, 0.3) : undefined}
              >
                <Icon
                  name="send"
                  size={22}
                  color={parsedCustom > 0 ? '#FFFFFF' : getAlphaColor(theme.colors.text, 0.3)}
                  iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                />
              </NeumorphicOutset>
            </TouchableOpacity>
          </View>
      </Card>

      {!isPremium && (
        <TouchableOpacity onPress={onDonationComplete} style={styles.maybeLater}>
          <Text style={styles.maybeLaterText}>Not now, maybe later</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

