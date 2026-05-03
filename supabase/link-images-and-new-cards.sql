-- Dutch Kicks — link storage images + insert new fight cards
-- Paste into Supabase SQL Editor and run.
-- If your Storage bucket is NOT named "inventory-images", replace that string below.

do $$
declare
  base text := 'https://kovnrrblntwipabmeobq.supabase.co/storage/v1/object/public/inventory-images/';
begin

  -- ── UPDATE existing fight cards with image_url ────────────────────────────

  update inventory set image_url = base || 'fight-cain-velasquez-topps-finest-mat-relic.jpg'
    where title ilike '%Cain Velasquez%';

  update inventory set image_url = base || 'fight-petr-yan-donruss-optic-optigraphs-auto.jpg'
    where title ilike '%Petr Yan%';

  update inventory set image_url = base || 'fight-brian-ortega-prizm-auto.jpg'
    where title ilike '%Brian Ortega%';

  update inventory set image_url = base || 'fight-nate-diaz-ufc-black.jpg'
    where title ilike '%Nate Diaz%';

  update inventory set image_url = base || 'fight-aljamain-sterling-select-auto.jpg'
    where title ilike '%Aljamain Sterling%';

  update inventory set image_url = base || 'fight-don-frye-topps-fighter-gear-relic-100-serial63.jpg'
    where title ilike '%Don Frye%' and title ilike '%Fighter Gear%';

  update inventory set image_url = base || 'fight-don-frye-octagon-of-honor.jpg'
    where title ilike '%Don Frye%' and title ilike '%Octagon%';

  -- Nick Diaz Chronicles /75 — correct serial + image on existing row
  update inventory
    set image_url  = base || 'fight-nick-diaz-chronicles-75-serial52.jpg',
        title      = 'Nick Diaz – Chronicles /75',
        metadata   = jsonb_set(jsonb_set(metadata, '{serial}', '"52/75"'), '{set_name}', '"Chronicles"')
    where title ilike '%Nick Diaz%';

  -- ── INSERT new fight cards ────────────────────────────────────────────────

  insert into inventory (title, category, status, image_url, metadata) values

  ('Fabricio Werdum – Topps Finest Mat Relic', 'fight', 'available',
    base || 'fight-fabricio-werdum-topps-finest-mat-relic-front.jpg',
    '{"serial":null,"set_name":"Topps Finest","autograph":false,"parallel":null,"notes":"Authentic Event-Used Fight Mat"}'),

  ('Khamzat Chimaev – Prizm RC PSA 9', 'fight', 'available',
    base || 'fight-khamzat-chimaev-prizm-rc-psa9.jpg',
    '{"serial":"69725572","set_name":"Prizm","autograph":false,"parallel":null,"grade":"PSA 9","card_number":"7","notes":"Rookie Card"}'),

  ('Jiri Prochazka – Select Auto Relic', 'fight', 'available',
    base || 'fight-jiri-prochazka-select-auto-relic.jpg',
    '{"serial":null,"set_name":"Select","autograph":true,"parallel":null,"weight_class":"Light Heavyweight"}'),

  ('Miesha Tate – Origins Auto', 'fight', 'available',
    base || 'fight-miesha-tate-origins-auto.jpg',
    '{"serial":null,"set_name":"Origins","autograph":true,"parallel":null,"weight_class":"Bantamweight"}'),

  ('Royce Gracie – Topps Fighter Gear Relic', 'fight', 'available',
    base || 'fight-royce-gracie-topps-fighter-gear-relic-front.jpg',
    '{"serial":null,"set_name":"2010 Topps UFC Main Event","autograph":false,"parallel":null,"card_number":"FR-RG","notes":"Authentic Fighter-Worn Gear"}'),

  ('Royce Gracie – Panini Chronicles HOF Auto', 'fight', 'available',
    base || 'fight-royce-gracie-panini-chronicles-hof-auto-back.jpg',
    '{"serial":null,"set_name":"2022 Panini Chronicles UFC","autograph":true,"parallel":null,"card_number":"HF-RGC","notes":"Hall of Fame Relic Auto · PSA authenticated"}'),

  ('Dricus Du Plessis – Prizm RC', 'fight', 'available',
    base || 'fight-dricus-du-plessis-prizm-rc.jpg',
    '{"serial":null,"set_name":"Prizm","autograph":false,"parallel":null,"weight_class":"Middleweight","notes":"Rookie Card"}'),

  ('Dricus Du Plessis – Select RC', 'fight', 'available',
    base || 'fight-dricus-du-plessis-select-rc.jpg',
    '{"serial":null,"set_name":"2022 Select","autograph":false,"parallel":null,"weight_class":"Middleweight","notes":"Rookie Card"}'),

  ('Donald Cerrone – Select Mat Relic', 'fight', 'available',
    base || 'fight-donald-cerrone-select-mat-relic.jpg',
    '{"serial":null,"set_name":"2022 Select","autograph":false,"parallel":null,"weight_class":"Welterweight","notes":"Fight Mat Relic"}'),

  ('Nick Diaz – Luminance /99', 'fight', 'available',
    base || 'fight-nick-diaz-luminance-99-serial43.jpg',
    '{"serial":"43/99","set_name":"Luminance","autograph":false,"parallel":"Luminance","weight_class":"Middleweight"}'),

  ('Chuck Liddell – Donruss Signature Series Auto', 'fight', 'available',
    base || 'fight-chuck-liddell-donruss-signature-series-auto.jpg',
    '{"serial":null,"set_name":"Donruss","autograph":true,"parallel":"Signature Series"}'),

  ('Robbie Lawler – Flux Auto', 'fight', 'available',
    base || 'fight-robbie-lawler-flux-auto.jpg',
    '{"serial":null,"set_name":"Flux","autograph":true,"parallel":null,"weight_class":"Welterweight"}');

end $$;
