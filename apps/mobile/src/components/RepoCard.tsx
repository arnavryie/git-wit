import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Star, GitFork, Sparkles, Bookmark, Flame, ExternalLink } from 'lucide-react-native';
import { Repo } from '../types';
import { colors } from '../theme/colors';

interface RepoCardProps {
  repo: Repo;
  isBookmarked?: boolean;
  onToggleBookmark?: (repo: Repo) => void;
  onOpenAISummary?: (repo: Repo) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  isBookmarked = false,
  onToggleBookmark,
  onOpenAISummary,
}) => {
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(repo.stars);

  const handleStar = () => {
    const next = !starred;
    setStarred(next);
    setStarCount((prev) => (next ? prev + 1 : prev - 1));
  };

  const handleOpenGithub = () => {
    const url = repo.htmlUrl || `https://github.com/${repo.owner}/${repo.name}`;
    Linking.openURL(url).catch((err) => {
      console.warn('Could not open URL:', err);
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <View style={styles.card}>
      {/* Top Banner (Vector AI / Fork Spike) */}
      {repo.aiBadge && (
        <View style={styles.aiBadgeRow}>
          <Sparkles size={12} color={colors.purpleBright} />
          <Text style={styles.aiBadgeText}>{repo.aiBadge}</Text>
        </View>
      )}

      {/* Header: Avatar, Owner/Name, Star Button, Bookmark */}
      <View style={styles.header}>
        <Image
          source={{ uri: repo.avatarUrl || `https://github.com/${repo.owner}.png` }}
          style={styles.avatar}
        />
        <View style={styles.titleArea}>
          <TouchableOpacity onPress={handleOpenGithub} activeOpacity={0.7} style={styles.nameRow}>
            <Text style={styles.ownerText}>{repo.owner}</Text>
            <Text style={styles.slashText}>/</Text>
            <Text style={styles.repoNameText} numberOfLines={1}>
              {repo.name}
            </Text>
            <ExternalLink size={11} color={colors.blue} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.headerActions}>
          {/* Star Button */}
          <TouchableOpacity
            style={[styles.starBtn, starred && styles.starBtnActive]}
            onPress={handleStar}
            activeOpacity={0.7}
          >
            <Star
              size={13}
              color={starred ? colors.gold : colors.textMuted}
              fill={starred ? colors.gold : 'none'}
            />
            <Text style={[styles.starBtnText, starred && styles.starBtnTextActive]}>
              {formatNumber(starCount)}
            </Text>
          </TouchableOpacity>

          {/* Open Website Button */}
          <TouchableOpacity
            style={styles.webLinkBtn}
            onPress={handleOpenGithub}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ExternalLink size={13} color={colors.blue} />
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
            onPress={() => onToggleBookmark?.(repo)}
            activeOpacity={0.7}
          >
            <Bookmark
              size={14}
              color={isBookmarked ? colors.blue : colors.textMuted}
              fill={isBookmarked ? colors.blue : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {repo.description || 'No description provided.'}
      </Text>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <View style={styles.topicsRow}>
          {repo.topics.slice(0, 4).map((topic, index) => (
            <View key={index} style={styles.topicBadge}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
          {repo.topics.length > 4 && (
            <Text style={styles.moreTopics}>+{repo.topics.length - 4}</Text>
          )}
        </View>
      )}

      {/* Footer Info: Language, Forks, AI Summary button */}
      <View style={styles.footer}>
        <View style={styles.metaLeft}>
          {/* Language Dot */}
          <View style={styles.langItem}>
            <View
              style={[
                styles.langDot,
                { backgroundColor: repo.languageColor || colors.blue },
              ]}
            />
            <Text style={styles.langText}>{repo.language || 'Unknown'}</Text>
          </View>

          {/* Forks */}
          <View style={styles.forkItem}>
            <GitFork size={13} color={colors.textMuted} />
            <Text style={styles.forkText}>{formatNumber(repo.forks)}</Text>
          </View>

          {/* Velocity Badge if trending */}
          {repo.forkVelocity && repo.forkVelocity > 0 ? (
            <View style={styles.velocityBadge}>
              <Flame size={11} color={colors.orangeBright} />
              <Text style={styles.velocityText}>+{repo.forkVelocity}/d</Text>
            </View>
          ) : null}
        </View>

        {/* Gemini AI Insights Button */}
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => onOpenAISummary?.(repo)}
          activeOpacity={0.8}
        >
          <Sparkles size={12} color={colors.purpleBright} />
          <Text style={styles.aiButtonText}>AI Insights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1f1338',
    borderWidth: 1,
    borderColor: '#3d1d78',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },
  aiBadgeText: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  titleArea: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ownerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  slashText: {
    color: colors.textMuted,
    fontSize: 14,
    marginHorizontal: 3,
  },
  repoNameText: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  starBtnActive: {
    backgroundColor: '#272210',
    borderColor: '#6b5810',
  },
  starBtnText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  starBtnTextActive: {
    color: colors.gold,
  },
  bookmarkBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: '#0c2d48',
    borderColor: colors.blue,
  },
  webLinkBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  topicsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  topicBadge: {
    backgroundColor: '#121d2f',
    borderWidth: 1,
    borderColor: '#1d3b66',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  topicText: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '500',
  },
  moreTopics: {
    color: colors.textMuted,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  langText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  forkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  forkText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  velocityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  velocityText: {
    color: colors.orangeBright,
    fontSize: 11,
    fontWeight: '600',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#21183c',
    borderWidth: 1,
    borderColor: '#4c2889',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiButtonText: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '600',
  },
});
