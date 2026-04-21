import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default async () => {
  render(<ProfileEntry />, document.body);
};

function ProfileEntry() {
  return (
    <s-section heading="Character sheets">
      <s-stack direction="inline" justifyContent="space-between" alignItems="center" gap="base">
        <s-stack direction="block" gap="small">
          <s-heading>D&D 3.5 roster</s-heading>
          <s-text>
            View and edit all characters tied to this customer account.
          </s-text>
        </s-stack>
        <s-button variant="primary" href="extension:dnd-character-sheets/">
          Open sheets
        </s-button>
      </s-stack>
    </s-section>
  );
}