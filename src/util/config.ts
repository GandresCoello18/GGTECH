import * as envalid from 'envalid';
import path from 'path';

const { str, num } = envalid;

export const config = envalid.cleanEnv(
  process.env,
  {
    X_DEBBUGER_ENV: str(),
    X_MONGO_URL: str(),
    X_MONGO_DATABASE: str(),
    PORT: num(),
  },
  { strict: true, dotEnvPath: path.resolve(__dirname, '../../.env') },
);
