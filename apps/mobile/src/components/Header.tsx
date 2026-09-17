import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Bell, Plus, Search } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onNotificationsPress?: () => void;
  onAddPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  onNotificationsPress,
  onAddPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar: Brand & Profile Actions */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <Text style={styles.brandIcon}>⚔️</Text>
          <Text style={styles.brandTitle}>Project Ronin</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onNotificationsPress} activeOpacity={0.7}>
            <Bell size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onAddPress} activeOpacity={0.7}>
            <Plus size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: 'https://github.com/arnavryie.png' }}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      {/* GitHub-style Search Bar */}
      <View style={styles.searchBar}>
        <Search size={14} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search or type / for repos..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.slashBadge}>
          <Text style={styles.slashText}>/</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 34,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    paddingVertical: 0,
  },
  slashBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  slashText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
