
-- Criação do bucket 'avatars' (fotos de perfil) e liberação dos acessos públicos

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Permitir que qualquer usuário faça upload (INSERT) no bucket avatars
create policy "Public upload acesso ao bucket avatars" on storage.objects
  for insert
  to public
  with check (bucket_id = 'avatars');

-- Permitir que qualquer usuário leia arquivos do bucket avatars
create policy "Public select acesso ao bucket avatars" on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

-- Permitir que qualquer usuário atualize seus próprios arquivos do bucket avatars (opcional)
create policy "Public update acesso ao bucket avatars" on storage.objects
  for update
  to public
  using (bucket_id = 'avatars');

-- Permitir que qualquer usuário remova seus próprios arquivos do bucket avatars (opcional)
create policy "Public delete acesso ao bucket avatars" on storage.objects
  for delete
  to public
  using (bucket_id = 'avatars');
