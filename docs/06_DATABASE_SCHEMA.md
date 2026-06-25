# 06. 数据库设计

## users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  github_id TEXT UNIQUE,
  wallet_address TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## devices

```sql
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  device_hash TEXT NOT NULL,
  os TEXT,
  cli_version TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## campaigns

```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  sponsor_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  target_url TEXT NOT NULL,
  reward_points INTEGER NOT NULL DEFAULT 5,
  click_reward_points INTEGER NOT NULL DEFAULT 0,
  cpa_reward_points INTEGER NOT NULL DEFAULT 0,
  pricing_model TEXT NOT NULL DEFAULT 'manual',
  budget_cents INTEGER NOT NULL DEFAULT 0,
  spent_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  tags JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## ad_sessions

```sql
CREATE TABLE ad_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  device_id TEXT NOT NULL REFERENCES devices(id),
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  status TEXT NOT NULL DEFAULT 'created',
  reward_points INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  shown_at TIMESTAMP,
  viewed_at TIMESTAMP,
  clicked_at TIMESTAMP,
  completed_at TIMESTAMP,
  rewarded_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

## point_accounts

```sql
CREATE TABLE point_accounts (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  pending_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER NOT NULL DEFAULT 0,
  locked_points INTEGER NOT NULL DEFAULT 0,
  redeemed_points INTEGER NOT NULL DEFAULT 0,
  expired_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## point_ledger

```sql
CREATE TABLE point_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  source_type TEXT NOT NULL,
  source_id TEXT,
  event_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  available_at TIMESTAMP
);
```

## shop_items

```sql
CREATE TABLE shop_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  points_price INTEGER NOT NULL,
  reference_value_cents INTEGER,
  stock INTEGER,
  provider TEXT,
  delivery_type TEXT NOT NULL,
  requires_review BOOLEAN NOT NULL DEFAULT FALSE,
  requires_wallet BOOLEAN NOT NULL DEFAULT FALSE,
  requires_kyc BOOLEAN NOT NULL DEFAULT FALSE,
  supported_regions JSONB,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## redemption_orders

```sql
CREATE TABLE redemption_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  item_id TEXT NOT NULL REFERENCES shop_items(id),
  points_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_type TEXT NOT NULL,
  delivery_payload JSONB,
  risk_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

## crypto_payouts

```sql
CREATE TABLE crypto_payouts (
  id TEXT PRIMARY KEY,
  redemption_order_id TEXT NOT NULL REFERENCES redemption_orders(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  asset TEXT NOT NULL,
  chain TEXT NOT NULL,
  amount TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  tx_hash TEXT,
  risk_review_result TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMP
);
```

## 建议索引

```sql
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_ad_sessions_user_id ON ad_sessions(user_id);
CREATE INDEX idx_ad_sessions_device_id ON ad_sessions(device_id);
CREATE INDEX idx_ad_sessions_campaign_id ON ad_sessions(campaign_id);
CREATE INDEX idx_point_ledger_user_id ON point_ledger(user_id);
CREATE INDEX idx_point_ledger_status ON point_ledger(status);
CREATE INDEX idx_redemption_orders_user_id ON redemption_orders(user_id);
CREATE INDEX idx_redemption_orders_status ON redemption_orders(status);
```
