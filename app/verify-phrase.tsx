import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import AuraLogo from '@/components/AuraLogo';

export default function VerifyPhraseScreen() {
  const { phrase } = useLocalSearchParams<{ phrase: string }>();
  const words = (phrase || '').split(' ');

  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const [currentStep, setCurrentStep] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Pick 3 random indices to verify (guards against short phrases)
  const challenges = useMemo(() => {
    if (words.length < 3) return [0, 1, 2].slice(0, words.length);
    const indices: number[] = [];
    while (indices.length < 3) {
      const r = Math.floor(Math.random() * words.length);
      if (!indices.includes(r)) indices.push(r);
    }
    return indices.sort((a, b) => a - b);
  }, [phrase, retryCount]);

  // For each challenge, generate 4 shuffled options (deterministic sampling)
  const options = useMemo(() => {
    return challenges.map((correctIdx) => {
      const correct = words[correctIdx];
      const uniqueOthers = [...new Set(words.filter((_, i) => i !== correctIdx))];
      // Shuffle and take up to 3 decoys
      const shuffled = uniqueOthers.sort(() => Math.random() - 0.5);
      const decoys = shuffled.slice(0, 3);
      const all = [correct, ...decoys].sort(() => Math.random() - 0.5);
      return { index: correctIdx, correct, choices: all };
    });
  }, [challenges, phrase, retryCount]);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(24);

  useEffect(() => {
    contentOpacity.value = withDelay(
      100,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    contentTranslateY.value = withDelay(
      100,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleSelect = (word: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = word;
    setAnswers(newAnswers);

    if (word === options[currentStep].correct) {
      // Correct — advance to next
      if (currentStep < 2) {
        setTimeout(() => setCurrentStep(currentStep + 1), 400);
      }
    } else {
      // Wrong — briefly show error, then reset with new challenges
      setTimeout(() => {
        setAnswers([null, null, null]);
        setCurrentStep(0);
        setRetryCount(c => c + 1);
      }, 800);
    }
  };

  const allCorrect = answers.every((a, i) => a === options[i].correct);

  const handleContinue = () => {
    if (allCorrect) {
      router.replace({ pathname: '/wallet-ready', params: { from: 'create' } });
    }
  };

  const current = options[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <Animated.View style={[styles.content, animStyle]}>
        <View style={styles.heroSection}>
          <AuraLogo size={48} isDark />
          <Text style={styles.title}>VERIFY PHRASE</Text>
          <Text style={styles.subtitle}>
            Confirm you've saved your phrase.{'\n'}Select the correct word for each position.
          </Text>
        </View>

        {/* Progress dots */}
        <View style={styles.progressRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.progressItem}>
              <View style={[
                styles.progressDot,
                i === currentStep && styles.progressDotActive,
                answers[i] !== null && answers[i] === options[i].correct && styles.progressDotCorrect,
                answers[i] !== null && answers[i] !== options[i].correct && styles.progressDotWrong,
              ]} />
              <Text style={styles.progressLabel}>Word #{options[i].index + 1}</Text>
            </View>
          ))}
        </View>

        {/* Question card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>What is word #{current.index + 1}?</Text>

          <View style={styles.choicesGrid}>
            {current.choices.map((word, i) => {
              const isSelected = answers[currentStep] === word;
              const isCorrect = word === current.correct;
              const showResult = answers[currentStep] !== null;
              return (
                <Pressable
                  key={i}
                  onPress={() => !showResult && handleSelect(word)}
                  disabled={answers[currentStep] !== null}
                  style={[
                    styles.choiceButton,
                    isSelected && isCorrect && styles.choiceCorrect,
                    isSelected && !isCorrect && styles.choiceWrong,
                    showResult && !isSelected && isCorrect && styles.choiceCorrectHint,
                  ]}
                >
                  <Text style={[
                    styles.choiceText,
                    isSelected && isCorrect && { color: '#fff' },
                    isSelected && !isCorrect && { color: '#fff' },
                  ]}>{word}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <Animated.View style={[styles.bottomSection, animStyle]}>
        <Pressable
          onPress={handleContinue}
          disabled={!allCorrect}
          style={({ pressed }) => [
            styles.ctaButton,
            !allCorrect && styles.ctaButtonDisabled,
            pressed && allCorrect && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[styles.ctaText, !allCorrect && styles.ctaTextDisabled]}>
            {allCorrect ? 'Continue' : 'Select all 3 words'}
          </Text>
          {allCorrect && (
            <Ionicons name="arrow-forward" size={17} color="#000" style={{ marginLeft: 8 }} />
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 21,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 36,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  progressDotCorrect: {
    backgroundColor: '#4ade80',
  },
  progressDotWrong: {
    backgroundColor: '#f87171',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.3,
  },
  questionCard: {
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 28,
    letterSpacing: 0.3,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  choiceButton: {
    width: '46%' as any,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCorrect: {
    borderColor: '#4ade80',
    backgroundColor: 'rgba(74,222,128,0.15)',
  },
  choiceWrong: {
    borderColor: '#f87171',
    backgroundColor: 'rgba(248,113,113,0.15)',
  },
  choiceCorrectHint: {
    borderColor: 'rgba(74,222,128,0.3)',
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 12,
  },
  ctaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.2,
  },
  ctaTextDisabled: {
    color: 'rgba(255,255,255,0.25)',
  },
});
