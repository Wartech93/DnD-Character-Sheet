import {json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {
  Badge,
  BlockStack,
  Box,
  Card,
  InlineStack,
  Layout,
  Link,
  List,
  Page,
  Text,
} from '@shopify/polaris';
import {TitleBar} from '@shopify/app-bridge-react';

import {authenticate} from '../shopify.server';

export const loader = async ({request}) => {
  const {session} = await authenticate.admin(request);

  return json({
    shop: session.shop,
    metafieldNamespace: '$app:dnd_character_sheets',
    metafieldKey: 'character_sheets',
  });
};

export default function AppIndex() {
  const {shop, metafieldNamespace, metafieldKey} = useLoaderData();

  return (
    <Page>
      <TitleBar title="D&D Character Sheets" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingLg">App status</Text>
                <Badge tone="success">Installed</Badge>
              </InlineStack>
              <Text as="p" variant="bodyMd">
                The app backend is installed for <strong>{shop}</strong> and will create the customer metafield definition used by the customer-account extensions after auth.
              </Text>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>{JSON.stringify({namespace: metafieldNamespace, key: metafieldKey, type: 'json'}, null, 2)}</pre>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Next steps</Text>
              <List>
                <List.Item>Run <code>npm run dev</code> and install the app on your development store.</List.Item>
                <List.Item>Add the profile block extension in customer account editor so customers can open the full character-sheet page.</List.Item>
                <List.Item>Deploy the app to a real HTTPS domain before production use.</List.Item>
              </List>
              <Link url="https://shopify.dev/docs/apps/build/customer-accounts/full-page-extensions" target="_blank" removeUnderline>
                Customer account full-page extensions
              </Link>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}