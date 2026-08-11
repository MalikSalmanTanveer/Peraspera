# Design: Education graduation field rules

**Date:** 2026-08-10  
**Status:** Approved — implementing

## Rules

Detect by field **label** (case-insensitive):

- **Current Year** — select with option **Graduate** (and year options)
- **Expected Graduation Year** — date

| Current Year value | Expected Graduation Year |
|--------------------|---------------------------|
| Graduate | Visible, **disabled**, value cleared, not required |
| 1st / 2nd / 3rd / Final Year (any non-Graduate) | Enabled, required, date must be **today or future** |

## Scope

- Public apply form (`DynamicApplicationForm`) only
- No form-builder UI for rules in this pass
- Label matching (approach 1)

## Out of scope

- Configurable conditional rules in admin
- Server-side mirror (optional follow-up)
