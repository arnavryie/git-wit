import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Sparkles, Search } from 'lucide-react-native';
import { DossierCard } from '../components/DossierCard';
import { DeveloperDossier } from '../types';
import { fetchDeveloperDossier } from '../services/api';
import { colors } from '../theme/colors';

interface DossierScreenProps {
  initialUsername?: string;
}

const PRESET_USERS = ['arnavryie', 'torvalds', 'shadcn', 'antfu', 'gaearon'];

export const DossierScreen: React.FC<DossierScreenProps> = ({ initialUsername = 'arnavryie' }) => {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [dossier, setDossier] = useState<DeveloperDossier | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (targetUser?: string) => {
    const userToFetch = (targetUser || usernameInput).trim().replace(/^@/, '');
    if (!userToFetch) return;
    setLoading(true);
    const result = await fetchDeveloperDossier(userToFetch);
    setDossier(result);
    setLoading(false);
  };

  React.useEffect(() => {
    if (initialUsername) {
      setUsernameInput(initialUsername);
      handleGenerate(initialUsername);
    }
  }, [initialUsername]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={13} color={colors.purpleBright} />
          <Text style={styles.badgeText}>GEMINI 1.5 INTELLIGENCE</Text>
        </View>
        <Text style={styles.title}>Developer Dossier</Text>
        <Text style={styles.subtitle}>
          Generate a shareable AI developer profile analyzing commit velocity, stack synthesis, and architectural superpowers.
        </Text>
      </View>

      {/* Preset Chips */}
      <View style={styles.presetsRow}>
        <Text style={styles.presetsLabel}>Try:</Text>
        {PRESET_USERS.map((user) => {
          const isSelected = usernameInput.toLowerCase().replace(/^@/, '') === user.toLowerCase();
          return (
            <TouchableOpacity
              key={user}
              style={[styles.presetChip, isSelected && styles.presetChipActive]}
              onPress={() => {
                setUsernameInput(user);
                handleGenerate(user);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                @{user}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Input Search Row */}
      <View style={styles.searchBox}>
        <Search size={15} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter GitHub username (e.g. arnavryie)"
          placeholderTextColor={colors.textMuted}
          value={usernameInput}
          onChangeText={setUsernameInput}
          onSubmitEditing={() => handleGenerate()}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => handleGenerate()}
          activeOpacity={0.8}
        >
          <Text style={styles.generateBtnText}>Analyze</Text>
        </TouchableOpacity>
      </View>

      {/* Loading or Dossier Result */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loaderText}>
            Synthesizing @{usernameInput}'s code fingerprints with Gemini...
          </Text>
        </View>
      ) : (
        dossier && <DossierCard dossier={dossier} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  badgeText: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  presetsLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  presetChip: {
    backgroundColor: '#1c1533',
    borderWidth: 1,
    borderColor: '#6366f130',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  presetChipActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purpleBright,
  },
  presetText: {
    color: '#c4b5fd',
    fontSize: 11,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    paddingVertical: 0,
  },
  generateBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  generateBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
