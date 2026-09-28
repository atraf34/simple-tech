-- Run once in Supabase SQL editor (existing databases)
alter table categories add column if not exists color text not null default 'emerald';
update categories set color = 'violet'  where slug = 'robotics';
update categories set color = 'blue'    where slug = 'iot';
update categories set color = 'emerald' where slug = 'microcontrollers';
update categories set color = 'cyan'    where slug = 'sensors';
update categories set color = 'orange'  where slug = 'motors';
update categories set color = 'amber'   where slug = 'power';
update categories set color = 'rose'    where slug = 'tools';
update categories set color = 'pink'    where slug = 'engineering-kits';
