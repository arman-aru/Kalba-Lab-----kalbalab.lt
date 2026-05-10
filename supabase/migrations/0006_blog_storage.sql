-- ============================================================
-- Blog: media storage bucket
-- Run after 0005_blog_posts.sql. Idempotent.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read blog media" on storage.objects;
create policy "Public read blog media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-media');

drop policy if exists "Admins write blog media" on storage.objects;
create policy "Admins write blog media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-media' and public.is_admin());

drop policy if exists "Admins update blog media" on storage.objects;
create policy "Admins update blog media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-media' and public.is_admin())
  with check (bucket_id = 'blog-media' and public.is_admin());

drop policy if exists "Admins delete blog media" on storage.objects;
create policy "Admins delete blog media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-media' and public.is_admin());
