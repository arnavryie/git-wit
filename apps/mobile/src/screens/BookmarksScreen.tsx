import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Bookmark, FolderHeart } from 'lucide-react-native';
import { RepoCard } from '../components/RepoCard';
import { AISummaryModal } from '../components/AISummaryModal';
import { Repo, AISummary } from '../types';
import { fetchGeminiSummary } from '../services/api';
import { colors } from '../theme/colors';

interface BookmarksScreenProps {
  bookmarks: Repo[];
  onToggleBookmark: (repo: Repo) => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ bookmarks, onToggleBookmark }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeRepo, setActiveRepo] = useState<Repo | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleOpenAISummary = async (repo: Repo) => {
    setActiveRepo(repo);
    setModalVisible(true);
    setAiLoading(true);
    const summary = await fetchGeminiSummary(repo.fullName, repo.description);
    setAiSummary(summary);
    setAiLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Bookmark size={13} color={colors.blue} />
          <Text style={styles.badgeText}>YOUR SAVED VAULT</Text>
        </View>
        <Text style={styles.title}>Saved Repositories</Text>
        <Text style={styles.subtitle}>
          {bookmarks.length} {bookmarks.length === 1 ? 'repo' : 'repos'} saved for quick reference.
        </Text>
      </View>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <FolderHeart size={30} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Repos</Text>
          <Text style={styles.emptySubtitle}>
            Tap the bookmark icon on any repository in the feed to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RepoCard
              repo={item}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onOpenAISummary={handleOpenAISummary}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {/* AI Intelligence Modal */}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  badgeText: {
    color: colors.blue,
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
  },
  list: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
