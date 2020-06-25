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
      tiers,
      cookingFireData,
      thievingNPC,
      trees,
      skillcapeItems,
      CONSTANTS,
      numberMultiplier,
      miningData,
      smithingItems,
      runecraftingItems,
      axeLevels,
      rodLevels,
      pickaxeLevels,
      gloveID,
      baseMiningInterval,
      axeCost,
      rodCost,
      pickaxeCost,
      glovesCost,
      runecraftInterval,
      axeBonusSpeed,
      rodBonusSpeed,
      pickaxeBonus,
      pickaxeBonusSpeed,
      logsData,
      PRAYER,
      slayerItems,
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
    };
    console.log('Melvor Wiki Data Loaded');
  }
}, 200);

