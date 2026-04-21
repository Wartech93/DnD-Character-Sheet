import {Form, useLoaderData} from '@remix-run/react';
import {json, redirect} from '@remix-run/node';

import {login} from '../shopify.server';

export const loader = async ({request}) => {
  const url = new URL(request.url);

  if (url.searchParams.get('shop')) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({showForm: Boolean(login)});
};

export default function Index() {
  const {showForm} = useLoaderData();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.eyebrow}>Shopify Customer Accounts</p>
        <h1 style={styles.title}>D&D 3.5 Character Sheets</h1>
        <p style={styles.body}>
          This app adds a customer account page where customers can create, edit, and keep multiple Dungeons & Dragons 3.5 character sheets tied to their Shopify account.
        </p>
        {showForm ? (
          <Form method="post" action="/auth/login" style={styles.form}>
            <label style={styles.label}>
              <span>Shop domain</span>
              <input name="shop" type="text" placeholder="example.myshopify.com" style={styles.input} />
            </label>
            <button type="submit" style={styles.button}>Install app</button>
          </Form>
        ) : null}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    margin: 0,
    background:
      'radial-gradient(circle at top, rgba(144, 106, 67, 0.16), transparent 45%), linear-gradient(180deg, #1f1914 0%, #120f0d 100%)',
    color: '#f6ecdf',
    fontFamily: 'Inter, sans-serif',
    padding: '24px',
  },
  card: {
    width: 'min(640px, 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(246, 236, 223, 0.14)',
    background: 'rgba(28, 22, 18, 0.9)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
    padding: '32px',
  },
  eyebrow: {
    margin: '0 0 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    fontSize: '12px',
    color: '#d4b594',
  },
  title: {
    margin: '0 0 12px',
    fontSize: '36px',
    lineHeight: 1.1,
  },
  body: {
    margin: '0 0 24px',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#e7d7c4',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  label: {
    display: 'grid',
    gap: '8px',
    fontSize: '14px',
  },
  input: {
    borderRadius: '14px',
    border: '1px solid rgba(246, 236, 223, 0.16)',
    background: '#241d18',
    color: '#f6ecdf',
    padding: '12px 14px',
    fontSize: '15px',
  },
  button: {
    border: 0,
    borderRadius: '999px',
    padding: '12px 18px',
    background: '#c08749',
    color: '#1c130c',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
  },
};