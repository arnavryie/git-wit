import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Sparkles, Share2, Award, Zap, Code2, Star, GitFork, Users } from 'lucide-react-native';
import { DeveloperDossier } from '../types';
import { colors } from '../theme/colors';

interface DossierCardProps {
  dossier: DeveloperDossier;
}

export const DossierCard: React.FC<DossierCardProps> = ({ dossier }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `⚔️ My Developer Dossier on git-wit:\n\n⚡ Archetype: ${dossier.archetype}\n✨ Superpower: ${dossier.superpower}\n\nGenerated with Gemini AI on git-wit!`,
      });
    } catch {}
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <View style={styles.verifiedRow}>
          <Sparkles size={13} color={colors.purpleBright} />
          <Text style={styles.bannerText}>GEMINI DEVELOPER DOSSIER</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
          <Share2 size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* User Header */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: `https://github.com/${dossier.username}.png` }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{dossier.username}</Text>
          <View style={styles.archetypeBadge}>
            <Award size={12} color={colors.gold} />
            <Text style={styles.archetypeText}>{dossier.archetype}</Text>
          </View>
        </View>
      </View>

      {/* Superpower Highlight */}
      <View style={styles.superpowerBox}>
        <View style={styles.powerHeader}>
          <Zap size={13} color={colors.blue} />
          <Text style={styles.powerTitle}>CORE SUPERPOWER</Text>
        </View>
        <Text style={styles.powerDesc}>{dossier.superpower}</Text>
      </View>

      {/* Language Breakdown */}
      <View style={styles.langSection}>
        <View style={styles.sectionHeader}>
          <Code2 size={13} color={colors.textMuted} />
          <Text style={styles.sectionTitle}>LANGUAGE STACK SYNTHESIS</Text>
        </View>
        <View style={styles.langBar}>
          {dossier.languages.map((lang, index) => (
            <View
              key={index}
              style={[
                styles.langSegment,
                { width: `${lang.percentage}%`, backgroundColor: lang.color },
              ]}
            />
          ))}
        </View>
        <View style={styles.langLegend}>
          {dossier.languages.map((lang, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: lang.color }]} />
              <Text style={styles.legendText}>
                {lang.name} ({lang.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Star size={14} color={colors.gold} />
          <Text style={styles.statNum}>{dossier.stats.totalStars}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>
        <View style={styles.statBox}>
          <GitFork size={14} color={colors.blue} />
          <Text style={styles.statNum}>{dossier.stats.repos}</Text>
          <Text style={styles.statLabel}>Repositories</Text>
        </View>
        <View style={styles.statBox}>
          <Users size={14} color={colors.purpleBright} />
          <Text style={styles.statNum}>{dossier.stats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* AI Analysis Narrative */}
      <View style={styles.analysisBox}>
        <Text style={styles.analysisText}>"{dossier.bioAnalysis}"</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerText: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shareBtn: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.surface2,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  archetypeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  superpowerBox: {
    backgroundColor: colors.bg,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  powerTitle: {
    color: colors.blue,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  powerDesc: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
  },
  langSection: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  langBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  langSegment: {
    height: '100%',
  },
  langLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  statNum: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
  },
  analysisBox: {
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    paddingTop: 10,
  },
  analysisText: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
    textAlign: 'center',
  },
});
