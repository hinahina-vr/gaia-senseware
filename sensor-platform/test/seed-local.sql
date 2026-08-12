PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO users (id, display_name, created_at, updated_at)
VALUES ('user_test_owner', 'テスト参加者', '2026-08-12T00:00:00.000Z', '2026-08-12T00:00:00.000Z');

INSERT OR IGNORE INTO users (id, display_name, created_at, updated_at)
VALUES ('user_test_other', '別の参加者', '2026-08-12T00:00:00.000Z', '2026-08-12T00:00:00.000Z');
