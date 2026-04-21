import '@shopify/shopify-app-remix/adapters/node';
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from '@shopify/shopify-app-remix/server';
import {PrismaSessionStorage} from '@shopify/shopify-app-session-storage-prisma';
import {restResources} from '@shopify/shopify-api/rest/admin/2024-10';

import prisma from './db.server';

const METAFIELD_KEY = 'character_sheets';
const METAFIELD_NAMESPACE = '$app:dnd_character_sheets';
const APP_URL = process.env.SHOPIFY_APP_URL || process.env.RENDER_EXTERNAL_URL || '';

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(','),
  appUrl: APP_URL,
  authPathPrefix: '/auth',
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
  },
  hooks: {
    afterAuth: async ({admin, session}) => {
      await shopify.registerWebhooks({session});

      const existingDefinition = await getMetafieldDefinition(admin);
      if (!existingDefinition) {
        await createMetafieldDefinition(admin);
      }
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? {customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN]}
    : {}),
});

export default shopify;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

async function getMetafieldDefinition(admin) {
  const response = await admin.graphql(
    `#graphql
      query GetCharacterSheetMetafieldDefinition($key: String!, $namespace: String!, $ownerType: MetafieldOwnerType!) {
        metafieldDefinitions(first: 1, key: $key, namespace: $namespace, ownerType: $ownerType) {
          nodes {
            id
          }
        }
      }
    `,
    {
      variables: {
        key: METAFIELD_KEY,
        namespace: METAFIELD_NAMESPACE,
        ownerType: 'CUSTOMER',
      },
    }
  );

  const json = await response.json();
  return json.data?.metafieldDefinitions?.nodes?.[0] ?? null;
}

async function createMetafieldDefinition(admin) {
  const response = await admin.graphql(
    `#graphql
      mutation CreateCharacterSheetMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            key
            namespace
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        definition: {
          access: {
            admin: 'MERCHANT_READ',
            customerAccount: 'READ_WRITE',
          },
          key: METAFIELD_KEY,
          name: 'D&D Character Sheets',
          namespace: METAFIELD_NAMESPACE,
          ownerType: 'CUSTOMER',
          type: 'json',
          description: 'Stores a customer-owned list of D&D 3.5 character sheets.',
        },
      },
    }
  );

  const json = await response.json();
  const userErrors = json.data?.metafieldDefinitionCreate?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(userErrors.map(({message}) => message).join('; '));
  }

  return json.data?.metafieldDefinitionCreate?.createdDefinition;
}