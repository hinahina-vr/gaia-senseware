PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO users (id, public_id, display_name, created_at, updated_at)
VALUES ('user_test_owner', 'usr_testowner', 'テスト参加者', '2026-08-12T00:00:00.000Z', '2026-08-12T00:00:00.000Z');

INSERT OR IGNORE INTO users (id, public_id, display_name, created_at, updated_at)
VALUES ('user_test_other', 'usr_testother', '別の参加者', '2026-08-12T00:00:00.000Z', '2026-08-12T00:00:00.000Z');
