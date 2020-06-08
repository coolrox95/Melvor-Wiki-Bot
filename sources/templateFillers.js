/// <reference path="bulkOperations.js" />
/// <reference path="commonElements.js" />
/// <reference path="keyFormatters.js" />
/// <reference path="main.js" />
/// <reference path="pageGenerators.js" />
/// <reference path="selectionFunctions.js" />
/// <reference path="sortFunctions.js" />
/// <reference path="tableMakers.js" />
/// <reference path="uiCallbacks.js" />
/// <reference path="wikiAPI.js" />

/**
 * @description Fills the monster template for a particular monster
 * @param {number} monsterID Index of MONSTERS array
 */
function fillMonsterTemplate(monsterID) {
    let template = '{{Monster';
    template += `|name=${MONSTERS[monsterID].name}`;
    template += `|monsterID=${monsterID}`;
    template += `|combatLevel=${getMonsterCombatLevel(monsterID)}`;
    template += `|hitpoints=${numberMultiplier * MONSTERS[monsterID].hitpoints}`;
    template += `|attackspeed=${(MONSTERS[monsterID].attackSpeed / 1000).toFixed(1)}`;
    template += `|attacks=${formatMonsterAttacks(monsterID)}`;
    template += `|accuracyRating=${getMonsterAccuracy(monsterID)}`;
    template += `|meleeEvasionRating=${getMonsterMeleeEvasion(monsterID)}`;
    template += `|rangedEvasionRating=${getMonsterRangedEvasion(monsterID)}`;
    template += `|magicEvasionRating=${getMonsterMagicEvasion(monsterID)}`;
    template += `|attackLevel=${MONSTERS[monsterID].attackLevel}`;
    template += `|strengthLevel=${MONSTERS[monsterID].strengthLevel}`;
    template += `|defenceLevel=${MONSTERS[monsterID].defenceLevel}`;
    template += `|rangedLevel=${MONSTERS[monsterID].rangedLevel}`;
    template += `|magicLevel=${MONSTERS[monsterID].magicLevel}`;
    template += `|zones=${formatArrayAsNewlines(getMonsterLocationArray(monsterID))}`;
    template += `|drops=${formatMonsterDrops(monsterID)}`;
    template += '}}';
    return template;
}

/**
 * @description Fills the armour stats template for an item
 * @param {number} itemID Index of items array
 */
function fillArmourStatsTemplate(itemID) {
    let statKeys = ['stabAttackBonus', 'slashAttackBonus', 'blockAttackBonus', 'rangedAttackBonus', 'magicAttackBonus', 'strengthBonus', 'rangedStrengthBonus', 'magicDamageBonus', 'defenceBonus', 'rangedDefenceBonus', 'magicDefenceBonus', 'damageReduction', 'defenceLevelRequired', 'rangedLevelRequired', 'magicLevelRequired'];
    let template = '{{ArmourStats';
    for (let i = 0; i < statKeys.length; i++) {
        let statValue = 0;
        if (statKeys[i] == 'stabAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[0] };
        } else if (statKeys[i] == 'slashAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[1] };
        } else if (statKeys[i] == 'blockAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[2] };
        } else {
            if (items[itemID][statKeys[i]]) { statValue = items[itemID][statKeys[i]] };
        }
        template += `|${statKeys[i]}=${statValue}`;
    }
    template += '}}';
    return template;
}

/**
 * @description Automatically fills in the weapon stats template for an item page
 * @param {number} itemID Index of items array
 */
function fillWeaponStatsTemplate(itemID) {
    let statKeys = ['attackSpeed', 'attackType', 'isTwoHanded', 'stabAttackBonus', 'slashAttackBonus', 'blockAttackBonus', 'rangedAttackBonus', 'magicAttackBonus', 'strengthBonus', 'rangedStrengthBonus', 'magicDamageBonus', 'defenceBonus', 'rangedDefenceBonus', 'magicDefenceBonus', 'damageReduction', 'attackLevelRequired', 'rangedLevelRequired', 'magicLevelRequired','specialAttack'];
    let template = '{{WeaponStats';
    for (let i = 0; i < statKeys.length; i++) {
        let statValue = 0;
        if (statKeys[i] == 'stabAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[0] };
        } else if (statKeys[i] == 'slashAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[1] };
        } else if (statKeys[i] == 'blockAttackBonus') {
            if (items[itemID].attackBonus) { statValue = items[itemID].attackBonus[2] };
        } else if (statKeys[i] == 'attackType') {
            if (items[itemID].type == "Ranged Weapon" || items[itemID].isRanged) {
                statValue = '[[File:Ranged (skill).svg|25px|middle|link=Ranged]] Ranged';
            } else if (items[itemID].isMagic) {
                statValue = '[[File:Magic (skill).svg|25px|middle|link=Magic]] Magic';
            } else {
                statValue = '[[File:Combat.svg|25px|middle]] Melee';
            }
        } else if (statKeys[i] == 'isTwoHanded') {
            statValue = (items[itemID].isTwoHanded ? 'Yes' : 'No');
        } else if (statKeys[i] == 'specialAttack') {
            if (items[itemID].hasSpecialAttack) {
                statValue =  playerSpecialAttacks[items[itemID].specialAttackID].name;
            } else {
                statValue = 'None';
            }
        } else {
            if (items[itemID][statKeys[i]]) { statValue = items[itemID][statKeys[i]] };
        }
        template += `|${statKeys[i]}=${statValue}`;
    }
    template += '}}';
    return template;
}

/**
 * @description Fills in the combat area template
 * @param {number} areaID Index of combatAreas
 */
function fillCombatAreaTemplate(areaID) {
    let template = '{{CombatArea';
    template += `|name=${combatAreas[areaID].areaName}`;
    template += `|id=${areaID}`;
    template += `|monsterList=${formatArrayAsNewlines(getMonsterArray(combatAreas[areaID]))}`;
    template += '}}';
    return template;
}

/**
 * @description Fills in the slayer Area template
 * @param {number} areaID Index of combatAreas
 */
function fillSlayerAreaTemplate(areaID) {
    let template = '{{SlayerArea';
    template += `|name=${slayerAreas[areaID].areaName}`;
    template += `|id=${areaID}`;
    template += `|slayerLevel=${(slayerAreas[areaID].slayerLevel != undefined) ? slayerAreas[areaID].slayerLevel : 1}`;
    template += `|slayerItem=${(slayerAreas[areaID].slayerItem != 0) ? `${formatItemIDAsImageLink(slayerAreas[areaID].slayerItem, 25, 'middle')} ${formatItemIDAsLink(slayerAreas[areaID].slayerItem)}` : 'None'}`;
    template += `|monsterList=${formatArrayAsNewlines(getMonsterArray(slayerAreas[areaID]))}`;
    template += '}}';
    return template;
}

/**
 * @description Fills in the combat area template
 * @param {number} dungeonID Index of combatAreas
 */
function fillDungeonTemplate(dungeonID) {
    let template = '{{Dungeon';
    template += `|name=${DUNGEONS[dungeonID].name}`;
    template += `|id=${dungeonID}`;
    template += `|rewards=${formatDungeonDrops(dungeonID)}`;
    template += `|monsterList=${formatArrayAsNewlines(getDungeonMonsterArray(DUNGEONS[dungeonID].condensedMonsters))}`;
    template += '}}';
    return template;
}

/**
 * @description Fills in the Spell template
 * @param {number} spellID Index of SPELLS
 */
function fillSpellTemplate(spellID) {
    let template = '{{Spell';
    template += `|name=${SPELLS[spellID].name}`;
    template += `|id=${spellID}`;
    template += `|level=${SPELLS[spellID].magicLevelRequired}`;
    template += `|maxHit=${SPELLS[spellID].maxHit}`;
    template += `|runeList=${formatArrayAsBulletList(getSpellRuneArray(spellID))}`;
    template += '}}';
    return template;
}

/**
 * @description Fills in the Prayer template
 * @param {number} prayerID Index of PRAYER
 */
function fillPrayerTemplate(prayerID) {
    let template = '{{Prayer';
    template += `|name=${PRAYER[prayerID].name}`;
    template += `|id=${prayerID}`;
    template += `|level=${PRAYER[prayerID].prayerLevel}`;
    template += `|prayerEffects=${formatArrayAsBulletList(getPrayerEffectArray(prayerID))}`;
    template += `|prayerCosts=${formatArrayAsNewlines(getPrayerCostArray(prayerID))}`;
    template += '}}';
    return template;
}

function fillAxeUpgradeTemplate(axeID) {
    let template = '{{Upgrade';
    template += `|name=${getAxeUpgradeName(axeID)}`;
    template += `|upgradeEffect=Reduces [[Woodcutting]] time by ${axeBonusSpeed[axeID]}%`;
    if (axeID <= 1) {
        template += `|upgradeRequirements=${formatSkillRequirement('Woodcutting',axeLevels[axeID])}`;
    } else {
        template += `|upgradeRequirements=${formatSkillRequirement('Woodcutting',axeLevels[axeID])}<br>Purchased ${formatAxeIDAsImageLink(axeID-1,25,'middle')} ${formatAxeIDAsLink(axeID-1)}`;
    }
    template += `|upgradeCost=${formatAsShopCost(axeCost[axeID])}`;
    template += '}}';
    return template;
}

function fillRodUpgradeTemplate(rodID) {
    let template = '{{Upgrade';
    template += `|name=${getRodUpgradeName(rodID)}`;
    template += `|upgradeEffect=Reduces [[Fishing]] time by ${rodBonusSpeed[rodID]}%`;
    if (rodID <= 1) {
        template += `|upgradeRequirements=${formatSkillRequirement('Fishing',rodLevels[rodID])}`;
    } else {
        template += `|upgradeRequirements=${formatSkillRequirement('Fishing',rodLevels[rodID])}<br>Purchased ${formatRodIDAsImageLink(rodID-1,25,'middle')} ${formatRodIDAsLink(rodID-1)}`;
    }
    template += `|upgradeCost=${formatAsShopCost(rodCost[rodID])}`;
    template += '}}';
    return template;
}

function fillPickUpgradeTemplate(pickID) {
    let template = '{{Upgrade';
    template += `|name=${getPickUpgradeName(pickID)}`;
    template += `|upgradeEffect=Reduces [[Mining]] time by ${pickaxeBonusSpeed[pickID]}%<br>Increases ore double chance by ${pickaxeBonus[pickID]}%`;
    if (pickID <= 1) {
        template += `|upgradeRequirements=${formatSkillRequirement('Mining',pickaxeLevels[pickID])}`;
    } else {
        template += `|upgradeRequirements=${formatSkillRequirement('Mining',pickaxeLevels[pickID])}<br>Purchased ${formatPickIDAsImageLink(pickID-1,25,'middle')} ${formatPickIDAsLink(pickID-1)}`;
    }
    template += `|upgradeCost=${formatAsShopCost(pickaxeCost[pickID])}`;
    template += '}}';
    return template;
}

function fillEatUpgradeTemplate(eatID) {
    let template = '{{Upgrade';
    template += `|name=${autoEatData[eatID].title}`;
    template += `|upgradeEffect=Automatically eats food to heal you to ${autoEatData[eatID].maxHP}% of your HP when you fall below ${autoEatData[eatID].eatAt}% HP<br>Food is eaten at ${autoEatData[eatID].efficiency}% efficiency.`;
    if (eatID <= 0) {
        template += `|upgradeRequirements=None`;
    } else {
        template += `|upgradeRequirements=Purchased ${formatEatIDAsImageLink(eatID-1,25,'middle')} ${formatEatIDAsLink(eatID-1)}`;
    }
    template += `|upgradeCost=${formatAsShopCost(autoEatData[eatID].cost)}`;
    template += '}}';
    return template;
}

function fillFireUpgradeTemplate(fireID) {
    let template = '{{Upgrade';
    template += `|name=${getFireUpgradeName(fireID)}`;
    template += `|upgradeEffect=Fires do not need to be lit to cook.<br>Increases [[Cooking]] experience by ${cookingFireData[fireID].bonusXP}%.`;
    if (fireID <= 0) {
        template += `|upgradeRequirements=${formatSkillRequirement('Firemaking',cookingFireData[fireID].fmLevel)}`;
    } else {
        template += `|upgradeRequirements=${formatSkillRequirement('Firemaking',cookingFireData[fireID].fmLevel)}<br>Purchased ${formatFireIDAsImageLink(fireID-1,25,'middle')} ${formatFireIDAsLink(fireID-1)}`;
    }
    template += `|upgradeCost=${`${formatItemIDAsImageLink(cookingFireData[fireID].costLogs[0],25,'middle')} ${cookingFireData[fireID].costLogs[1]}<br>${formatAsShopCost(cookingFireData[fireID].costGP)}`}`;
    template += '}}';
    return template;
}

function fillGodUpgradeTemplate(godID) {
    let template = '{{Upgrade';
    template += `|name=${godUpgradeData[godID].name}`;
    template += `|upgradeEffect=${godUpgradeDescriptions[godID]}`;
    template += `|upgradeRequirements=Complete: ${formatDungeonIDAsImageLink(godUpgradeData[godID].dungeonID,25,'middle')} ${formatDungeonIDAsLink(godUpgradeData[godID].dungeonID,25,'middle')} Once`;
    template += `|upgradeCost=${`${formatAsShopCost(godUpgradeData[godID].cost)}`}`;
    template += '}}';
    return template;
}

function fillItemProductionTemplateForWoodcutting(itemID) {
    let template = '{{ItemProduction';
    template += `|requirements=${formatSkillRequirement('Woodcutting',items[itemID].woodcuttingLevel)}`;
    template += `|quantity=${1}`;
    template += `|experience=${items[itemID].woodcuttingXP}`;
    template += `|creationTime=${(items[itemID].woodcuttingInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemProductionTemplateForFishing(itemID) {
    let template = '{{ItemProduction';
    template += `|requirements=${formatSkillRequirement('Fishing',items[itemID].fishingLevel)}`;
    template += `|quantity=${1}`;
    template += `|experience=${items[itemID].fishingXP}`;
    if (items[itemID].isJunk || items[itemID].isFishTreasure) {
        template += `|creationTime=Variable `;
    } else {
        template += `|creationTime=${(items[itemID].minFishingInterval/1000).toFixed(1)}-${(items[itemID].maxFishingInterval/1000).toFixed(1)}`;
    }
    template += '}}';
    return template
}
function fillItemProductionTemplateForMining(itemID) {
    let template = '{{ItemProduction';
    template += `|requirements=${formatSkillRequirement('Mining',items[itemID].miningLevel)}`;
    if (itemID ==  CONSTANTS.item.Dragonite_Ore) {
        template += `<br>${formatMasteryImageLink(25, 'middle')} 271 total [[Mining]] ${formatPageLink('Mastery')}`;
    }
    template += `|quantity=${items[itemID].miningQty}`;
    template += `|experience=${items[itemID].miningXP}`;
    template += `|creationTime=${(baseMiningInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForCooking(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Cooking',items[itemID].cookingLevel)}`;
    template += `|materials=${formatItemCreationCost(items[itemID].cookingReq)}`;
    template += `|quantity=${1}`;
    template += `|experience=${items[itemID].cookingXP}`;
    template += `|creationTime=${3.0}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForSmithing(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Smithing',items[itemID].smithingLevel)}`;
    template += `|materials=${formatItemCreationCost(items[itemID].smithReq)}`;
    template += `|quantity=${(items[itemID].smithingQty != undefined)?items[itemID].smithingQty:1}`;
    template += `|experience=${items[itemID].smithingXP}`;
    template += `|creationTime=${(smithInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForFarming(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Farming',items[itemID].farmingLevel)}`;
    template += `|materials=${formatItemCreationCost(items[itemID].farmingReq)}`;
    template += `|quantity=${5}`;
    template += `|experience=${items[itemID].farmingXP}`;
    template += `|creationTime=${items[itemID].growthTime}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForFletching(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Fletching',items[itemID].fletchingLevel)}`;
    if (itemID == CONSTANTS.item.Arrow_Shafts) {
        template += `|materials=${formatItemIDAsImageLink(0, 25, 'middle')} ${1} Any [[Log]]`;
        template += `|quantity=${items[itemID].fletchQty}-${items[itemID].fletchQty*9}`;
    } else {
        template += `|materials=${formatItemCreationCost(items[itemID].fletchReq)}`;
        template += `|quantity=${items[itemID].fletchQty}`;
    }
    template += `|experience=${items[itemID].fletchingXP}`;
    template += `|creationTime=${(fletchInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForCrafting(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Crafting',items[itemID].craftingLevel)}`;
    template += `|materials=${formatItemCreationCost(items[itemID].craftReq)}`;
    template += `|quantity=${items[itemID].craftQty}`;
    template += `|experience=${items[itemID].craftingXP}`;
    template += `|creationTime=${(craftInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForRunecrafting(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Runecrafting',items[itemID].runecraftingLevel)}`;
    template += `|materials=${formatItemCreationCost(items[itemID].runecraftReq)}`;
    template += `|quantity=${items[itemID].runecraftQty}`;
    template += `|experience=${items[itemID].runecraftingXP}`;
    template += `|creationTime=${(runecraftInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}
function fillItemCreationTemplateForHerblore(itemID) {
    let template = '{{ItemCreation';
    template += `|requirements=${formatSkillRequirement('Herblore',items[itemID].herbloreLevel)}`;
    switch (items[itemID].potionTier) {
        case 1:
            template += `<br>${formatMasteryImageLink(25, 'middle')} ${15} ${formatPageLink('Mastery')}`;
        break;
        case 2:
            template += `<br>${formatMasteryImageLink(25, 'middle')} ${40} ${formatPageLink('Mastery')}`;
        break;
        case 3:
            template += `<br>${formatMasteryImageLink(25, 'middle')} ${65} ${formatPageLink('Mastery')}`;
        break;
    }
    template += `|materials=${formatItemCreationCost(items[itemID].herbloreReq)}`;
    template += `|quantity=${1}`;
    template += `|experience=${items[itemID].herbloreXP}`;
    template += `|creationTime=${(herbloreInterval/1000).toFixed(1)}`;
    template += '}}';
    return template
}

function fillFishingSpecialTemplate(itemID) {
    let template = '{{FishingSpecial';
    template += `|requirements=${formatSkillRequirement('Fishing',1)}`;
    template += `|quantity=1`;
    template += `|chanceRatio=${items[itemID].specialWeight}/${specialItems.totalWeight}`;
    template += `|chancePercent=${(100*items[itemID].specialWeight/specialItems.totalWeight).toFixed(3)}`;
    template += '}}';
    return template
}

function fillFishingJunkTemplate(itemID) {
    let template = '{{FishingJunk';
    template += `|requirements=${formatSkillRequirement('Fishing',1)}`;
    template += `|quantity=1`;
    template += `|chanceRatio=${items[itemID].junkWeight}/${junkItems.length}`;
    template += `|chancePercent=${(100*items[itemID].junkWeight/junkItems.length).toFixed(2)}`;
    template += '}}';
    return template
}

function fillItemUpgradeTemplate(itemID) {
    let template = '{{ItemUpgrade';
    template += `|upgradesFrom=${formatArrayAsNewlines(getUpgradesFromArray(itemID))}`;
    template += `|materials=${formatItemTrimCost(itemID)}`;
    template += '}}';
    return template;
}

function fillItemTemplate(itemID) {
    let template = '{{Item';
    template += `|name=${items[itemID].name}`;
    let itemDescription = 'No Description';
    if (items[itemID].description != undefined) {
        itemDescription = items[itemID].description;
    }
    template += `|imagefile=${items[itemID].name} (item)${getFileExtension(items[itemID].media)}`;
    template += `|description=${itemDescription}`;
    template += `|id=${itemID}`;
    template += `|category=${items[itemID].category}`;
    template += `|type=${items[itemID].type}`;
    template += `|sellsfor=${items[itemID].sellsFor}`;
    customData = '';
    if (items[itemID].healsFor) {
        customData += `{{ItemHealsFor|healsFor=${items[itemID].healsFor * numberMultiplier}}}`;
    }
    if (items[itemID].equipmentSlot != undefined) {
        slotKeys = Object.keys(CONSTANTS.equipmentSlot);
        for (let i = 0; i < slotKeys.length; i++) {
            if (CONSTANTS.equipmentSlot[slotKeys[i]] == items[itemID].equipmentSlot) {
                customData += `{{ItemEquipSlot|equipmentSlot=${slotKeys[i]}}}`;
                break;
            }
        }
    }
    if (items[itemID].hasSpecialAttack) {
        let specialID = items[itemID].specialAttackID;
        customData += `{{ItemSpecialAttack|specialChance=${playerSpecialAttacks[specialID].chance}|specialName=${playerSpecialAttacks[specialID].name}|specialEffect=${playerSpecialAttacks[specialID].description}}}`
    }
    if (items[itemID].potionCharges != undefined) {
        customData += `{{ItemCharges|charges=${items[itemID].potionCharges}}}`;
    }
    template += `|customData=${customData}`;
    template += `|itemSources=${formatArrayAsBulletList(getItemSourcesArray(itemID))}`;
    template += `|itemUses=${formatArrayAsBulletList(getItemUsesArray(itemID))}`;
    template += '}}';
    return template;
}

function fillThievingTemplate(targetInd) {
    let template = '{{ThievingTarget';
    template += `|name=${thievingNPC[targetInd].name}`;
    template += `|level=${thievingNPC[targetInd].level}`;
    template += `|xp=${thievingNPC[targetInd].xp}`;
    template += `|drops=*1-${thievingNPC[targetInd].maxCoins} gp\n`;
    //Add loot table to drops
    if (thievingNPC[targetInd].lootTable.length > 0) {
        template += '75% chance for:\n';
        totalWeight = 0;
        for (let lootInd = 0; lootInd < thievingNPC[targetInd].lootTable.length; lootInd++) {
            totalWeight += thievingNPC[targetInd].lootTable[lootInd][1];
        }
        for (let lootInd = 0; lootInd < thievingNPC[targetInd].lootTable.length; lootInd++) {
            lootChance = 100 * thievingNPC[targetInd].lootTable[lootInd][1] / totalWeight;
            percStr = formatNumberPerc(lootChance, 2);
            if (percStr.length < 6) { percStr = '&nbsp;&nbsp;' + percStr; }
            template += `*${percStr} ${formatItemIDAsImageLink(thievingNPC[targetInd].lootTable[lootInd][0], 25, 'middle')} ${formatItemIDAsLink(thievingNPC[targetInd].lootTable[lootInd][0])}\n`;
        }
    }
    //Add chance for patreon items
    template += `${formatNumberPerc(100 / 120, 2)} chance for:\n`;
    template += `* ${formatItemIDAsImageLink(CONSTANTS.item.Bobbys_Pocket, 25, 'middle')} ${formatItemIDAsLink(CONSTANTS.item.Bobbys_Pocket)}\n`;
    template += `${formatNumberPerc(100 / 10000, 2)} chance for:\n`;
    template += `* ${formatItemIDAsImageLink(CONSTANTS.item.Chapeau_Noir, 25, 'middle')} ${formatItemIDAsLink(CONSTANTS.item.Chapeau_Noir)}\n`;
    template += '}}';
    return template;
}