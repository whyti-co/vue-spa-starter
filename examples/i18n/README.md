# Internationalization (i18n)

Two examples demonstrating FormatJS/vue-intl integration.

## simple.tsx

Standalone i18n setup with inline messages. Good for understanding the basics:
- `createIntl` / `createIntlCache` usage
- ICU message syntax (plurals, dates, currency)
- Locale switching with reactive state

## advanced.tsx

Uses app-wide i18n from `src/i18n/`:
- `provideI18n` / `useI18n` composables
- JSON message files in `src/i18n/messages/`

## ICU Message Syntax

```
{count, plural, =0 {no items} one {# item} other {# items}}
{amount, number, ::currency/USD}
{date, date, long}
```
