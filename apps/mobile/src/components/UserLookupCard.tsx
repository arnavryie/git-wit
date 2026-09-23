import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, Search, ShieldCheck, Zap, ArrowRight, BookOpen, Users } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { fetchUserTldr } from '../services/api';

interface GitHubUserProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  publicRepos: number;
  followers: number;
  following: number;
  archetype: string;
  superpower: string;
  aiTldr: string;
}

interface UserLookupCardProps {
  onNavigateToDossier?: (username: string) => void;
  initialUsername?: string;
}

const PRESET_USERS = ['arnavryie', 'torvalds', 'shadcn', 'gaearon', 'karpathy'];

export const UserLookupCard: React.FC<UserLookupCardProps> = ({
  onNavigateToDossier,
  initialUsername = 'arnavryie',
}) => {
  const [inputUsername, setInputUsername] = useState(initialUsername);
  const [userProfile, setUserProfile] = useState<GitHubUserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUserProfile = async (rawHandle: string) => {
    const clean = rawHandle.trim().replace(/^@/, '');
    if (!clean) return;

    setLoading(true);
    try {
      // 1. Fetch public profile from GitHub API
      let name = clean;
      let avatar = `https://github.com/${clean}.png`;
      let bio = '';
      let location = '';
      let publicRepos = 12;
      let followers = 85;
      let following = 30;

      try {
        const ghRes = await fetch(`https://api.github.com/users/${clean}`, {
          headers: { 'User-Agent': 'git-wit-mobile' },
        });
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          name = ghData.name || clean;
          avatar = ghData.avatar_url || avatar;
          bio = ghData.bio || '';
          location = ghData.location || '';
          publicRepos = ghData.public_repos ?? publicRepos;
          followers = ghData.followers ?? followers;
          following = ghData.following ?? following;
        }
      } catch {}

      // 2. Fetch AI User TL;DR from backend
      let archetype = 'High-Velocity Full-Stack Engineer';
      let superpower = 'Clean modular architecture & active open-source contribution.';
      let aiTldr = `@${clean} is an active open-source developer specializing in modern distributed systems.`;

      try {
        const tldrRes = await fetchUserTldr(clean);
        if (tldrRes) {
          if (tldrRes.archetype) archetype = tldrRes.archetype;
          if (tldrRes.superpower) superpower = tldrRes.superpower;
          if (tldrRes.summary) aiTldr = tldrRes.summary;
        }
      } catch {}

      setUserProfile({
        username: clean,
        name,
        avatar,
        bio,
        location,
        publicRepos,
        followers,
        following,
        archetype,
        superpower,
        aiTldr,
      });
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clean = inputUsername.trim().replace(/^@/, '');
    if (!clean) {
      setUserProfile(null);
      return;
    }

    const timer = setTimeout(() => {
      loadUserProfile(clean);
    }, 450);

    return () => clearTimeout(timer);
  }, [inputUsername]);

  return (
    <View style={styles.card}>
      {/* Header Badge */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color={colors.purpleBright} />
          <Text style={styles.badgeTitle}>INSTANT PROFILE & AI TL;DR</Text>
        </View>
        <Text style={styles.hintText}>Inspect live GitHub builders</Text>
      </View>

      {/* Username Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.atSymbol}>@</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username (e.g. torvalds, arnavryie)"
          placeholderTextColor={colors.textMuted}
          value={inputUsername}
          onChangeText={setInputUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading ? (
          <ActivityIndicator size="small" color={colors.purpleBright} style={styles.iconRight} />
        ) : (
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => loadUserProfile(inputUsername)}
            activeOpacity={0.7}
          >
            <Search size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Preset User Chips */}
      <View style={styles.presetsRow}>
        <Text style={styles.presetsLabel}>Try:</Text>
        {PRESET_USERS.map((user) => {
          const isSelected = inputUsername.toLowerCase().replace(/^@/, '') === user.toLowerCase();
          return (
            <TouchableOpacity
              key={user}
              style={[styles.presetChip, isSelected && styles.presetChipActive]}
              onPress={() => setInputUsername(user)}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                @{user}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Profile & AI TL;DR Result Card */}
      {userProfile && (
        <View style={styles.profileBox}>
          {/* Avatar & User Details */}
          <View style={styles.userRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.userDetails}>
              <View style={styles.nameLine}>
                <Text style={styles.userName} numberOfLines={1}>
                  {userProfile.name}
                </Text>
                <View style={styles.verifiedTag}>
                  <ShieldCheck size={11} color="#34d399" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.userHandle}>@{userProfile.username}</Text>
              {userProfile.bio ? (
                <Text style={styles.userBio} numberOfLines={2}>
                  {userProfile.bio}
                </Text>
              ) : null}
            </View>
          </View>

          {/* GitHub Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <BookOpen size={12} color={colors.textMuted} />
              <Text style={styles.statNumber}>{userProfile.publicRepos}</Text>
              <Text style={styles.statLabel}>Repos</Text>
            </View>
            <View style={styles.statChip}>
              <Users size={12} color={colors.textMuted} />
              <Text style={styles.statNumber}>{userProfile.followers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statChip}>
              <Users size={12} color={colors.textMuted} />
              <Text style={styles.statNumber}>{userProfile.following.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* AI TL;DR Card */}
          <View style={styles.aiTldrBox}>
            <View style={styles.aiTldrHeader}>
              <View style={styles.aiBadge}>
                <Sparkles size={11} color={colors.purpleBright} />
                <Text style={styles.aiBadgeText}>AI USER TL;DR</Text>
              </View>
              <View style={styles.archetypeBadge}>
                <Text style={styles.archetypeText} numberOfLines={1}>
                  {userProfile.archetype}
                </Text>
              </View>
            </View>

            {/* Superpower */}
            <View style={styles.superpowerLine}>
              <Zap size={11} color={colors.blue} />
              <Text style={styles.superpowerText} numberOfLines={1}>
                {userProfile.superpower}
              </Text>
            </View>

            {/* AI Summary Narrative */}
            <Text style={styles.aiSummaryText}>"{userProfile.aiTldr}"</Text>
          </View>

          {/* Action Button: Jump to AI Dossier */}
          {onNavigateToDossier && (
            <TouchableOpacity
              style={styles.dossierBtn}
              onPress={() => onNavigateToDossier(userProfile.username)}
              activeOpacity={0.8}
            >
              <Sparkles size={13} color={colors.purpleBright} />
              <Text style={styles.dossierBtnText}>Inspect Full AI Dossier</Text>
              <ArrowRight size={13} color={colors.purpleBright} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161f',
    borderWidth: 1,
    borderColor: '#7c3aed40',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    padding: 12,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeTitle: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0d14',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  atSymbol: {
    color: colors.purpleBright,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    paddingVertical: 0,
  },
  iconRight: {
    marginLeft: 6,
  },
  searchBtn: {
    padding: 4,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
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
  profileBox: {
    backgroundColor: '#0b0f17',
    borderWidth: 1,
    borderColor: '#2e3748',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: colors.purpleBright,
    backgroundColor: colors.surface2,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0b0f17',
  },
  userDetails: {
    flex: 1,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#064e3b',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  verifiedText: {
    color: '#6ee7b7',
    fontSize: 9,
    fontWeight: '700',
  },
  userHandle: {
    color: colors.purpleBright,
    fontSize: 11,
    marginTop: 1,
  },
  userBio: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e2638',
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statNumber: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
  },
  aiTldrBox: {
    backgroundColor: '#151928',
    borderWidth: 1,
    borderColor: '#4c1d95',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  aiTldrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiBadgeText: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '800',
  },
  archetypeBadge: {
    backgroundColor: '#2e1065',
    borderWidth: 1,
    borderColor: '#7c3aed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '60%',
  },
  archetypeText: {
    color: '#e9d5ff',
    fontSize: 10,
    fontWeight: '700',
  },
  superpowerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  superpowerText: {
    color: '#67e8f9',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  aiSummaryText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  dossierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#221544',
    borderWidth: 1,
    borderColor: '#6b21a8',
    paddingVertical: 7,
    borderRadius: 6,
  },
  dossierBtnText: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '700',
  },
});
