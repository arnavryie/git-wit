import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Sparkles, X, CheckCircle2, Target, Gauge } from 'lucide-react-native';
import { Repo, AISummary } from '../types';
import { colors } from '../theme/colors';

interface AISummaryModalProps {
  visible: boolean;
  repo: Repo | null;
  summary: AISummary | null;
  loading: boolean;
  onClose: () => void;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  visible,
  repo,
  summary,
  loading,
  onClose,
}) => {
  if (!repo) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.geminiIcon}>
                <Sparkles size={16} color={colors.purpleBright} />
              </View>
              <View>
                <Text style={styles.title}>Gemini AI Dossier</Text>
                <Text style={styles.subtitle}>{repo.fullName || `${repo.owner}/${repo.name}`}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.purple} />
              <Text style={styles.loadingText}>Synthesizing repository insights with Gemini 1.5 Flash...</Text>
            </View>
          ) : summary ? (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {/* Executive Overview */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Executive Overview</Text>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>{summary.summary}</Text>
                </View>
              </View>

              {/* Key Architectural Highlights */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Highlights</Text>
                {summary.keyPoints.map((point, index) => (
                  <View key={index} style={styles.pointRow}>
                    <CheckCircle2 size={15} color={colors.greenBright} style={{ marginTop: 2 }} />
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>

              {/* Metadata Badges */}
              <View style={styles.badgesRow}>
                <View style={styles.metaCard}>
                  <Target size={16} color={colors.blue} />
                  <Text style={styles.metaLabel}>Best Suited For</Text>
                  <Text style={styles.metaValue}>{summary.recommendedAudience}</Text>
                </View>

                <View style={styles.metaCard}>
                  <Gauge size={16} color={colors.gold} />
                  <Text style={styles.metaLabel}>Code Complexity</Text>
                  <Text style={[styles.metaValue, { color: colors.gold, fontWeight: '700' }]}>
                    {summary.complexity}
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.errorText}>Unable to load AI summary. Please try again.</Text>
          )}

          {/* Footer Close Button */}
          <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  geminiIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#21183c',
    borderWidth: 1,
    borderColor: '#4c2889',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  loadingContainer: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: colors.bg,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  pointText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  badgesRow: {
    gap: 10,
    marginBottom: 16,
  },
  metaCard: {
    backgroundColor: colors.bg,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.text,
    fontSize: 12,
  },
  errorText: {
    color: colors.red,
    padding: 20,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
