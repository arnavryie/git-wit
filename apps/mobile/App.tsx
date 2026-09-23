import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LayoutGrid, Sparkles, Bookmark, Compass, User } from 'lucide-react-native';
import { Header } from './src/components/Header';
import { FeedScreen } from './src/screens/FeedScreen';
import { CommunitiesScreen } from './src/screens/CommunitiesScreen';
import { DossierScreen } from './src/screens/DossierScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { Repo } from './src/types';
import { FALLBACK_REPOS } from './src/services/api';
import { colors } from './src/theme/colors';

type Tab = 'feed' | 'dossier' | 'communities' | 'bookmarks';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('feed');
  const [bookmarks, setBookmarks] = useState<Repo[]>([FALLBACK_REPOS[0]]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dossierUsername, setDossierUsername] = useState('arnavryie');

  const handleToggleBookmark = (repo: Repo) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === repo.id);
      if (exists) {
        return prev.filter((b) => b.id !== repo.id);
      } else {
        return [...prev, repo];
      }
    });
  };

  const handleNavigateToDossier = (username: string) => {
    setDossierUsername(username);
    setCurrentTab('dossier');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Screen Content */}
      <View style={styles.screenContainer}>
        {currentTab === 'feed' && (
          <FeedScreen
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            searchQuery={searchQuery}
            onNavigateToDossier={handleNavigateToDossier}
          />
        )}
        {currentTab === 'dossier' && <DossierScreen initialUsername={dossierUsername} />}
        {currentTab === 'communities' && (
          <CommunitiesScreen
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        {currentTab === 'bookmarks' && (
          <BookmarksScreen
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </View>

      {/* GitHub-style Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        {/* Feed Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('feed')}
          activeOpacity={0.7}
        >
          <LayoutGrid
            size={18}
            color={currentTab === 'feed' ? colors.blue : colors.textMuted}
          />
          <Text style={[styles.tabLabel, currentTab === 'feed' && styles.tabLabelActive]}>
            Feed
          </Text>
        </TouchableOpacity>

        {/* AI Dossier Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('dossier')}
          activeOpacity={0.7}
        >
          <Sparkles
            size={18}
            color={currentTab === 'dossier' ? colors.purpleBright : colors.textMuted}
          />
          <Text style={[styles.tabLabel, currentTab === 'dossier' && styles.tabLabelActiveAI]}>
            AI Dossier
          </Text>
        </TouchableOpacity>

        {/* Communities Hubs Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('communities')}
          activeOpacity={0.7}
        >
          <Compass
            size={18}
            color={currentTab === 'communities' ? colors.blue : colors.textMuted}
          />
          <Text style={[styles.tabLabel, currentTab === 'communities' && styles.tabLabelActive]}>
            Hubs
          </Text>
        </TouchableOpacity>

        {/* Saved Bookmarks Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('bookmarks')}
          activeOpacity={0.7}
        >
          <Bookmark
            size={18}
            color={currentTab === 'bookmarks' ? colors.blue : colors.textMuted}
            fill={currentTab === 'bookmarks' ? colors.blue : 'none'}
          />
          <Text style={[styles.tabLabel, currentTab === 'bookmarks' && styles.tabLabelActive]}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.blue,
    fontWeight: '700',
  },
  tabLabelActiveAI: {
    color: colors.purpleBright,
    fontWeight: '700',
  },
});
