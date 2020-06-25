// Contains a number of functions used to select items from Object arrays
/**
 * @description Selects items that can be cooked
 * @param {Object} item
 * @return {Boolean}
 */
function selectCookable(item) {
  return (item.cookedItemID !== undefined);
}
/**
 * @description Selects if item is allotment seed
 * @param {Object} item
 * @return {Boolean}
 */
function selectAllotmentSeed(item) {
  return (item.category === 'Farming' && item.type === 'Seeds' && item.tier === 'Allotment');
}
/**
* @description Selects if item is tree seed
* @param {Object} item
* @return {Boolean}
*/
function selectTreeseed(item) {
  return (item.category === 'Farming' && item.type === 'Seeds' && item.tier === 'Tree');
}

/**
* @description Selects if item is herb seed
* @param {Object} item
* @return {Boolean}
*/
function selectHerbSeed(item) {
  return (item.category === 'Farming' && item.type === 'Seeds' && item.tier === 'Herb');
}
/**
 * @description Selects item if it has matching equipment slot and can be upgraded
 * @param {Object} item Item array object
 * @param {number} equipmentSlot Equipment slot index
 * @return {Boolean}
 */
function selectGearUpgradeable(item, equipmentSlot) {
  return (item.trimmedItemID !== undefined && items[item.trimmedItemID].equipmentSlot === equipmentSlot);
}

/**
 * @description Selects item if it has no equipment slot and can be upgraded
 * @param {Object} item Item array object
 * @return {boolean}
 */
function selectNonGearUpgradeable(item) {
  return (item.trimmedItemID !== undefined && items[item.trimmedItemID].equipmentSlot === undefined);
}

/**
 * @description Returns true if the given monster is found in a combat area or dungeon
 * @param {Object} monster element of monster array
 * @return {Boolean}
 */
function selectMonsters(monster) {
  for (let i = 0; i < combatAreas.length; i++) {
    for (let j = 0; j < combatAreas[i].monsters.length; j++) {
      if (combatAreas[i].monsters[j] === monster.id) {
        return true;
      }
    }
  }
  for (let i = 0; i < slayerAreas.length; i++) {
    for (let j = 0; j < slayerAreas[i].monsters.length; j++) {
      if (slayerAreas[i].monsters[j] === monster.id) {
        return true;
      }
    }
  }
  for (let i = 0; i < DUNGEONS.length; i++) {
    for (let j = 0; j < DUNGEONS[i].monsters.length; j++) {
      if (DUNGEONS[i].monsters[j] === monster.id) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @description Determines if an element of Smithing items contains the string type, special exception for bars
 * @param {Object} smithItem Element of smithingItems
 * @param {string} type Type of item
 * @return {Boolean}
 */
function selectSmithingItem(smithItem, type) {
  if (type === 'Iron' && smithItem.name.includes('Bolts')) {
    return true;
  }
  return ((type === 'Bar' && smithItem.name.includes(type)) || (smithItem.name.includes(type) && !(smithItem.name.includes('Bar'))));
}

/**
 * @description Selects armour items belonging to the type specified
 * @param {Object} item
 * @param {number} equipmentSlot
 * @param {string} type
 * @param {Number} ammoType The type of ammo
 * @return {Boolean}
 */
function selectArmourItem(item, equipmentSlot, type, ammoType) {
  let match = false;
  if (item.equipmentSlot === equipmentSlot) {
    if (type === 'Melee') {
      match = (item.defenceLevelRequired !== undefined || isItemOnArray(item.id, slayerMeleeArmour));
    } else if (type === 'Ranged') {
      match = (item.rangedLevelRequired !== undefined || isItemOnArray(item.id, slayerRangedArmour));
    } else if (type === 'Magic') {
      match = (item.magicLevelRequired !== undefined || isItemOnArray(item.id, slayerMagicArmour));
    } else if (type === 'All') {
      match = true;
    } else if (type === 'None') {
      match = (item.defenceLevelRequired === undefined) && (item.rangedLevelRequired === undefined) && (item.magicLevelRequired === undefined);
    }
  }
  if (ammoType !== -1) {// Arrows: 0, Bolts: 1, Javelins: 2, Knives: 3
    match = (item.ammoType === ammoType);
  }
  return match;
}

/**
 * @description Selects weapon items belonging to the type specified
 * @param {Object} item
 * @param {string} type
 * @param {Number} ammoTypeRequired The ammo type required for the weapon
 * @return {boolean}
 */
function selectWeaponItem(item, type, ammoTypeRequired) {
  if (item.equipmentSlot === CONSTANTS.equipmentSlot.Weapon) {
    if (type === 'Melee') {
      return (item.attackLevelRequired !== undefined && item.magicLevelRequired === undefined);
    } else if (type === 'Ranged') {
      if (ammoTypeRequired === -1) {
        return (item.rangedLevelRequired !== undefined);
      }
      return (item.rangedLevelRequired !== undefined && item.ammoTypeRequired === ammoTypeRequired);
    } else if (type === 'Magic') {
      return (item.magicLevelRequired !== undefined);
    } else if (type === 'All') {
      return true;
    } else if (type === 'None') {
      return (item.attackLevelRequired === undefined) && (item.rangedLevelRequired === undefined) && (item.magicLevelRequired === undefined);
    }
  } else {
    return false;
  }
}

/**
 * @description Determines if an items name contains the string
 * @param {Object} item Element of items array
 * @param {string} includedString String contained within item name
 * @return {Boolean}
 */
function selectItemFromName(item, includedString) {
  return item.name.includes(includedString);
}

/**
 * @description Determines if an item is for crafting
 * @param {Object} item Element of items array
 * @param {string} type Category of crafting menu
 * @return {Boolean}
 */
function selectCraftingItem(item, type) {
  return (item.craftingID !== undefined) && selectItemFromName(item, type);
}

/**
 * @description Determines if an item is for fletching
 * @param {Object} item Element of items array
 * @param {*} type Category of fletching menu
 * @return {Boolean}
 */
function selectFletchingItem(item, type) {
  return (item.fletchingID !== undefined) && selectItemFromName(item, type);
}

/**
 * @description Selects every item in the array, useful for populating parentIndex
 * @return {Boolean}
 */
function selectAll() {
  return true;
}
/**
 * @description Selects an array element if it has the given key
 * @param {any} element The element of the array
 * @param {string} key The key value to check for
 * @return {Boolean}
 */
function selectIfHasKey(element, key) {
  if (element[key] !== undefined) {
    return true;
  }
  return false;
}
