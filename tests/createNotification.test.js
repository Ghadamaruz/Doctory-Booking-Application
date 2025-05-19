import assert from 'assert';
import { createNotification } from '../src/lib/notifications.js';

const inserted = [];
const mockClient = {
  from() {
    return {
      insert(data) {
        inserted.push(data);
        return Promise.resolve({ data: null, error: null });
      },
    };
  },
};

async function run() {
  const sample = {
    user_id: '123',
    title: 'Test',
    message: 'Hello',
    related_id: 'abc',
    type: 'appointment',
  };

  await createNotification(sample, mockClient);

  assert.strictEqual(inserted.length, 1);
  const row = inserted[0];
  assert.strictEqual(row.user_id, sample.user_id);
  assert.strictEqual(row.title, sample.title);
  assert.strictEqual(row.message, sample.message);
  assert.strictEqual(row.related_id, sample.related_id);
  assert.strictEqual(row.type, sample.type);
  assert.strictEqual(row.read, false);
  assert.ok(row.created_at);
  console.log('createNotification test passed');
}

run();
