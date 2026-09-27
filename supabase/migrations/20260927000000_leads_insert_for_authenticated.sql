-- =============================================================================
-- Migration: leads_insert_for_authenticated
-- Fecha:     2026-09-27
-- =============================================================================
-- Arregla un 403 al enviar el formulario del chatbot estando logueado.
--
-- EL BUG
-- `leads` tenía una sola policy de INSERT, `to anon`. Eso alcanzaba mientras el
-- cliente de Supabase corría con `persistSession: false`: la landing iba
-- siempre como anon, aunque la persona tuviera cuenta.
--
-- Al agregar el panel, `persistSession` pasó a true para que la sesión
-- sobreviva a las recargas. Desde entonces, alguien del equipo con sesión
-- abierta navega la landing con el rol `authenticated` — y para ese rol no
-- había ninguna policy de INSERT, así que el envío fallaba con 403.
--
-- A un visitante público nunca le pasó: va como anon. Le pasa sólo a la gente
-- de NEOS, que es justamente quien prueba el formulario.
--
-- LA SOLUCIÓN
-- Permitir INSERT también a `authenticated`. No agrega exposición: la tabla ya
-- acepta inserts anónimos, así que no hay nada que un usuario logueado pueda
-- hacer acá que no pudiera hacer sin cuenta. Leer y editar leads siguen
-- restringidos a empleados activos.
-- =============================================================================

create policy "Authenticated can insert leads"
  on public.leads for insert
  to authenticated
  with check (true);
