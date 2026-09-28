-- Run once in Supabase SQL editor.
-- 1) Store every phone in the canonical 01XXXXXXXXX form
update customers set phone = '0' || right(regexp_replace(phone, '\D', '', 'g'), 10)
  where phone is not null and regexp_replace(phone, '\D', '', 'g') ~ '^(88)?01[3-9][0-9]{8}$';

-- 2) One account per mobile number, enforced by the database
--    (if this errors, two accounts share a number: delete one in Admin > অ্যাকাউন্ট, then re-run)
create unique index if not exists customers_phone_unique on customers(phone) where phone is not null;
