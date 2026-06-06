export type SaunaMood = 'bad' | 'normal' | 'good' | 'totonotta' | 'space';

export type SetCount = '1' | '2' | '3' | '4' | '5_or_more' | 'unknown';

export type SaunaType =
  | 'dry'
  | 'steam'
  | 'mist'
  | 'self_loyly'
  | 'auto_loyly'
  | 'salt'
  | 'ganbanyoku'
  | 'unknown';

export type SaunaLog = {
  id: string;
  date: string;
  facilityName: string;
  mood: SaunaMood;
  setCount?: SetCount;
  saunaType?: SaunaType;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SaunaLogInput = Pick<
  SaunaLog,
  'date' | 'facilityName' | 'mood' | 'setCount' | 'saunaType' | 'memo'
>;
