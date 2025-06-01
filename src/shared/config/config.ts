function getKey<T>(key: string, defaultValue?: string): T {
  if (
    (typeof process.env[key] === 'undefined' &&
      typeof defaultValue === 'undefined') ||
    process.env[key] === ''
  ) {
    throw new Error('Missing required environment variable: ' + key);
  }
  return (process.env[key] as T) || (defaultValue as T);
}

export interface AppConfig {
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
}

export const config: AppConfig = {
  JWT_ACCESS_SECRET: getKey<string>('JWT_ACCESS_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getKey<string>('JWT_ACCESS_EXPIRES_IN'),

  JWT_REFRESH_SECRET: getKey<string>('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getKey<string>('JWT_REFRESH_EXPIRES_IN'),
};
