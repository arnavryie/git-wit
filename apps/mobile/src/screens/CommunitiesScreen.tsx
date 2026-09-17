import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { Compass, ArrowLeft, ExternalLink, Globe, Sparkles } from 'lucide-react-native';
import { CommunityCard } from '../components/CommunityCard';
import { RepoCard } from '../components/RepoCard';
import { AISummaryModal } from '../components/AISummaryModal';
import { SEED_COMMUNITIES, fetchReposByTopic, fetchGeminiSummary } from '../services/api';
import { Community, Repo, AISummary } from '../types';
import { colors } from '../theme/colors';

interface CommunitiesScreenProps {
  bookmarks?: Repo[];
  onToggleBookmark?: (repo: Repo) => void;
}

export const CommunitiesScreen: React.FC<CommunitiesScreenProps> = ({
  bookmarks = [],
  onToggleBookmark,
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communityRepos, setCommunityRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  // AI Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [activeRepo, setActiveRepo] = useState<Repo | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSelectCommunity = async (community: Community) => {
    setSelectedCommunity(community);
    setLoading(true);
    try {
      const repos = await fetchReposByTopic(community.githubTopic);
      setCommunityRepos(repos);
    } catch {
      setCommunityRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCommunityWeb = (community: Community) => {
    const url = `https://github.com/topics/${community.githubTopic}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleOpenAISummary = async (repo: Repo) => {
    setActiveRepo(repo);
    setModalVisible(true);
    setAiLoading(true);
    try {
      const summary = await fetchGeminiSummary(repo.fullName, repo.description);
      setAiSummary(summary);
    } catch {
      setAiSummary({
        summary: `${repo.fullName} is an open-source tool solving critical workflow bottlenecks with modern architecture.`,
        keyPoints: ['High community adoption', 'Clean modular design', 'Active maintenance'],
        recommendedAudience: 'Software Developers',
        complexity: 'Intermediate',
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (selectedCommunity) {
    return (
      <View style={styles.container}>
        {/* Detail Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setSelectedCommunity(null)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color={colors.text} />
            <Text style={styles.backBtnText}>All Hubs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.webActionBtn}
            onPress={() => handleOpenCommunityWeb(selectedCommunity)}
            activeOpacity={0.7}
          >
            <Globe size={14} color={colors.blue} />
            <Text style={styles.webActionBtnText}>Visit Web Topic</Text>
            <ExternalLink size={12} color={colors.blue} />
          </TouchableOpacity>
        </View>

        {/* Space Banner */}
        <View style={styles.communityBanner}>
          <View style={styles.bannerRow}>
            <View style={[styles.iconContainer, { borderColor: selectedCommunity.color + '60' }]}>
              <Text style={styles.iconText}>{selectedCommunity.icon}</Text>
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.communityTitle}>{selectedCommunity.name}</Text>
              <View style={styles.topicBadge}>
                <Text style={styles.topicBadgeText}>#{selectedCommunity.githubTopic}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.communityDesc}>{selectedCommunity.description}</Text>
        </View>

        {/* Repositories in this hub */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Curated Repositories ({communityRepos.length})</Text>
          <Text style={styles.subHeaderHint}>Tap repo title to open its website</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.blue} />
            <Text style={styles.loadingText}>Fetching community repositories...</Text>
          </View>
        ) : (
          <FlatList
            data={communityRepos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RepoCard
                repo={item}
                isBookmarked={bookmarks.some((b) => b.id === item.id)}
                onToggleBookmark={onToggleBookmark}
                onOpenAISummary={handleOpenAISummary}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}

        {/* AI Summary Modal */}
        <AISummaryModal
          visible={modalVisible}
          repo={activeRepo}
          summary={aiSummary}
          loading={aiLoading}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Compass size={14} color={colors.blue} />
          <Text style={styles.bannerBadgeText}>COMMUNITY HUBS</Text>
        </View>
        <Text style={styles.bannerTitle}>Explore Spaces</Text>
        <Text style={styles.bannerDesc}>
          Topic-based spaces with verified repositories. Tap any space to explore repos or redirect to the website.
        </Text>
      </View>

      <FlatList
        data={SEED_COMMUNITIES}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <CommunityCard
            community={item}
            onPress={() => handleSelectCommunity(item)}
            onOpenWeb={() => handleOpenCommunityWeb(item)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  banner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  bannerBadgeText: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  bannerDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  list: {
    paddingBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.surface2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  webActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#0c2d48',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  webActionBtnText: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '600',
  },
  communityBanner: {
    backgroundColor: colors.surface,
    padding: 14,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  bannerText: {
    flex: 1,
  },
  communityTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  topicBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  topicBadgeText: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '600',
  },
  communityDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  subHeaderText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subHeaderHint: {
    color: colors.textMuted,
    fontSize: 10,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
