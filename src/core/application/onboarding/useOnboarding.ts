import { useCallback, useMemo, useState } from 'react';
import type { AvatarStyle, LearningMode, SrsPresetId } from '../../domain/index.ts';
import { generateRandomSeed } from '../../../shared/index.ts';
import { useSettings } from '../settings/index.ts';

// useOnboarding owns the transient state of the first-run overlay.
// It is a pure finite state machine: a step cursor plus draft choices.
// Only when the user taps the final "I'm ready" does the draft get
// committed to the real settings via the bootstrap settings context.

export type OnboardingStepId = 'welcome' | 'profile' | 'system' | 'goal' | 'mode';

export const ONBOARDING_STEPS: readonly OnboardingStepId[] = [
  'welcome',
  'profile',
  'system',
  'goal',
  'mode',
];

export interface OnboardingDraft {
  name: string;
  avatarSeed: string;
  avatarStyle: AvatarStyle;
  system: SrsPresetId;
  goal: number;
  mode: LearningMode;
}

const DEFAULT_DRAFT: OnboardingDraft = {
  name: '',
  avatarSeed: 'lexica',
  avatarStyle: 'adventurer',
  system: 'default',
  goal: 10,
  mode: 'en_to_tr',
};

export interface OnboardingApi {
  step: OnboardingStepId;
  stepIndex: number;
  totalSteps: number;
  draft: OnboardingDraft;
  isFirst: boolean;
  isLast: boolean;
  setName: (name: string) => void;
  setAvatarStyle: (style: AvatarStyle) => void;
  shuffleAvatar: () => void;
  setSystem: (system: SrsPresetId) => void;
  setGoal: (goal: number) => void;
  setMode: (mode: LearningMode) => void;
  next: () => void;
  back: () => void;
  finish: () => void;
}

export function useOnboarding(): OnboardingApi {
  const { update, updateProfile } = useSettings();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [draft, setDraft] = useState<OnboardingDraft>(() => ({
    ...DEFAULT_DRAFT,
    avatarSeed: generateRandomSeed(),
  }));

  const totalSteps = ONBOARDING_STEPS.length;
  const step = ONBOARDING_STEPS[stepIndex] ?? 'welcome';
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const setName = useCallback((name: string) => {
    setDraft((prev) => ({ ...prev, name }));
  }, []);
  const setAvatarStyle = useCallback((style: AvatarStyle) => {
    setDraft((prev) => ({ ...prev, avatarStyle: style }));
  }, []);
  const shuffleAvatar = useCallback(() => {
    setDraft((prev) => ({ ...prev, avatarSeed: generateRandomSeed() }));
  }, []);
  const setSystem = useCallback((system: SrsPresetId) => {
    setDraft((prev) => ({ ...prev, system }));
  }, []);
  const setGoal = useCallback((goal: number) => {
    setDraft((prev) => ({ ...prev, goal }));
  }, []);
  const setMode = useCallback((mode: LearningMode) => {
    setDraft((prev) => ({ ...prev, mode }));
  }, []);

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);
  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const finish = useCallback(() => {
    updateProfile({
      name: draft.name,
      avatarSeed: draft.avatarSeed || generateRandomSeed(),
      avatarStyle: draft.avatarStyle,
    });
    update({
      system: draft.system,
      goal: draft.goal,
      mode: draft.mode,
      onboarded: true,
    });
  }, [draft, update, updateProfile]);

  return useMemo<OnboardingApi>(
    () => ({
      step,
      stepIndex,
      totalSteps,
      draft,
      isFirst,
      isLast,
      setName,
      setAvatarStyle,
      shuffleAvatar,
      setSystem,
      setGoal,
      setMode,
      next,
      back,
      finish,
    }),
    [
      step,
      stepIndex,
      totalSteps,
      draft,
      isFirst,
      isLast,
      setName,
      setAvatarStyle,
      shuffleAvatar,
      setSystem,
      setGoal,
      setMode,
      next,
      back,
      finish,
    ],
  );
}
