-- Dutch Kicks seed data — verified master inventory 2026-05-03

insert into inventory (title, category, status, image_url, ref_image_url, metadata) values
-- KICKS
('Jordan Flight Origin 3', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/786480498511670358_0',
  '{"sku":"820245-106","size":10.5,"colorway":"White/White"}'),

('Adidas Racer TR23', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/18075492304714568902_0',
  '{"sku":"IG7322","size":10,"colorway":"TBD"}'),

('Adidas Astrastar', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/5863829024263562673_0',
  '{"sku":"IF5312","size":10,"colorway":"TBD"}'),

('Adidas Grand Court 2.0', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/7108612109228251978_0',
  '{"sku":"GW9195","size":10,"colorway":"TBD"}'),

('Adidas Kaptir 4.0', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/9950968841080822498_0',
  '{"sku":"ID1150","size":10,"colorway":"TBD"}'),

('Adidas Nora', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/4392100372815616701_0',
  '{"sku":"HP6011","size":9.5,"colorway":"Maroon"}'),

('New Balance ABZORB 2000', 'kicks', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/54553534057662021_0',
  '{"sku":null,"size":9,"colorway":"TBD"}'),

-- ref_image_url null — awaiting high-res pull
('Adidas Duramo SL 2 M', 'kicks', 'available',
  null, null,
  '{"sku":"GW8336","size":10,"colorway":"TBD"}'),

('Adidas Treziod 2', 'kicks', 'available',
  null, null,
  '{"sku":"GY0047","size":10,"colorway":"TBD"}'),

-- FIGHT (UFC trading cards)
('Don Frye – Fighter Gear Relic', 'fight', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/8513795943234353377_0',
  '{"serial":"063/188","set_name":"Fighter Gear Relic","autograph":false,"parallel":null}'),

('Nick Diaz – Prizm Parallel', 'fight', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/7405318696073013314_0',
  '{"serial":"52/99","set_name":"Prizm","autograph":false,"parallel":"Prizm"}'),

('Aljamain Sterling – Select Signatures', 'fight', 'available',
  null,
  'http://googleusercontent.com/image_collection/image_retrieval/5632976608499296218_0',
  '{"serial":null,"set_name":"Select Signatures","autograph":true,"parallel":null}'),

-- serial null — not yet recorded
('Cain Velasquez – Fight Mat Relic', 'fight', 'available',
  null, null,
  '{"serial":null,"set_name":"Fight Mat Relic","autograph":false,"parallel":null,"notes":"Event Used"}'),

('Petr Yan – Opti-Graphs Auto', 'fight', 'available',
  null, null,
  '{"serial":null,"set_name":"Opti-Graphs","autograph":true,"parallel":null}'),

('Brian Ortega – Prizm Signatures', 'fight', 'available',
  null, null,
  '{"serial":null,"set_name":"Prizm Signatures","autograph":true,"parallel":null}'),

('Nate Diaz – Black Parallel', 'fight', 'available',
  null, null,
  '{"serial":null,"set_name":"Chronicles","autograph":false,"parallel":"Black"}'),

('Don Frye – Octagon of Honor', 'fight', 'available',
  null, null,
  '{"serial":null,"set_name":"Octagon of Honor","autograph":false,"parallel":null,"card_number":"OOH-7"}');
