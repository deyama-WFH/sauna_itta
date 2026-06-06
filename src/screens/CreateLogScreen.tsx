import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SaunaLogForm } from '../components/SaunaLogForm';
import type { RootStackParamList } from '../navigation/types';
import { createSaunaLog } from '../storage/saunaLogStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateLog'>;

export const CreateLogScreen = ({ navigation }: Props) => (
  <SaunaLogForm
    onSubmit={async (input) => {
      const createdLog = await createSaunaLog(input);
      navigation.replace('LogDetail', { logId: createdLog.id });
    }}
    submitLabel="記録する"
  />
);
