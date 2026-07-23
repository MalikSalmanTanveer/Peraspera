# Supabase setup — quote form

## Already done in code

- `.env` has your Supabase URL + anon key
- Form saves to `quote_inquiries` (verified working)
- Resend key is in `.env` for reference

## One step left — enable email (30 seconds)

The Supabase CLI on this machine is logged into a **different account**, so email SQL must be run in your dashboard:

1. Open **[SQL Editor](https://supabase.com/dashboard/project/fsgmztnmlzlxmrntsrye/sql/new)** for your project
2. Open `supabase/.generated-setup-email.sql` in this repo
3. Copy all → paste → **Run**

That installs a database trigger: every new form submission sends you an email via Resend.

## Test

1. `npm run dev`
2. Submit the contact form
3. Check **Table Editor → quote_inquiries**
4. Check `contact.peraspera@gmail.com` inbox

## Resend note

With `onboarding@resend.dev`, emails only go to the address you used to sign up for Resend. If that's not `contact.peraspera@gmail.com`, either sign up Resend with that email or verify your domain in Resend for production.

## Optional: CLI deploy (Edge Function alternative)

If you prefer Edge Functions over the SQL trigger, log into the **same Supabase account** as your project:

```bash
supabase login
supabase link --project-ref fsgmztnmlzlxmrntsrye
supabase secrets set RESEND_API_KEY=re_xxxx NOTIFY_EMAIL=contact.peraspera@gmail.com
supabase functions deploy send-quote-notification
```

Then add a Database Webhook (INSERT on `quote_inquiries` → `send-quote-notification`).
