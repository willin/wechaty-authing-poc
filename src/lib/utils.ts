// eslint-disable-next-line import/no-extraneous-dependencies
import { ContactGender } from 'wechaty-puppet';

export const getGenderFromContact = (gender: ContactGender): string => {
  switch (gender) {
    case ContactGender.Female: {
      return 'F';
    }
    case ContactGender.Male: {
      return 'W';
    }
    default: {
      return 'U';
    }
  }
};

export const asyncFilter = async <T>(
  arr: T[],
  predicate: (value: T, index: number, array: T[]) => unknown
): Promise<T[]> => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};

export const sleep = (time: number): Promise<void> =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, time));
