// Grabs variables required and places them into a global object
window.wikiData = undefined;
const melvorWikiLoader = setInterval(() => {
  if (isLoaded) {
    clearInterval(melvorWikiLoader);
    // eslint-disable-next-line no-unused-vars
    window.wikiData = {
      items: items,
      MONSTERS: MONSTERS,
      DUNGEONS: DUNGEONS,
      combatAreas: combatAreas,
      SPELLS: SPELLS,
      tiers: tiers,
      cookingFireData: cookingFireData,
      thievingNPC: thievingNPC,
      trees: trees,
      skillcapeItems: skillcapeItems,
      CONSTANTS: CONSTANTS,
      numberMultiplier: numberMultiplier,
      miningData: miningData,
      smithingItems: smithingItems,
      runecraftingItems: runecraftingItems,
      axeLevels: axeLevels,
      rodLevels: rodLevels,
      pickaxeLevels: pickaxeLevels,
      gloveID: gloveID,
      skillcapeItems: skillcapeItems,
      baseMiningInterval: baseMiningInterval,
      axeCost: axeCost,
      rodCost: rodCost,
      pickaxeCost: pickaxeCost,
      glovesCost: glovesCost,
      runecraftInterval: runecraftInterval,
      axeBonusSpeed: axeBonusSpeed,
      rodBonusSpeed: rodBonusSpeed,
      pickaxeBonus: pickaxeBonus,
      pickaxeBonusSpeed: pickaxeBonusSpeed,
      logsData: logsData,
      PRAYER: PRAYER,
      slayerItems: slayerItems,
      herbloreItemData: herbloreItemData,
      skillName: skillName,
      newFarmingAreas: newFarmingAreas,
      autoEatData: autoEatData,
      slayerAreas: slayerAreas,
      smithInterval: smithInterval,
      fletchInterval: fletchInterval,
      craftInterval: craftInterval,
      herbloreInterval: herbloreInterval,
      fishingAreas: fishingAreas,
      fishingItems: fishingItems,
      junkItems: junkItems,
      specialItems: specialItems,
      enemySpecialAttacks: enemySpecialAttacks,
      playerSpecialAttacks: playerSpecialAttacks,
      godDungeonID: godDungeonID,
      godUpgradeData: godUpgradeData,
      glovesActions: glovesActions,
    };
    console.log('Melvor Wiki Data Loaded');
    return;
  } else {
    return;
  }
}, 200);

