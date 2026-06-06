import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  moodOptions,
  saunaTypeOptions,
  setCountOptions,
} from '../constants/saunaOptions';
import type {
  SaunaLogInput,
  SaunaMood,
  SaunaType,
  SetCount,
} from '../types/saunaLog';

type Props = {
  initialValues?: Partial<SaunaLogInput>;
  submitLabel: string;
  onSubmit: (input: SaunaLogInput) => Promise<void>;
};

const getToday = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SaunaLogForm = ({
  initialValues,
  submitLabel,
  onSubmit,
}: Props) => {
  const [date, setDate] = useState(initialValues?.date ?? getToday());
  const [facilityName, setFacilityName] = useState(
    initialValues?.facilityName ?? '',
  );
  const [mood, setMood] = useState<SaunaMood | undefined>(
    initialValues?.mood,
  );
  const [setCount, setSetCount] = useState<SetCount | undefined>(
    initialValues?.setCount,
  );
  const [saunaType, setSaunaType] = useState<SaunaType | undefined>(
    initialValues?.saunaType,
  );
  const [memo, setMemo] = useState(initialValues?.memo ?? '');
  const [dateError, setDateError] = useState<string>();
  const [facilityError, setFacilityError] = useState<string>();
  const [moodError, setMoodError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const normalizedDate = date.trim();
    const normalizedFacilityName = facilityName.trim();
    const nextDateError = normalizedDate ? undefined : '日付を入力してください';
    const nextFacilityError = normalizedFacilityName
      ? undefined
      : '施設名を入力してください';
    const nextMoodError = mood ? undefined : 'ととのい度を選んでください';

    setDateError(nextDateError);
    setFacilityError(nextFacilityError);
    setMoodError(nextMoodError);
    setSubmitError(undefined);

    if (nextDateError || nextFacilityError || nextMoodError || !mood) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        date: normalizedDate,
        facilityName: normalizedFacilityName,
        mood,
        setCount,
        saunaType,
        memo: memo.trim() || undefined,
      });
    } catch {
      setSubmitError('保存できませんでした。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={96}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>日付</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={(value) => {
              setDate(value);
              if (dateError) {
                setDateError(undefined);
              }
            }}
            placeholder="2026-06-06"
            style={[styles.textInput, dateError && styles.inputError]}
            value={date}
          />
          {dateError ? (
            <Text style={styles.errorText}>{dateError}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>施設名</Text>
          <TextInput
            autoCorrect={false}
            onChangeText={(value) => {
              setFacilityName(value);
              if (facilityError) {
                setFacilityError(undefined);
              }
            }}
            placeholder="〇〇温泉"
            style={[styles.textInput, facilityError && styles.inputError]}
            value={facilityName}
          />
          {facilityError ? (
            <Text style={styles.errorText}>{facilityError}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>ととのい度</Text>
          <View style={styles.moodOptions}>
            {moodOptions.map((option) => {
              const isSelected = mood === option.value;

              return (
                <Pressable
                  accessibilityLabel={`${option.icon} ${option.label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  key={option.value}
                  onPress={() => {
                    setMood(option.value);
                    setMoodError(undefined);
                  }}
                  style={[
                    styles.moodButton,
                    isSelected && styles.moodButtonSelected,
                  ]}
                >
                  <Text style={styles.moodIcon}>{option.icon}</Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.moodLabel,
                      isSelected && styles.moodLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {moodError ? (
            <Text style={styles.errorText}>{moodError}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>セット数</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) =>
                setSetCount(value ? (value as SetCount) : undefined)
              }
              selectedValue={setCount ?? ''}
            >
              <Picker.Item label="選択しない" value="" />
              {setCountOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>サウナの種類</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) =>
                setSaunaType(value ? (value as SaunaType) : undefined)
              }
              selectedValue={saunaType ?? ''}
            >
              <Picker.Item label="選択しない" value="" />
              {saunaTypeOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>ひとことメモ</Text>
          <TextInput
            multiline
            onChangeText={setMemo}
            placeholder="書かなくてもOK"
            style={[styles.textInput, styles.memoInput]}
            textAlignVertical="top"
            value={memo}
          />
        </View>

        {submitError ? (
          <Text style={styles.submitError}>{submitError}</Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={() => void handleSubmit()}
          style={({ pressed }) => [
            styles.submitButton,
            (pressed || isSubmitting) && styles.submitButtonPressed,
          ]}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? '保存中...' : submitLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    color: '#2f3a34',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#e4ded4',
    borderRadius: 12,
    borderWidth: 1,
    color: '#2f3a34',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: '#bd3d3d',
  },
  errorText: {
    color: '#bd3d3d',
    fontSize: 13,
    marginTop: 7,
  },
  moodOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  moodButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e4ded4',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  moodButtonSelected: {
    backgroundColor: '#fff0e8',
    borderColor: '#c96f45',
  },
  moodIcon: {
    fontSize: 24,
  },
  moodLabel: {
    color: '#667069',
    fontSize: 10,
    marginTop: 5,
  },
  moodLabelSelected: {
    color: '#a9502b',
    fontWeight: '700',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#e4ded4',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  memoInput: {
    minHeight: 112,
  },
  submitError: {
    color: '#bd3d3d',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#c96f45',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  submitButtonPressed: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
