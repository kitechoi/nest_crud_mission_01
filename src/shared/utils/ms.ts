import * as ms from 'ms';

export function parseDuration(str: string): number {
  if (typeof str !== 'string') {
    throw new Error(`Duration must be a string, but got ${typeof str}`);
  }

  const duration = ms(str as ms.StringValue);

  if (typeof duration !== 'number') {
    throw new Error(`Invalid duration format: ${str}`);
  }

  return duration;
}
