import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const mock = new Mockgoose(mongoose);
mongoose.Promise = global.Promise;

export async function initDb() {
  const port = await mock.getOpenPort();
  await mock.prepareStorage();
  mongoose.connect(`mongodb://scaffold-test:${port}`);
}

export function initUserData(params = {}) {
  return Object.assign({
    provider: 'local',
    name: 'Test User',
    email: `${Math.random()}@test.com`,
    password: 'testtest',
  }, params);
}
