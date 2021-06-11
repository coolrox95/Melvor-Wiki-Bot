// Grabs variables required and places them into a global object
window.wikiData = undefined;
const melvorWikiLoader = setInterval(() => {
  if (isLoaded) {
    clearInterval(melvorWikiLoader);
    // eslint-disable-next-line no-unused-vars
    window.wikiData = {
      items,
      MONSTERS,
      DUNGEONS,
      combatAreas,
      SPELLS,
      cookingFireData,
      thievingNPC,
      trees,
      skillcapeItems,
      CONSTANTS,
      numberMultiplier,
      miningData,
      smithingItems,
      runecraftingItems,
      gloveID,
      baseMiningInterval,
      runecraftInterval,
      logsData,
      PRAYER,
      herbloreItemData,
      skillName,
      newFarmingAreas,
      autoEatData,
      slayerAreas,
      smithInterval,
      fletchInterval,
      craftInterval,
      herbloreInterval,
      fishingAreas,
      fishingItems,
      junkItems,
      specialItems,
      enemySpecialAttacks,
      playerSpecialAttacks,
      godDungeonID,
      godUpgradeData,
      glovesActions,
      CURSES,
      AURORAS,
      ANCIENT,
      ALTMAGIC,
      PETS,
      magicInterval,
    };
    console.log('Melvor Wiki Data Loaded');
  }
}, 200);

