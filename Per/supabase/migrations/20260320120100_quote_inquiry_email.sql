-- Enables automatic email notifications when a quote inquiry is inserted.
-- Run once in Supabase SQL Editor after the quote_inquiries table exists.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_quote_inquiry_email()
returns trigger
language plpgsql
security definer
set search_path = public, net, extensions
as $$
declare
  resend_key text := 'RE_RESEND_API_KEY';
  notify_email text := 'contact.peraspera@gmail.com';
  from_email text := 'onboarding@resend.dev';
  email_subject text;
  email_html text;
begin
  email_subject := 'New quote inquiry: ' || new.service
    || case when new.company is not null and new.company <> '' then ' — ' || new.company else '' end;

  email_html :=
    '<div style="font-family:system-ui,sans-serif;max-width:560px;color:#111;">'
    || '<h2 style="margin:0 0 16px;">New quote inquiry</h2>'
    || '<p><strong>Name:</strong> ' || coalesce(nullif(new.full_name, ''), '—') || '</p>'
    || '<p><strong>Company:</strong> ' || coalesce(nullif(new.company, ''), '—') || '</p>'
    || '<p><strong>Email:</strong> ' || new.email || '</p>'
    || '<p><strong>Service:</strong> ' || new.service || '</p>'
    || '<p><strong>Submitted:</strong> ' || to_char(new.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') || ' UTC</p>'
    || '<h3>Project details</h3>'
    || '<p style="white-space:pre-wrap;">' || new.details || '</p>'
    || '</div>';

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', from_email,
      'to', jsonb_build_array(notify_email),
      'reply_to', new.email,
      'subject', email_subject,
      'html', email_html
    ),
    timeout_milliseconds := 5000
  );

  return new;
end;
$$;

drop trigger if exists quote_inquiry_send_email on public.quote_inquiries;

create trigger quote_inquiry_send_email
  after insert on public.quote_inquiries
  for each row
  execute function public.notify_quote_inquiry_email();
