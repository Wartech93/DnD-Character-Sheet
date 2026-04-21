# D&D Character Sheets for Shopify Customer Accounts

This app adds a Dungeons & Dragons 3.5 character-sheet experience to Shopify customer accounts.

It includes:

- A full-page customer-account extension where customers can create, edit, duplicate, and delete multiple character sheets.
- A profile block extension that links customers into the full-page sheet manager.
- A Shopify Remix backend that handles app auth and creates the customer metafield definition used by the extensions.

## Requirements

1. Node.js 18.20 or newer.
2. A Shopify Partner account.
3. A development store with customer-account extensibility enabled.

## Local development

1. Install dependencies with `npm install`.
2. Start the app with `npm run dev`.
3. Use the Shopify CLI install link to install the app on your development store.
4. In the customer account editor, add the `D&D Character Sheet Entry` profile block so customers can open the full page from their profile.

## Data model

Customer sheets are stored in a customer metafield:

- Namespace: `$app:dnd_character_sheets`
- Key: `character_sheets`
- Type: `json`

The backend creates this metafield definition after app auth if it does not already exist.

## Production notes

- Replace the placeholder `application_url` and `redirect_urls` in `shopify.app.toml` with your real deployed HTTPS app URL before production release.
- Keep the profile entry block published or add the full-page extension link to the merchant's customer account navigation.
- Create a PostgreSQL database and set `DATABASE_URL` in your hosting environment before running Prisma commands.
- Run `npm run setup` during deployment so Prisma can generate the client and apply the schema to PostgreSQL.
