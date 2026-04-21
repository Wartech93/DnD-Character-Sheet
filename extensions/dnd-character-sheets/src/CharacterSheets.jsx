// @ts-nocheck
import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useMemo, useState} from 'preact/hooks';

const GRAPHQL_ENDPOINT = 'shopify://customer-account/api/2026-01/graphql.json';
const METAFIELD_NAMESPACE = '$app:dnd_character_sheets';
const METAFIELD_KEY = 'character_sheets';
const DEFAULT_ABILITY_SCORE = 10;

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const ABILITY_LABELS = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const SAVE_DEFINITIONS = [
  {key: 'fortitude', label: 'Fortitude', ability: 'con'},
  {key: 'reflex', label: 'Reflex', ability: 'dex'},
  {key: 'will', label: 'Will', ability: 'wis'},
];

const SKILL_DEFINITIONS = [
  {key: 'appraise', label: 'Appraise', ability: 'int'},
  {key: 'balance', label: 'Balance', ability: 'dex'},
  {key: 'bluff', label: 'Bluff', ability: 'cha'},
  {key: 'climb', label: 'Climb', ability: 'str'},
  {key: 'concentration', label: 'Concentration', ability: 'con'},
  {key: 'craft', label: 'Craft', ability: 'int'},
  {key: 'decipherScript', label: 'Decipher Script', ability: 'int'},
  {key: 'diplomacy', label: 'Diplomacy', ability: 'cha'},
  {key: 'disableDevice', label: 'Disable Device', ability: 'int'},
  {key: 'disguise', label: 'Disguise', ability: 'cha'},
  {key: 'escapeArtist', label: 'Escape Artist', ability: 'dex'},
  {key: 'forgery', label: 'Forgery', ability: 'int'},
  {key: 'gatherInformation', label: 'Gather Information', ability: 'cha'},
  {key: 'handleAnimal', label: 'Handle Animal', ability: 'cha'},
  {key: 'heal', label: 'Heal', ability: 'wis'},
  {key: 'hide', label: 'Hide', ability: 'dex'},
  {key: 'intimidate', label: 'Intimidate', ability: 'cha'},
  {key: 'jump', label: 'Jump', ability: 'str'},
  {key: 'knowledgeArcana', label: 'Knowledge (Arcana)', ability: 'int'},
  {key: 'knowledgeArchitecture', label: 'Knowledge (Architecture)', ability: 'int'},
  {key: 'knowledgeDungeoneering', label: 'Knowledge (Dungeoneering)', ability: 'int'},
  {key: 'knowledgeGeography', label: 'Knowledge (Geography)', ability: 'int'},
  {key: 'knowledgeHistory', label: 'Knowledge (History)', ability: 'int'},
  {key: 'knowledgeLocal', label: 'Knowledge (Local)', ability: 'int'},
  {key: 'knowledgeNature', label: 'Knowledge (Nature)', ability: 'int'},
  {key: 'knowledgeNobility', label: 'Knowledge (Nobility)', ability: 'int'},
  {key: 'knowledgeReligion', label: 'Knowledge (Religion)', ability: 'int'},
  {key: 'listen', label: 'Listen', ability: 'wis'},
  {key: 'moveSilently', label: 'Move Silently', ability: 'dex'},
  {key: 'openLock', label: 'Open Lock', ability: 'dex'},
  {key: 'perform', label: 'Perform', ability: 'cha'},
  {key: 'profession', label: 'Profession', ability: 'wis'},
  {key: 'ride', label: 'Ride', ability: 'dex'},
  {key: 'search', label: 'Search', ability: 'int'},
  {key: 'senseMotive', label: 'Sense Motive', ability: 'wis'},
  {key: 'sleightOfHand', label: 'Sleight of Hand', ability: 'dex'},
  {key: 'spellcraft', label: 'Spellcraft', ability: 'int'},
  {key: 'spot', label: 'Spot', ability: 'wis'},
  {key: 'survival', label: 'Survival', ability: 'wis'},
  {key: 'swim', label: 'Swim', ability: 'str'},
  {key: 'tumble', label: 'Tumble', ability: 'dex'},
  {key: 'useMagicDevice', label: 'Use Magic Device', ability: 'cha'},
  {key: 'useRope', label: 'Use Rope', ability: 'dex'},
];

function createDefaultSavingThrows() {
  return {
    fortitudeBase: 0,
    fortitudeMisc: 0,
    reflexBase: 0,
    reflexMisc: 0,
    willBase: 0,
    willMisc: 0,
  };
}

function createDefaultSkills() {
  return Object.fromEntries(
    SKILL_DEFINITIONS.map(({key}) => [key, {ranks: 0, misc: 0}])
  );
}

function createEmptyCharacter(name = 'New Character') {
  return {
    id: crypto.randomUUID(),
    name,
    playerName: '',
    race: '',
    className: '',
    level: 1,
    alignment: '',
    size: 'Medium',
    background: '',
    deity: '',
    experience: 0,
    age: '',
    gender: '',
    height: '',
    weight: '',
    eyes: '',
    hair: '',
    homeland: '',
    languages: '',
    abilities: {
      str: DEFAULT_ABILITY_SCORE,
      dex: DEFAULT_ABILITY_SCORE,
      con: DEFAULT_ABILITY_SCORE,
      int: DEFAULT_ABILITY_SCORE,
      wis: DEFAULT_ABILITY_SCORE,
      cha: DEFAULT_ABILITY_SCORE,
    },
    combat: {
      currentHitPoints: 0,
      maxHitPoints: 0,
      temporaryHitPoints: 0,
      armorClass: 10,
      touchArmorClass: 10,
      flatFootedArmorClass: 10,
      initiative: 0,
      speed: 30,
      baseAttackBonus: 0,
      grapple: 0,
      spellResistance: 0,
      damageReduction: 0,
    },
    savingThrows: createDefaultSavingThrows(),
    attacks: {
      melee: '',
      ranged: '',
      special: '',
    },
    skills: createDefaultSkills(),
    spellcasting: {
      castingClass: '',
      casterLevel: 0,
      saveDcBonus: 0,
      preparedSpells: '',
      spellNotes: '',
    },
    equipment: {
      armor: '',
      shield: '',
      weapons: '',
      gear: '',
      coins: '',
    },
    feats: '',
    specialAbilities: '',
    notes: '',
    updatedAt: new Date().toISOString(),
  };
}

function createDefaultCollection() {
  const firstCharacter = createEmptyCharacter('Valiant Initiate');

  return {
    customerId: null,
    activeCharacterId: firstCharacter.id,
    characters: [firstCharacter],
  };
}

export default async () => {
  const initialData = await loadInitialData();
  render(<CharacterSheets initialData={initialData} />, document.body);
};

function CharacterSheets({initialData}) {
  const [collection, setCollection] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(initialData.loadError || {tone: 'info', text: ''});

  const activeCharacter = useMemo(
    () =>
      collection.characters.find((character) => character.id === collection.activeCharacterId) ||
      collection.characters[0],
    [collection]
  );

  function setActiveCharacter(characterId) {
    setCollection((previous) => ({
      ...previous,
      activeCharacterId: characterId,
    }));
  }

  function updateCharacter(mutator) {
    setCollection((previous) => ({
      ...previous,
      characters: previous.characters.map((character) =>
        character.id === previous.activeCharacterId ? mutator(character) : character
      ),
    }));
  }

  function updateField(field, value) {
    updateCharacter((character) => ({
      ...character,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  }

  function updateNestedField(section, field, value) {
    updateCharacter((character) => ({
      ...character,
      [section]: {
        ...character[section],
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  }

  function updateAbility(ability, value) {
    const numericValue = clampInteger(value, 1, 99, DEFAULT_ABILITY_SCORE);

    updateCharacter((character) => ({
      ...character,
      abilities: {
        ...character.abilities,
        [ability]: numericValue,
      },
      updatedAt: new Date().toISOString(),
    }));
  }

  function updateCombat(field, value, fallback = 0) {
    updateNestedField('combat', field, clampInteger(value, -999, 9999, fallback));
  }

  function updateSavingThrow(save, field, value) {
    updateNestedField('savingThrows', `${save}${field}`, clampInteger(value, -99, 99, 0));
  }

  function updateSkill(skill, field, value) {
    updateCharacter((character) => ({
      ...character,
      skills: {
        ...character.skills,
        [skill]: {
          ...character.skills[skill],
          [field]: clampInteger(value, -99, 99, 0),
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  }

  function addCharacter() {
    const newCharacter = createEmptyCharacter(`Character ${collection.characters.length + 1}`);
    setCollection((previous) => ({
      ...previous,
      activeCharacterId: newCharacter.id,
      characters: [...previous.characters, newCharacter],
    }));
    setMessage({tone: 'info', text: 'New character ready to edit.'});
  }

  function duplicateCharacter() {
    const duplicated = {
      ...activeCharacter,
      id: crypto.randomUUID(),
      name: `${activeCharacter.name || 'Unnamed Character'} Copy`,
      updatedAt: new Date().toISOString(),
    };

    setCollection((previous) => ({
      ...previous,
      activeCharacterId: duplicated.id,
      characters: [...previous.characters, duplicated],
    }));
    setMessage({tone: 'info', text: 'Character duplicated.'});
  }

  function deleteCharacter() {
    if (collection.characters.length === 1) {
      setCollection((previous) => {
        const resetCharacter = createEmptyCharacter('Valiant Initiate');
        return {
          ...previous,
          activeCharacterId: resetCharacter.id,
          characters: [resetCharacter],
        };
      });
      setMessage({tone: 'warning', text: 'Last character replaced with a blank sheet.'});
      return;
    }

    setCollection((previous) => {
      const remainingCharacters = previous.characters.filter(
        (character) => character.id !== previous.activeCharacterId
      );

      return {
        ...previous,
        activeCharacterId: remainingCharacters[0].id,
        characters: remainingCharacters,
      };
    });
    setMessage({tone: 'warning', text: 'Character removed from your collection.'});
  }

  async function handleSave() {
    setSaving(true);
    setMessage({tone: 'info', text: ''});

    try {
      const normalizedCollection = {
        ...collection,
        characters: collection.characters.map((character) => normalizeCharacter(character)),
      };

      await saveCharacterCollection(normalizedCollection);
      setCollection(normalizedCollection);
      setMessage({tone: 'success', text: 'Character sheets saved.'});
      await shopify.toast.show('Sheets saved');
    } catch (error) {
      console.error(error);
      setMessage({tone: 'critical', text: error.message || 'Could not save character sheets.'});
    } finally {
      setSaving(false);
    }
  }

  return (
    <s-page heading="D&D 3.5 Character Sheets">
      <s-section heading="Character summary">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-stack direction="block" gap="small">
            <s-text>{activeCharacter.name || 'Unnamed Character'}</s-text>
            <s-text>{activeCharacter.race || 'Race'} {activeCharacter.className || 'Class'} {activeCharacter.level || 1}</s-text>
          </s-stack>
          <s-stack direction="block" gap="small">
            <s-badge tone="info">HP {activeCharacter.combat.currentHitPoints}/{activeCharacter.combat.maxHitPoints}</s-badge>
            <s-badge tone="info">AC {activeCharacter.combat.armorClass}</s-badge>
          </s-stack>
          <s-stack direction="block" gap="small">
            <s-badge tone="info">Init {formatModifier(activeCharacter.combat.initiative)}</s-badge>
            <s-badge tone="info">BAB {formatModifier(activeCharacter.combat.baseAttackBonus)}</s-badge>
          </s-stack>
        </s-grid>
      </s-section>

      <s-section heading="Collection">
        <s-stack direction="block" gap="base">
          <s-text>
            Customers can keep multiple 3.5e characters on their Shopify account and reopen them from the profile page.
          </s-text>

          {message.text ? <s-banner tone={message.tone}>{message.text}</s-banner> : null}

          <s-stack direction="inline" gap="small">
            <s-button variant="secondary" onClick={addCharacter}>New character</s-button>
            <s-button variant="secondary" onClick={duplicateCharacter}>Duplicate</s-button>
            <s-button variant="secondary" tone="critical" onClick={deleteCharacter}>Delete</s-button>
            <s-button variant="primary" loading={saving} disabled={saving} onClick={handleSave}>
              Save all sheets
            </s-button>
          </s-stack>

          <s-select
            label="Active character"
            value={activeCharacter.id}
            onChange={(event) => setActiveCharacter(event.currentTarget.value)}
          >
            {collection.characters.map((character) => (
              <s-option key={character.id} value={character.id}>
                {character.name || 'Unnamed Character'}
              </s-option>
            ))}
          </s-select>
        </s-stack>
      </s-section>

      <s-section heading="Identity">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-text-field
            label="Character name"
            value={activeCharacter.name}
            onInput={(event) => updateField('name', event.currentTarget.value)}
          />
          <s-text-field
            label="Player"
            value={activeCharacter.playerName}
            onInput={(event) => updateField('playerName', event.currentTarget.value)}
          />
          <s-text-field
            label="Class"
            value={activeCharacter.className}
            onInput={(event) => updateField('className', event.currentTarget.value)}
          />
          <s-text-field
            label="Race"
            value={activeCharacter.race}
            onInput={(event) => updateField('race', event.currentTarget.value)}
          />
          <s-text-field
            label="Level"
            type="number"
            value={String(activeCharacter.level)}
            onInput={(event) => updateField('level', clampInteger(event.currentTarget.value, 1, 20, 1))}
          />
          <s-text-field
            label="Alignment"
            value={activeCharacter.alignment}
            onInput={(event) => updateField('alignment', event.currentTarget.value)}
          />
          <s-text-field
            label="Size"
            value={activeCharacter.size}
            onInput={(event) => updateField('size', event.currentTarget.value)}
          />
          <s-text-field
            label="Background"
            value={activeCharacter.background}
            onInput={(event) => updateField('background', event.currentTarget.value)}
          />
          <s-text-field
            label="Deity"
            value={activeCharacter.deity}
            onInput={(event) => updateField('deity', event.currentTarget.value)}
          />
          <s-text-field
            label="Experience"
            type="number"
            value={String(activeCharacter.experience)}
            onInput={(event) => updateField('experience', clampInteger(event.currentTarget.value, 0, 9999999, 0))}
          />
          <s-text-field
            label="Languages"
            value={activeCharacter.languages}
            onInput={(event) => updateField('languages', event.currentTarget.value)}
          />
          <s-text-field
            label="Homeland"
            value={activeCharacter.homeland}
            onInput={(event) => updateField('homeland', event.currentTarget.value)}
          />
        </s-grid>
      </s-section>

      <s-section heading="Physical details">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-text-field
            label="Age"
            value={activeCharacter.age}
            onInput={(event) => updateField('age', event.currentTarget.value)}
          />
          <s-text-field
            label="Gender"
            value={activeCharacter.gender}
            onInput={(event) => updateField('gender', event.currentTarget.value)}
          />
          <s-text-field
            label="Height"
            value={activeCharacter.height}
            onInput={(event) => updateField('height', event.currentTarget.value)}
          />
          <s-text-field
            label="Weight"
            value={activeCharacter.weight}
            onInput={(event) => updateField('weight', event.currentTarget.value)}
          />
          <s-text-field
            label="Eyes"
            value={activeCharacter.eyes}
            onInput={(event) => updateField('eyes', event.currentTarget.value)}
          />
          <s-text-field
            label="Hair"
            value={activeCharacter.hair}
            onInput={(event) => updateField('hair', event.currentTarget.value)}
          />
        </s-grid>
      </s-section>

      <s-section heading="Abilities">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          {ABILITY_KEYS.map((ability) => (
            <s-stack key={ability} direction="block" gap="small">
              <s-text-field
                label={ABILITY_LABELS[ability]}
                type="number"
                value={String(activeCharacter.abilities[ability])}
                onInput={(event) => updateAbility(ability, event.currentTarget.value)}
              />
              <s-badge tone="info">Modifier {formatModifier(getAbilityModifier(activeCharacter.abilities[ability]))}</s-badge>
            </s-stack>
          ))}
        </s-grid>
      </s-section>

      <s-section heading="Combat and defenses">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-text-field
            label="Current hit points"
            type="number"
            value={String(activeCharacter.combat.currentHitPoints)}
            onInput={(event) => updateCombat('currentHitPoints', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Max hit points"
            type="number"
            value={String(activeCharacter.combat.maxHitPoints)}
            onInput={(event) => updateCombat('maxHitPoints', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Temporary hit points"
            type="number"
            value={String(activeCharacter.combat.temporaryHitPoints)}
            onInput={(event) => updateCombat('temporaryHitPoints', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Armor class"
            type="number"
            value={String(activeCharacter.combat.armorClass)}
            onInput={(event) => updateCombat('armorClass', event.currentTarget.value, 10)}
          />
          <s-text-field
            label="Touch AC"
            type="number"
            value={String(activeCharacter.combat.touchArmorClass)}
            onInput={(event) => updateCombat('touchArmorClass', event.currentTarget.value, 10)}
          />
          <s-text-field
            label="Flat-footed AC"
            type="number"
            value={String(activeCharacter.combat.flatFootedArmorClass)}
            onInput={(event) => updateCombat('flatFootedArmorClass', event.currentTarget.value, 10)}
          />
          <s-text-field
            label="Initiative"
            type="number"
            value={String(activeCharacter.combat.initiative)}
            onInput={(event) => updateCombat('initiative', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Speed"
            type="number"
            value={String(activeCharacter.combat.speed)}
            onInput={(event) => updateCombat('speed', event.currentTarget.value, 30)}
          />
          <s-text-field
            label="Base attack bonus"
            type="number"
            value={String(activeCharacter.combat.baseAttackBonus)}
            onInput={(event) => updateCombat('baseAttackBonus', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Grapple"
            type="number"
            value={String(activeCharacter.combat.grapple)}
            onInput={(event) => updateCombat('grapple', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Spell resistance"
            type="number"
            value={String(activeCharacter.combat.spellResistance)}
            onInput={(event) => updateCombat('spellResistance', event.currentTarget.value, 0)}
          />
          <s-text-field
            label="Damage reduction"
            type="number"
            value={String(activeCharacter.combat.damageReduction)}
            onInput={(event) => updateCombat('damageReduction', event.currentTarget.value, 0)}
          />
        </s-grid>
      </s-section>

      <s-section heading="Saving throws">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          {SAVE_DEFINITIONS.map((save) => (
            <s-stack key={save.key} direction="block" gap="small">
              <s-text>{save.label}</s-text>
              <s-badge tone="info">Total {formatModifier(getSavingThrowTotal(activeCharacter, save.key, save.ability))}</s-badge>
              <s-text-field
                label="Base"
                type="number"
                value={String(activeCharacter.savingThrows[`${save.key}Base`])}
                onInput={(event) => updateSavingThrow(save.key, 'Base', event.currentTarget.value)}
              />
              <s-text-field
                label="Misc"
                type="number"
                value={String(activeCharacter.savingThrows[`${save.key}Misc`])}
                onInput={(event) => updateSavingThrow(save.key, 'Misc', event.currentTarget.value)}
              />
            </s-stack>
          ))}
        </s-grid>
      </s-section>

      <s-section heading="Attacks">
        <s-grid gridTemplateColumns="1fr" gap="base">
          <s-text-area
            label="Melee attacks"
            value={activeCharacter.attacks.melee}
            rows={3}
            onInput={(event) => updateNestedField('attacks', 'melee', event.currentTarget.value)}
          />
          <s-text-area
            label="Ranged attacks"
            value={activeCharacter.attacks.ranged}
            rows={3}
            onInput={(event) => updateNestedField('attacks', 'ranged', event.currentTarget.value)}
          />
          <s-text-area
            label="Special attacks"
            value={activeCharacter.attacks.special}
            rows={3}
            onInput={(event) => updateNestedField('attacks', 'special', event.currentTarget.value)}
          />
        </s-grid>
      </s-section>

      <s-section heading="Skills">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          {SKILL_DEFINITIONS.map((skill) => (
            <s-stack key={skill.key} direction="block" gap="small">
              <s-text>{skill.label} ({skill.ability.toUpperCase()})</s-text>
              <s-badge tone="info">Total {formatModifier(getSkillTotal(activeCharacter, skill.key, skill.ability))}</s-badge>
              <s-stack direction="inline" gap="small">
                <s-text-field
                  label="Ranks"
                  type="number"
                  value={String(activeCharacter.skills[skill.key].ranks)}
                  onInput={(event) => updateSkill(skill.key, 'ranks', event.currentTarget.value)}
                />
                <s-text-field
                  label="Misc"
                  type="number"
                  value={String(activeCharacter.skills[skill.key].misc)}
                  onInput={(event) => updateSkill(skill.key, 'misc', event.currentTarget.value)}
                />
              </s-stack>
            </s-stack>
          ))}
        </s-grid>
      </s-section>

      <s-section heading="Spellcasting">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-text-field
            label="Casting class"
            value={activeCharacter.spellcasting.castingClass}
            onInput={(event) => updateNestedField('spellcasting', 'castingClass', event.currentTarget.value)}
          />
          <s-text-field
            label="Caster level"
            type="number"
            value={String(activeCharacter.spellcasting.casterLevel)}
            onInput={(event) => updateNestedField('spellcasting', 'casterLevel', clampInteger(event.currentTarget.value, 0, 40, 0))}
          />
          <s-text-field
            label="Spell save DC bonus"
            type="number"
            value={String(activeCharacter.spellcasting.saveDcBonus)}
            onInput={(event) => updateNestedField('spellcasting', 'saveDcBonus', clampInteger(event.currentTarget.value, -20, 99, 0))}
          />
        </s-grid>
        <s-text-area
          label="Prepared spells / spells known"
          value={activeCharacter.spellcasting.preparedSpells}
          rows={6}
          onInput={(event) => updateNestedField('spellcasting', 'preparedSpells', event.currentTarget.value)}
        />
        <s-text-area
          label="Spell notes"
          value={activeCharacter.spellcasting.spellNotes}
          rows={4}
          onInput={(event) => updateNestedField('spellcasting', 'spellNotes', event.currentTarget.value)}
        />
      </s-section>

      <s-section heading="Equipment and wealth">
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <s-text-area
            label="Armor"
            value={activeCharacter.equipment.armor}
            rows={3}
            onInput={(event) => updateNestedField('equipment', 'armor', event.currentTarget.value)}
          />
          <s-text-area
            label="Shield"
            value={activeCharacter.equipment.shield}
            rows={3}
            onInput={(event) => updateNestedField('equipment', 'shield', event.currentTarget.value)}
          />
          <s-text-area
            label="Weapons"
            value={activeCharacter.equipment.weapons}
            rows={4}
            onInput={(event) => updateNestedField('equipment', 'weapons', event.currentTarget.value)}
          />
          <s-text-area
            label="Gear"
            value={activeCharacter.equipment.gear}
            rows={4}
            onInput={(event) => updateNestedField('equipment', 'gear', event.currentTarget.value)}
          />
          <s-text-field
            label="Coins and valuables"
            value={activeCharacter.equipment.coins}
            onInput={(event) => updateNestedField('equipment', 'coins', event.currentTarget.value)}
          />
        </s-grid>
      </s-section>

      <s-section heading="Feats and special abilities">
        <s-text-area
          label="Feats"
          value={activeCharacter.feats}
          rows={5}
          onInput={(event) => updateField('feats', event.currentTarget.value)}
        />
        <s-text-area
          label="Special abilities, class features, companions, or traits"
          value={activeCharacter.specialAbilities}
          rows={5}
          onInput={(event) => updateField('specialAbilities', event.currentTarget.value)}
        />
      </s-section>

      <s-section heading="Notes">
        <s-text-area
          label="Campaign notes, feats, spells, equipment, and reminders"
          value={activeCharacter.notes}
          rows={8}
          onInput={(event) => updateField('notes', event.currentTarget.value)}
        />
      </s-section>
    </s-page>
  );
}

async function loadCharacterCollection() {
  const result = await customerAccountGraphQL({
    query: `query GetCharacterSheets($key: String!, $namespace: String!) {
      customer {
        id
        metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }`,
    variables: {
      key: METAFIELD_KEY,
      namespace: METAFIELD_NAMESPACE,
    },
  });

  const customerId = result.data?.customer?.id || null;
  const rawValue = result.data?.customer?.metafield?.value;
  const fallback = createDefaultCollection();

  if (!rawValue) {
    return {
      ...fallback,
      customerId,
    };
  }

  try {
    const parsed = JSON.parse(rawValue);
    const characters = Array.isArray(parsed.characters)
      ? parsed.characters.map((character) => normalizeCharacter(character))
      : [];

    if (characters.length === 0) {
      return {
        ...fallback,
        customerId,
      };
    }

    const activeCharacterId = characters.some((character) => character.id === parsed.activeCharacterId)
      ? parsed.activeCharacterId
      : characters[0].id;

    return {
      customerId,
      activeCharacterId,
      characters,
    };
  } catch (error) {
    console.error('Failed to parse character collection', error);
    return {
      ...fallback,
      customerId,
    };
  }
}

async function saveCharacterCollection(collection) {
  if (!collection.customerId) {
    throw new Error('No authenticated customer record was available for this page.');
  }

  const response = await customerAccountGraphQL({
    query: `mutation SaveCharacterSheets($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      metafields: [
        {
          key: METAFIELD_KEY,
          namespace: METAFIELD_NAMESPACE,
          type: 'json',
          ownerId: collection.customerId,
          value: JSON.stringify({
            activeCharacterId: collection.activeCharacterId,
            characters: collection.characters,
          }),
        },
      ],
    },
  });

  const userErrors = response.data?.metafieldsSet?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(userErrors.map(({message}) => message).join('; '));
  }

  return response.data?.metafieldsSet?.metafields?.[0] ?? null;
}

async function customerAccountGraphQL({query, variables}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });

  const json = await response.json();
  if (!response.ok || (json.errors && json.errors.length > 0)) {
    throw new Error(
      json.errors?.map(({message}) => message).join('; ') || 'Customer account request failed.'
    );
  }

  return json;
}

function normalizeCharacter(character) {
  const baseCharacter = createEmptyCharacter(character?.name || 'Unnamed Character');
  const combat = character?.combat || {};

  return {
    ...baseCharacter,
    ...character,
    className: character?.className ?? character?.class ?? baseCharacter.className,
    level: clampInteger(character?.level, 1, 20, 1),
    experience: clampInteger(character?.experience, 0, 9999999, 0),
    abilities: {
      ...baseCharacter.abilities,
      ...normalizeNumericRecord(character?.abilities, 1, 99, DEFAULT_ABILITY_SCORE),
    },
    combat: {
      ...baseCharacter.combat,
      ...normalizeNumericRecord(combat, -999, 9999, 0, {
        armorClass: 10,
        touchArmorClass: 10,
        flatFootedArmorClass: 10,
        speed: 30,
      }),
      currentHitPoints: clampInteger(combat.currentHitPoints ?? combat.hitPoints, -999, 9999, 0),
      maxHitPoints: clampInteger(combat.maxHitPoints ?? combat.hitPoints, -999, 9999, 0),
      temporaryHitPoints: clampInteger(combat.temporaryHitPoints, -999, 9999, 0),
      grapple: clampInteger(combat.grapple, -999, 9999, 0),
      damageReduction: clampInteger(combat.damageReduction, -999, 9999, 0),
    },
    savingThrows: normalizeSavingThrows(character?.savingThrows),
    attacks: {
      ...baseCharacter.attacks,
      ...character?.attacks,
    },
    skills: normalizeSkills(character?.skills),
    spellcasting: normalizeSpellcasting(character?.spellcasting),
    equipment: normalizeEquipment(character?.equipment),
    updatedAt: character?.updatedAt || new Date().toISOString(),
  };
}

function normalizeSavingThrows(record) {
  return {
    fortitudeBase: clampInteger(record?.fortitudeBase ?? record?.fortitude, -99, 99, 0),
    fortitudeMisc: clampInteger(record?.fortitudeMisc, -99, 99, 0),
    reflexBase: clampInteger(record?.reflexBase ?? record?.reflex, -99, 99, 0),
    reflexMisc: clampInteger(record?.reflexMisc, -99, 99, 0),
    willBase: clampInteger(record?.willBase ?? record?.will, -99, 99, 0),
    willMisc: clampInteger(record?.willMisc, -99, 99, 0),
  };
}

function normalizeSkills(record) {
  const fallback = createDefaultSkills();

  return Object.fromEntries(
    SKILL_DEFINITIONS.map(({key}) => [
      key,
      {
        ranks: clampInteger(record?.[key]?.ranks, -99, 99, fallback[key].ranks),
        misc: clampInteger(record?.[key]?.misc, -99, 99, fallback[key].misc),
      },
    ])
  );
}

function normalizeSpellcasting(record) {
  return {
    castingClass: record?.castingClass ?? '',
    casterLevel: clampInteger(record?.casterLevel, 0, 40, 0),
    saveDcBonus: clampInteger(record?.saveDcBonus, -20, 99, 0),
    preparedSpells: record?.preparedSpells ?? '',
    spellNotes: record?.spellNotes ?? '',
  };
}

function normalizeEquipment(record) {
  return {
    armor: record?.armor ?? '',
    shield: record?.shield ?? '',
    weapons: record?.weapons ?? '',
    gear: record?.gear ?? '',
    coins: record?.coins ?? '',
  };
}

function normalizeNumericRecord(record, min, max, fallback, overrides = {}) {
  if (!record) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, clampInteger(value, min, max, overrides[key] ?? fallback)])
  );
}

function clampInteger(value, min, max, fallback) {
  const numericValue = Number.parseInt(value, 10);
  if (Number.isNaN(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numericValue));
}

function getAbilityModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function getSavingThrowTotal(character, save, ability) {
  return (
    clampInteger(character?.savingThrows?.[`${save}Base`], -99, 99, 0) +
    clampInteger(character?.savingThrows?.[`${save}Misc`], -99, 99, 0) +
    getAbilityModifier(character?.abilities?.[ability] ?? DEFAULT_ABILITY_SCORE)
  );
}

function getSkillTotal(character, skill, ability) {
  return (
    clampInteger(character?.skills?.[skill]?.ranks, -99, 99, 0) +
    clampInteger(character?.skills?.[skill]?.misc, -99, 99, 0) +
    getAbilityModifier(character?.abilities?.[ability] ?? DEFAULT_ABILITY_SCORE)
  );
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

async function loadInitialData() {
  try {
    const collection = await loadCharacterCollection();
    return {
      ...collection,
      loadError: null,
    };
  } catch (error) {
    console.error('Failed to load character sheets', error);

    return {
      ...createDefaultCollection(),
      loadError: {
        tone: 'critical',
        text: error.message || 'Could not load character sheets for this customer account.',
      },
    };
  }
}