-- =====================================================================
-- SiMPLE TECHNOLOGIES — Supabase schema + seed data
-- Run this ONCE in your Supabase project: Dashboard → SQL Editor → New
-- query → paste this whole file → Run.
-- =====================================================================

-- ---------- extensions ----------
create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists categories (
  slug text primary key,
  label text not null,
  icon text not null,
  sort_order int not null default 0
);

-- ---------- products ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sku text unique not null,
  title text not null,
  description text,
  category_slug text references categories(slug),
  image text,
  gallery jsonb not null default '[]',
  price numeric not null,
  original_price numeric,
  rating numeric not null default 0,
  reviews int not null default 0,
  in_stock boolean not null default true,
  badge_label text,
  badge_tone text check (badge_tone in ('emerald','violet')),
  specs jsonb not null default '[]',          -- ["16MHz","5V Logic"]
  spec_table jsonb not null default '[]',     -- [{"label":"প্রসেসর কোর","value":"..."}]
  pinout jsonb not null default '[]',         -- [{"pin":"VCC","voltage":"5V"}]
  bundle_items jsonb not null default '[]',   -- [{"title":"...","subtitle":"...","price":460}]
  youtube_url text,
  is_flash_deal boolean not null default false,
  is_kit boolean not null default false,
  kit_level text,
  kit_tag text,
  voltage text,       -- '3.3V' | '5V' | '12V'
  bus text,           -- 'I2C' | 'SPI' | 'GPIO' | 'Analog'
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_slug);
create index if not exists products_flash_idx on products(is_flash_deal);
create index if not exists products_kit_idx on products(is_kit);

-- ---------- site_content (banners, marquee, editable homepage bits) ----------
create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- customers (mirrors auth.users 1:1) ----------
create table if not exists customers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create index if not exists customers_phone_idx on customers(phone);

-- Auto-create a customers row whenever someone signs up via Supabase Auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.customers (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------- orders ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id),
  guest_name text not null,
  guest_phone text not null,
  delivery_address text not null,
  delivery_zone text not null check (delivery_zone in ('inside_dhaka','outside_dhaka')),
  delivery_fee numeric not null,
  items jsonb not null,             -- [{"slug","title","price","qty"}]
  subtotal numeric not null,
  discount numeric not null default 0,
  total numeric not null,
  payment_method text not null check (payment_method in ('bkash','nagad','rocket','cod')),
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  admin_note text,
  created_at timestamptz not null default now()
);

create index if not exists orders_phone_idx on orders(guest_phone);
create index if not exists orders_customer_idx on orders(customer_id);

-- ---------- warranty_documents ----------
create table if not exists warranty_documents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  order_id uuid references orders(id),
  product_name text not null,
  file_url text not null,
  warranty_expiry date,
  uploaded_at timestamptz not null default now()
);

create index if not exists warranty_customer_idx on warranty_documents(customer_id);

-- ---------- admin_users ----------
-- Password is bcrypt-hashed by the /api/admin/login route — never store plaintext.
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  password_hash text not null,
  name text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table site_content enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table warranty_documents enable row level security;
alter table admin_users enable row level security;

-- Public catalog data: anyone can read
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read site_content" on site_content for select using (true);

-- Customers: a logged-in user can read/update only their own row
create policy "own profile read" on customers for select using (auth.uid() = id);
create policy "own profile update" on customers for update using (auth.uid() = id);

-- Orders: a logged-in customer can read only their own orders.
-- Guest checkout writes go through the server (service-role key), which
-- bypasses RLS on purpose — never expose the service-role key to the browser.
create policy "own orders read" on orders for select using (auth.uid() = customer_id);

-- Warranty documents: a logged-in customer can read only their own documents
create policy "own warranty read" on warranty_documents for select using (auth.uid() = customer_id);

-- admin_users: no client access at all (only the service-role key, used
-- server-side in /api/admin/login, can read this table)
create policy "no client access" on admin_users for select using (false);

-- =====================================================================
-- Storage bucket for warranty documents / product images
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('warranty-docs', 'warranty-docs', true)
on conflict (id) do nothing;

-- =====================================================================
-- Seed data — matches the homepage you already have, so the site works
-- immediately after you run this file.
-- =====================================================================
insert into categories (slug, label, icon, sort_order) values
  ('robotics', 'রোবোটিক্স', 'bot', 1),
  ('iot', 'আইওটি ও কানেক্টিভিটি', 'wifi', 2),
  ('microcontrollers', 'মাইক্রোকন্ট্রোলার', 'cpu', 3),
  ('sensors', 'সেন্সর ও মডিউল', 'radio', 4),
  ('motors', 'মোটর ও ড্রাইভার', 'cog', 5),
  ('power', 'পাওয়ার ও ব্যাটারি', 'battery', 6),
  ('tools', 'টুলস ও ল্যাব', 'wrench', 7),
  ('engineering-kits', 'ইঞ্জিনিয়ারিং কিটস', 'layers', 8)
on conflict (slug) do nothing;

insert into site_content (key, value) values
  ('hero_banner', '{
    "eyebrow": "অরিজিনাল পার্টস ও ফাস্ট ডেলিভারি",
    "headline": "ভবিষ্যতের রোবোটিক্স প্রযুক্তি এখন আপনার হাতে",
    "subtext": "শীর্ষমানের আরডুইনো, রোভার কম্পোনেন্ট ও এম্বেডেড সেন্সর ল্যাব এক্সেস করুন এক ক্লিকে।",
    "promoTitle": "IoT স্টার্টার কিট",
    "promoSubtitle": "২৫% স্পেশাল ফ্ল্যাশ ছাড়!",
    "promoCta": "ল্যাব এক্সপ্লোর"
  }'),
  ('marquee_offers', '[
    "নতুন গ্রাহকদের জন্য ১০% ছাড় — কোড: WELCOME10",
    "৫০০৳+ অর্ডারে ঢাকার ভেতরে ফ্রি ডেলিভারি",
    "স্টুডেন্ট আইডি দেখিয়ে প্রজেক্ট কিটে বিশেষ ছাড়",
    "ক্যাশ অন ডেলিভারি সারাদেশে উপলব্ধ"
  ]')
on conflict (key) do nothing;

insert into products (
  slug, sku, title, description, category_slug, image, gallery, price, original_price,
  rating, reviews, in_stock, badge_label, badge_tone, specs, spec_table, pinout,
  bundle_items, youtube_url, is_flash_deal, is_kit, kit_level, kit_tag, voltage, bus
) values
(
  'arduino-uno-r3', 'RK-ARD-001', 'Arduino Uno R3 (অরিজিনাল চিপ)',
  'ATmega328P ভিত্তিক অরিজিনাল Arduino Uno R3, সব ধরনের বিগিনার প্রজেক্টের জন্য আদর্শ।',
  'microcontrollers',
  'https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=800&auto=format&fit=crop"]',
  850, 1050, 4.9, 130, true, 'ইন স্টক', 'emerald',
  '["16MHz","5V Logic"]',
  '[{"label":"মাইক্রোকন্ট্রোলার","value":"ATmega328P"},{"label":"ক্লক স্পিড","value":"16 MHz"},{"label":"অপারেটিং ভোল্টেজ","value":"5V"},{"label":"ডিজিটাল I/O পিন","value":"14"}]',
  '[{"pin":"5V","voltage":"5V"},{"pin":"GND","voltage":"GND"},{"pin":"A0-A5","voltage":"Analog"}]',
  '[]', null, true, false, null, null, '5V', 'GPIO'
),
(
  'esp32-wifi-ble-devkit', 'RK-ESP32-C38', 'ESP32 Wi-Fi + Bluetooth ডুয়াল কোর ডেভেলপমেন্ট বোর্ড (Type-C)',
  'Xtensa Dual-Core LX6 @ 240MHz, 520KB SRAM, 4MB Flash সহ ESP32 DevKit — Wi-Fi ও BLE একসাথে।',
  'microcontrollers',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"]',
  520, 650, 4.9, 84, true, 'ইন-স্টক রেপ্লিকা', 'emerald',
  '["Dual Core","38 Pin"]',
  '[{"label":"প্রসেসর কোর","value":"Xtensa Dual-Core 32-bit LX6 @ 240MHz"},{"label":"SRAM / মেমোরি","value":"520 KB SRAM"},{"label":"ফ্ল্যাশ স্টোরেজ","value":"4MB SPI Flash"},{"label":"ওয়াই-ফাই কানেকশন","value":"802.11 b/g/n (150 Mbps পর্যন্ত)"},{"label":"ব্লুটুথ ভার্সন","value":"Bluetooth v4.2 BR/EDR এবং BLE"},{"label":"পেরিফেরাল ইন্টারফেস","value":"GPIO, ADC, DAC, I2C, SPI, UART, PWM"},{"label":"অপারেটিং ভোল্টেজ","value":"3.3V Logic / 5V USB Input"}]',
  '[{"pin":"3V3","voltage":"3.3V"},{"pin":"GND","voltage":"GND"},{"pin":"GPIO21/22","voltage":"I2C"}]',
  '[{"title":"ESP32 DevKit Type-C বোর্ড","subtitle":"মেইন মাইক্রোকন্ট্রোলার","price":520},{"title":"830-পয়েন্ট প্রোটোটাইপ ব্রেডবোর্ড","subtitle":"MB-102 সেনরেবল","price":100},{"title":"৪০ পিস মেন-টু-মেল জাম্পার ওয়্যার","subtitle":"20cm কপার ওয়্যার","price":70},{"title":"0.96 inch I2C OLED ডিসপ্লে মডিউল","subtitle":"128x64 SSD1306","price":280}]',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  true, false, null, null, '3.3V', 'I2C'
),
(
  'hc-sr04-ultrasonic', 'RB-SN-004', 'HC-SR04 আল্ট্রাসনিক ডিস্ট্যান্স সেন্সর মডিউল',
  'রোবোটিক্স ও অবস্ট্যাকল এভয়েডেন্স প্রজেক্টের জন্য সবচেয়ে ব্যবহৃত ডিস্ট্যান্স সেন্সর।',
  'sensors',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"]',
  120, null, 4.7, 62, true, 'ইন স্টক', 'emerald',
  '["5V DC","2cm-400cm"]',
  '[{"label":"অপারেটিং ভোল্টেজ","value":"5V DC"},{"label":"রেঞ্জ","value":"2cm–400cm"},{"label":"ট্রিগার/ইকো","value":"Digital"}]',
  '[{"pin":"VCC","voltage":"5V"},{"pin":"TRIG","voltage":"D"},{"pin":"ECHO","voltage":"D"},{"pin":"GND","voltage":"GND"}]',
  '[]', null, false, false, null, null, '5V', 'GPIO'
),
(
  'dht22-temp-humidity', 'RB-SN-022', 'DHT22 ডিজিটাল টেম্পারেচার ও হিউমিডিটি সেন্সর',
  'নির্ভুল টেম্পারেচার ও হিউমিডিটি মাপার জন্য ওয়েদার স্টেশন প্রজেক্টে ব্যবহৃত হয়।',
  'sensors',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"]',
  340, null, 4.6, 41, true, null, null,
  '["3.3V-6V DC","-40°C ~ +80°C"]',
  '[{"label":"অপারেটিং ভোল্টেজ","value":"3.3V–6V DC"},{"label":"রেঞ্জ","value":"-40°C ~ +80°C"}]',
  '[{"pin":"VDD","voltage":"3.3-5V"},{"pin":"DATA","voltage":"Sig"},{"pin":"NC","voltage":"-"},{"pin":"GND","voltage":"GND"}]',
  '[]', null, false, false, null, null, '5V', 'GPIO'
)
on conflict (slug) do nothing;

insert into products (
  slug, sku, title, description, category_slug, image, gallery, price, original_price,
  rating, reviews, in_stock, badge_label, badge_tone, specs, bundle_items,
  is_flash_deal, is_kit, kit_level, kit_tag, voltage, bus
) values
(
  'smart-rover-4wd', 'RK-KIT-101', 'রোভার কার স্মার্ট কিট (4WD)',
  'অবস্ট্যাকল এভয়েডেন্স ও ব্লুটুথ কন্ট্রোল প্রজেক্ট, সম্পূর্ণ গাইডসহ।',
  'engineering-kits',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop"]',
  1850, null, 4.8, 34, true, null, null, '[]', '[]',
  false, true, 'বিগিনার', 'টিউটোরিয়াল সহ', null, null
),
(
  'iot-home-automation', 'RK-KIT-102', 'আইওটি হোম অটোমেশন কিট',
  'মোবাইল অ্যাপ দিয়ে ঘরের ফ্যান ও লাইট নিয়ন্ত্রণ করুন Blynk দিয়ে।',
  'engineering-kits',
  'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop"]',
  2150, null, 4.7, 28, true, null, null, '[]', '[]',
  false, true, 'ইন্টারমিডিয়েট', 'Blynk ও MQTT', null, null
)
on conflict (slug) do nothing;

-- =====================================================================
-- Your first admin login
-- =====================================================================
-- This file cannot hash a password for you (SQL has no bcrypt by
-- default). After deploying, open:  https://<your-site>/ops-admin/setup
-- once — it lets you create the FIRST admin (phone + password) safely,
-- then that page permanently disables itself. See README for details.
