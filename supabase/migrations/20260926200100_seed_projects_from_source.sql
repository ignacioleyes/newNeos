-- =============================================================================
-- Migration: seed_projects_from_source
-- Fecha:     2026-09-26
-- =============================================================================
-- Carga inicial de regions y projects. GENERADO desde src/data/*.ts para que
-- el contenido sea idéntico al que ya estaba publicado — no transcrito a mano.
--
-- Las lat/lng de los proyectos salen de los dots del mapa de cada región,
-- que eran 1:1 con los proyectos.
--
-- Las secciones de detalle (project_sections) NO se cargan acá: sus payloads
-- se diseñan junto con el template data-driven.
-- =============================================================================

insert into public.regions
  (slug, name, description, lat, lng, map_center_lat, map_center_lng, map_zoom, gradient_key, display_order)
values
  ('salta-capital', 'Salta Capital', '{"es":"Residencial premium y barrios privados en el Valle de Lerma.","en":"Premium residential and gated communities in the Lerma Valley."}'::jsonb, -24.78, -65.41, -24.78, -65.41, 11, 'rose', 1),
  ('cafayate', 'Cafayate', '{"es":"Lifestyle, turismo y vino entre montañas.","en":"Lifestyle, tourism and wine between mountains."}'::jsonb, -26.07, -65.97, -26.075, -65.972, 14, 'amber', 2),
  ('vaca-muerta', 'Vaca Muerta', '{"es":"Vivienda al servicio del polo energético.","en":"Housing serving the energy hub."}'::jsonb, -38.36, -68.78, -38.36, -68.78, 7, 'fuchsia', 3);

insert into public.projects
  (slug, name, hashtag, tagline, description, about, location, region_slug,
   status, units, tipologias, investment, amenities, services, highlights,
   hero_image, logo, brochure_url, progress_url, video_embed, maps_url,
   gradient_key, lat, lng, display_order, is_featured, is_published)
values
  ('chaquies', 'Chaquíes', '#stayincafayate',
   '{"es":"Cafayate desde una nueva perspectiva.","en":"Cafayate from a new perspective."}'::jsonb, '{"es":"Ubicado en el corazón de Cafayate, Chaquíes se encuentra a solo 300 mts de la plaza principal. Cuenta con 164 departamentos y +20.000 m² de desarrollo.","en":"Located in the heart of Cafayate, Chaquíes sits just 300 m from the main square. It comprises 164 apartments and over 20,000 m² of development."}'::jsonb, null, '{"es":"Cafayate, Salta","en":"Cafayate, Salta"}'::jsonb, 'cafayate',
   'en-obra', '{"es":"164 unidades","en":"164 units"}'::jsonb, '{"es":"Monoambientes, 1 y 2 dormitorios","en":"Studios, 1 and 2-bedroom apartments"}'::jsonb, '{"es":"En pozo · Anticipo 40% + 24 cuotas","en":"Pre-construction · 40% down + 24 installments"}'::jsonb,
   '[{"key":"2 piscinas","label":{"es":"2 Piscinas","en":"2 Pools"}},{"key":"piscina int. climatizada","label":{"es":"Piscina Int. Climatizada","en":"Indoor Heated Pool"}},{"key":"solarium","label":{"es":"Solarium","en":"Solarium"}},{"key":"spa","label":{"es":"Spa","en":"Spa"}},{"key":"bar","label":{"es":"Bar","en":"Bar"}},{"key":"kids zone","label":{"es":"Kids Zone","en":"Kids Zone"}},{"key":"kids zone cubierto","label":{"es":"Kids Zone Cubierto","en":"Indoor Kids Zone"}},{"key":"cine aire libre","label":{"es":"Cine Aire Libre","en":"Outdoor Cinema"}},{"key":"sum","label":{"es":"SUM","en":"Multipurpose Room"}},{"key":"gimnasio","label":{"es":"Gimnasio","en":"Gym"}},{"key":"yoga","label":{"es":"Yoga","en":"Yoga"}},{"key":"moto touring area","label":{"es":"Moto Touring Area","en":"Moto Touring Area"}},{"key":"fogoneros","label":{"es":"Fogoneros","en":"Fire Pits"}}]'::jsonb, null, '{"es":["164 unidades · 20.000 m²","13 amenities","A 300 m de la plaza"],"en":["164 units · 20,000 m²","13 amenities","300 m from the square"]}'::jsonb,
   '/projects/chaquies/newHero.jpg', '/projects/chaquies/logo.png', null, null, null, null,
   'amber', -26.0744, -65.9741, 1, true, true),
  ('greet-balcarce', 'Greet Balcarce', '#stayinsalta',
   '{"es":"Un punto de bienvenida en la ciudad.","en":"A welcoming spot in the city."}'::jsonb, '{"es":"Departamentos de 1, 2 y 3 dormitorios, diseñados para garantizar confort. Además de los pisos de residencias, el edificio cuenta con un SUM en terraza para el disfrute y la convivencia comunitaria.","en":"1, 2 and 3-bedroom apartments designed for comfort. In addition to the residential floors, the building features a rooftop SUM for enjoyment and community."}'::jsonb, '{"es":"Greet es la nueva propuesta de NEOS, la desarrolladora del Grupo SaltaPor. Ubicado estratégicamente en una zona en potencial crecimiento dentro de la ciudad de Salta, se presenta como una gran oportunidad de inversión para quienes buscan una renta simple. Cada inversor de Greet tiene asegurado un ticket bajo de inversión y puede convertirse en verdadero anfitrión de su unidad, con garantía de retorno y bajos costos de mantenimiento.","en":"Greet is the newest proposal from NEOS, the developer of Grupo SaltaPor. Strategically located in a high-potential growth area within the city of Salta, it stands out as a great investment opportunity for those seeking a simple income stream. Every Greet investor benefits from a low entry ticket and can become a true host of their unit, with guaranteed returns and low maintenance costs."}'::jsonb, '{"es":"Balcarce, Salta capital","en":"Balcarce, Salta capital"}'::jsonb, 'salta-capital',
   'en-obra', '{"es":"39 unidades","en":"39 units"}'::jsonb, '{"es":"1, 2 y 3 dormitorios + 1 local comercial","en":"1, 2 and 3-bedroom + 1 commercial unit"}'::jsonb, null,
   '[]'::jsonb, null, '{"es":["39 unidades · 1 local","SUM en terraza","Zona en crecimiento"],"en":["39 units · 1 commercial","Rooftop SUM","Growing area"]}'::jsonb,
   '/projects/greet-balcarce/hero.webp', '/projects/greet-balcarce/logo.png', null, 'https://www.youtube.com/playlist?list=PLMQAokpPK0kLDMaSxnXC5BPuYReZe6OPN', null, 'https://www.google.com/maps/place/24%C2%B046''16.9%22S+65%C2%B024''38.5%22W/@-24.771357,-65.410695,3947m/data=!3m1!1e3!4m4!3m3!8m2!3d-24.7713573!4d-65.4106948',
   'pink', -24.7821, -65.4106, 2, false, true),
  ('mercatus', 'Mercatus', '#mercatus',
   '{"es":"Un nuevo lugar para encontrarse en Cafayate.","en":"A new place to meet in Cafayate."}'::jsonb, '{"es":"Mercatus no es solo un mercado, es un destino. El primer mercado comercial de Cafayate — un lugar pensado para descubrir, disfrutar y conectar con lo mejor de la región.","en":"Mercatus isn''t just a market — it''s a destination. Cafayate''s first commercial market, designed to discover, enjoy and connect with the best of the region."}'::jsonb, '{"es":"Un paseo comercial, un nuevo encuentro, una gran experiencia.","en":"A retail walk, a new gathering spot, a great experience."}'::jsonb, '{"es":"Cafayate, Salta","en":"Cafayate, Salta"}'::jsonb, 'cafayate',
   'en-obra', '{"es":"22 locales comerciales","en":"22 commercial units"}'::jsonb, null, null,
   '[]'::jsonb, null, '{"es":["22 locales comerciales","300 m de la plaza central","Polo gastronómico y cultural"],"en":["22 commercial units","300 m from the main square","Gastronomic and cultural hub"]}'::jsonb,
   '/projects/mercatus/hero.png', '/projects/mercatus/logo.png', null, null, 'https://www.youtube.com/embed/z3i6-MpZCEc', null,
   'orange', -26.0712, -65.9722, 3, false, true),
  ('neweken', 'Neweken', null,
   '{"es":"Invertí en renta inmobiliaria en Vaca Muerta con ingresos desde el primer mes.","en":"Invest in real-estate income in Vaca Muerta with returns from month one."}'::jsonb, '{"es":"Vaca Muerta es una matriz productiva en expansión, con demanda habitacional estructural y sostenida en el tiempo. En ese contexto Neweken: un proyecto inmobiliario pensado para transformar ese crecimiento en renta inmobiliaria real.","en":"Vaca Muerta is an expanding productive engine with structural and sustained housing demand. In that context: Neweken, a real-estate project designed to turn that growth into real income."}'::jsonb, '{"es":"Más de 100 departamentos totalmente equipados, contratos con empresas petroleras multinacionales y un modelo de gestión 100% administrado por NEOS. Vos invertís en un activo productivo, NEOS gestiona, vos percibís la renta.","en":"More than 100 fully equipped apartments, contracts with multinational oil companies and a management model 100% run by NEOS. You invest in a productive asset, NEOS manages, you collect the income."}'::jsonb, '{"es":"Añelo, Vaca Muerta · Neuquén","en":"Añelo, Vaca Muerta · Neuquén"}'::jsonb, 'vaca-muerta',
   'en-obra', '{"es":"+100 departamentos","en":"+100 apartments"}'::jsonb, '{"es":"Equipados y administrados","en":"Equipped and managed"}'::jsonb, '{"es":"Desde USD 45.900","en":"From USD 45,900"}'::jsonb,
   '[]'::jsonb, null, '{"es":["Desde USD 45.900","Renta desde el primer mes","Gestión 100% NEOS"],"en":["From USD 45,900","Income from month one","100% NEOS management"]}'::jsonb,
   '/projects/neweken/hero.png', '/projects/neweken/logo.png', null, null, null, null,
   'emerald', -38.3556, -68.7864, 4, false, true),
  ('el-cauce-castellanos', 'El Cauce Castellanos', '#elcauce',
   '{"es":"Un hogar con encanto natural.","en":"A home with natural charm."}'::jsonb, '{"es":"Un barrio privado ubicado en Castellanos, San Lorenzo. 26 lotes exclusivos desde 800 m² con todos los servicios para vivir conectado con la naturaleza.","en":"A gated community in Castellanos, San Lorenzo. 26 exclusive lots from 800 m² with all services to live connected to nature."}'::jsonb, null, '{"es":"Castellanos, San Lorenzo · Salta","en":"Castellanos, San Lorenzo · Salta"}'::jsonb, 'salta-capital',
   'en-obra', '{"es":"26 lotes","en":"26 lots"}'::jsonb, '{"es":"Desde 800 m² exclusivos","en":"From 800 m² exclusive"}'::jsonb, null,
   '[{"key":"parque central","label":{"es":"Parque central","en":"Central park"}},{"key":"espejo de agua","label":{"es":"Espejo de agua","en":"Reflecting pool"}},{"key":"caminerias internas","label":{"es":"Caminerías internas","en":"Internal walkways"}},{"key":"salon usos multiples","label":{"es":"Salón usos múltiples","en":"Multipurpose room"}},{"key":"gym equipado","label":{"es":"Gym equipado","en":"Equipped gym"}},{"key":"juegos de ninos","label":{"es":"Juegos de niños","en":"Children''s play area"}},{"key":"fogoneros","label":{"es":"Fogoneros","en":"Fire pits"}}]'::jsonb, '{"es":["Acceso con seguridad","Servicios soterrados","Iluminación LED","Calles asfaltadas","Tratamiento integral de residuos","Agua · Luz · Gas"],"en":["Secure access","Underground utilities","LED lighting","Paved streets","Integral waste management","Water · Electricity · Gas"]}'::jsonb, '{"es":["26 lotes · desde 800 m²","Todos los servicios","Barrio privado"],"en":["26 lots · from 800 m²","All services","Gated community"]}'::jsonb,
   '/projects/el-cauce-castellanos/hero.webp', '/projects/el-cauce-castellanos/logo.png', null, null, null, null,
   'sky', -24.7178, -65.5022, 5, false, true);

