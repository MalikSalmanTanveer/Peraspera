# Careers page + Admin dashboard (T-01)

**Date:** 2026-08-03  
**Status:** Implemented in codebase (requires Supabase migration + Edge deploy)

## Summary

Schema-builder CMS for Peraspera careers:

- Public `/careers` with culture block + published roles
- `/careers/:slug` with dynamic job details + dynamic application form (incl. file upload)
- `/admin` CMS for departments, schemas/fields, jobs, applications, culture content
- Data in Supabase; admin mutations via Edge Functions + session tokens

## Locked decisions

- Departments as categories
- Fully dynamic job fields and application fields
- File uploads to `career-applications` bucket
- Admin login UX: `admin@peraspera.solutions` / `Letsbegin`
- Auth: Edge `admin-login` + `admin-api` (service role), not client-only password checks for writes

## Surfaces

| Path | Audience |
|------|----------|
| `/careers` | Public |
| `/careers/:slug` | Public |
| `/admin` | Admin |

## Data

See migration `supabase/migrations/20260803120000_create_careers_cms.sql`.

## Setup

See `supabase/CAREERS_SETUP.md`.
