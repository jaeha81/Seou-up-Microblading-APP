import React, { Component, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';

type Props = {
  children: ReactNode;
  pluginName?: string;
  onRetry?: () => void;
};

type State = {
  hasError: boolean;
  errorMessage: string | null;
};

export class PluginErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.title}>
            {this.props.pluginName
              ? `${this.props.pluginName} encountered an error`
              : 'Something went wrong'}
          </Text>
          <Text style={styles.message}>
            {this.state.errorMessage ?? 'An unexpected error occurred.'}
          </Text>
          <Pressable style={styles.retryBtn} onPress={this.handleRetry}>
            <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    marginTop: Spacing.sm,
  },
  retryText: {
    ...Typography.button,
    color: Colors.primary,
  },
});
