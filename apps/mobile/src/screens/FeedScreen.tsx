import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Sparkles, Flame, Users, TrendingUp, ChevronRight, Zap } from 'lucide-react-native';
import { UserLookupCard } from '../components/UserLookupCard';
import { RepoCard } from '../components/RepoCard';
import { AISummaryModal } from '../components/AISummaryModal';
import { Repo, AISummary } from '../types';
import { fetchTrendingRepos, fetchGeminiSummary, FALLBACK_REPOS } from '../services/api';
import { colors } from '../theme/colors';

const FILTER_PILLS = ['All', 'AI', 'TypeScript', 'Python', 'Rust', 'Go', 'Kotlin', 'C++'];

const SUGGESTED_DEVELOPERS = [
  { name: 'Guido van Rossum', username: 'gvanrossum', bio: "Python's creator. Currently at Microsoft.", avatar: 'https://github.com/gvanrossum.png' },
  { name: 'Sebastián Ramírez', username: 'tiangolo', bio: 'Creator of FastAPI, Typer, SQLModel.', avatar: 'https://github.com/tiangolo.png' },
  { name: 'Sindre Sorhus', username: 'sindresorhus', bio: 'Full-time open source. 1000+ npm packages.', avatar: 'https://github.com/sindresorhus.png' },
];

interface FeedScreenProps {
  bookmarks: Repo[];
  onToggleBookmark: (repo: Repo) => void;
  searchQuery?: string;
  onNavigateToDossier?: (username: string) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ bookmarks, onToggleBookmark, searchQuery = '', onNavigateToDossier }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [feedTab, setFeedTab] = useState<'trending' | 'vector_ai'>('trending');
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeRepo, setActiveRepo] = useState<Repo | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const loadRepos = async (filter: string, mode: string) => {
    setLoading(true);
    try {
      const lang = filter === 'All' || filter === 'AI' ? undefined : filter;
      const data = await fetchTrendingRepos(lang);
      if (mode === 'vector_ai') {
        const enhanced = data.map((r, i) => ({
          ...r,
          aiBadge: i < 3 ? '⚡ MongoDB Atlas Vector Search' : undefined,
        }));
        setRepos(enhanced);
      } else {
        setRepos(data);
      }
    } catch {
      setRepos(FALLBACK_REPOS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRepos(activeFilter, feedTab);
  }, [activeFilter, feedTab]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRepos(activeFilter, feedTab);
  };

  const handleOpenAISummary = async (repo: Repo) => {
    setActiveRepo(repo);
    setModalVisible(true);
    setAiLoading(true);
    const summary = await fetchGeminiSummary(repo.fullName, repo.description);
    setAiSummary(summary);
    setAiLoading(false);
  };

  const filteredRepos = searchQuery.trim()
    ? repos.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : repos;

  const renderHeader = () => (
    <View style={styles.headerArea}>
      {/* Live GitHub Profile & AI TL;DR Inspector (mirrors website) */}
      <UserLookupCard onNavigateToDossier={onNavigateToDossier} />

      {/* Sub Tab Switcher: Trending vs MongoDB Vector Search */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, feedTab === 'trending' && styles.tabButtonActive]}
          onPress={() => setFeedTab('trending')}
          activeOpacity={0.8}
        >
          <TrendingUp size={14} color={feedTab === 'trending' ? colors.text : colors.textMuted} />
          <Text style={[styles.tabButtonText, feedTab === 'trending' && styles.tabButtonTextActive]}>
            Trending Repos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, feedTab === 'vector_ai' && styles.tabButtonActiveAI]}
          onPress={() => setFeedTab('vector_ai')}
          activeOpacity={0.8}
        >
          <Sparkles size={14} color={feedTab === 'vector_ai' ? colors.purpleBright : colors.textMuted} />
          <Text style={[styles.tabButtonText, feedTab === 'vector_ai' && styles.tabButtonTextActiveAI]}>
            AI Vector Picks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_PILLS.map((pill) => {
          const isSelected = activeFilter === pill;
          return (
            <TouchableOpacity
              key={pill}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => setActiveFilter(pill)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {pill}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerArea}>
      {/* Suggested Builders section like website */}
      <View style={styles.buildersCard}>
        <View style={styles.buildersHeader}>
          <Users size={14} color={colors.textMuted} />
          <Text style={styles.buildersTitle}>SUGGESTED BUILDERS</Text>
        </View>

        {SUGGESTED_DEVELOPERS.map((dev, idx) => (
          <View key={idx} style={styles.builderRow}>
            <Image source={{ uri: dev.avatar }} style={styles.builderAvatar} />
            <View style={styles.builderInfo}>
              <Text style={styles.builderName}>{dev.name}</Text>
              <Text style={styles.builderHandle}>@{dev.username}</Text>
              <Text style={styles.builderBio} numberOfLines={1}>
                {dev.bio}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.7}
              onPress={() => onNavigateToDossier?.(dev.username)}
            >
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loaderText}>Scanning GitHub ecosystem...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRepos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => {
            const isBookmarked = bookmarks.some((b) => b.id === item.id);
            return (
              <RepoCard
                repo={item}
                isBookmarked={isBookmarked}
                onToggleBookmark={onToggleBookmark}
                onOpenAISummary={handleOpenAISummary}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.blue}
              colors={[colors.blue, colors.purple]}
            />
          }
        />
      )}

      {/* Gemini AI Intelligence Modal */}
      <AISummaryModal
        visible={modalVisible}
        repo={activeRepo}
        summary={aiSummary}
        loading={aiLoading}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerArea: {
    paddingBottom: 10,
  },
  tabSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.surface2,
    borderColor: colors.textMuted,
  },
  tabButtonActiveAI: {
    backgroundColor: '#1f1338',
    borderColor: colors.purple,
  },
  tabButtonText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  tabButtonTextActiveAI: {
    color: colors.purpleBright,
    fontWeight: '700',
  },
  filterScroll: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 6,
  },
  pill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pillActive: {
    backgroundColor: colors.surface2,
    borderColor: colors.blue,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  pillTextActive: {
    color: colors.blue,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
  footerArea: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  buildersCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  buildersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  buildersTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  builderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  builderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  builderInfo: {
    flex: 1,
  },
  builderName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  builderHandle: {
    color: colors.textMuted,
    fontSize: 10,
  },
  builderBio: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  viewBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewBtnText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
