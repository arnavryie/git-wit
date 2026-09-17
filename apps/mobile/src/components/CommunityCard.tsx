import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Users, ChevronRight, ExternalLink } from 'lucide-react-native';
import { Community } from '../types';
import { colors } from '../theme/colors';

interface CommunityCardProps {
  community: Community;
  onPress?: () => void;
  onOpenWeb?: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onPress, onOpenWeb }) => {
  const handleWebPress = () => {
    if (onOpenWeb) {
      onOpenWeb();
    } else {
      Linking.openURL(`https://github.com/topics/${community.githubTopic}`).catch(() => {});
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { borderColor: community.color + '40' }]}>
        <Text style={styles.iconText}>{community.icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{community.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {community.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.members}>
            <Users size={12} color={colors.textMuted} />
            <Text style={styles.memberText}>{community.memberCount.toLocaleString()} devs</Text>
          </View>
          <View style={styles.topicBadge}>
            <Text style={styles.topicBadgeText}>#{community.githubTopic}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.webBtn}
          onPress={handleWebPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ExternalLink size={15} color={colors.blue} />
        </TouchableOpacity>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  topicBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  topicBadgeText: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webBtn: {
    padding: 6,
    backgroundColor: colors.surface2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
