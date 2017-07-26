import test from 'ava';
import User from '../../src/models/User';
import { initDb, initUserData } from '../_test-helper';

test.before(async () => {
  await initDb();
});

test('create - 正しいユーザー情報を登録', async t => {
  const user = await User.create(initUserData());
  t.is(user.name, 'Test User');
  t.is(user.role, 'user');
  t.false(user.emailActivate);

  const findUser = await User.findOne({ email: user.email });
  t.is(findUser.password, undefined);
  t.true(findUser.authenticate('testtest'));
});

test('create - nameが20文字以上', async t => {
  await t.throws(User.create(initUserData({ name: '123456789012345678901' })));
  await t.notThrows(User.create(initUserData({ name: '12345678901234567890' })));
  await t.notThrows(User.create(initUserData({ name: '1234567890123456789' })));
});

test('create - passwordが8文字未満', async t => {
  await t.throws(User.create(initUserData({ password: '1234567' })));
  await t.notThrows(User.create(initUserData({ password: '12345678' })));
  await t.notThrows(User.create(initUserData({ password: '123456789' })));
});

test('create - 不正なemail', async t => {
  await User.create(initUserData({ email: 'test@test.com' }));
  await t.throws(User.create(initUserData({ email: '' })));
  await t.throws(User.create(initUserData({ email: 'test.com' })));
  await t.throws(User.create(initUserData({ email: 'test@test.com' })));
});
