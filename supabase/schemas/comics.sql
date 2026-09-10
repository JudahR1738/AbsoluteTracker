create type comic_format as enum ('single_issue', 'tpb');

-- Comic Info Table
create table public.comics (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    issue_number text,
    format comic_format not null default 'single_issue',
    publisher text not null,
    genre text,
    main_character text,
    author text,
    penciler text,
    inker text,
    letterer text,
    condition text,
    notes text,
    cover_img_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Row level security
-- 'auth.uid()' extracts logged-in user's ID from their JSON Web Token
alter table public.comics enable row level security;

create policy "Users can view own collection"
    on public.comics for select
    using (auth.uid() = user_id);

-- with check inspects incoming data before allowing the write
create policy "Users can insert comics into own collection"
    on public.comics for insert
    with check (auth.uid() = user_id);

create policy "Users can update own collection"
    on public.comics for update
    using (auth.uid() = user_id);

create policy "Users can delete from own collection"
    on public.comics for delete
    using (auth.uid() = user_id);

-- Auto update timestamp trigger
create trigger on_comics_updated
    before update on public.comics
    for each row execute function handle_updated_at();