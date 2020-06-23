// Contains a collection of functions that create strings that are commonly used

/**
 * @description tableMaker is used to create wikimedia tables
 */
class TableMaker {
  /**
   * @description Constructs a new instance of tableMaker
   * @param {string} tableClass Class of table
   */
  constructor(tableClass) {
    this.tableClass = tableClass;
    this.outputStr = '';
  }
  /**
   * @description Starts the table
   */
  startTable() {
    this.outputStr += '{| class="' + this.tableClass + '"';
    this.headerRows = 0;
  }
  /**
   * @description Ends the table
   */
  endTable() {
    this.outputStr += '\n|}';
  }
  /**
   * @description Adds a column header with the name specified
   * @param {string} headerName
   */
  addHeader(headerName) {
    this.outputStr += '\n!' + headerName;
  }
  /**
   * @description Starts a new row in the table
   */
  nextRow() {
    this.outputStr += '\n|-';
  }
  /**
   * Starts the next header row for a table
   */
  nextHeaderRow() {
    this.outputStr += `\n|- class="headerRow-${this.headerRows}"`;
    this.headerRows++;
  }
  /**
   * @description Starts a new column with the specified cell alignment
   * @param {string} textAlignment Alignment of text in cell
   */
  nextColumn(textAlignment) {
    this.outputStr += `\n| style ="text-align: ${textAlignment};" |`;
  }
  /**
   * Starts a new column with the specificed cell alignment and data sorting value
   * @param {String} textAlignment Algnment of text in cell
   * @param {*} sortValue Sort value for cell
   */
  nextColumnSort(textAlignment, sortValue) {
    this.outputStr += `\n| style ="text-align: ${textAlignment};" data-sort-value="${sortValue}" |`;
  }
  /**
   * @description Adds a string to current cell
   * @param {string} dataString
   */
  addCellData(dataString) {
    this.outputStr += dataString;
  }
  /**
   * @description Adds a header that spans more than one column
   * @param {string} headerName Text in header
   * @param {number} colSpan Number of cells header covers
   */
  addSpanHeader(headerName, colSpan) {
    this.outputStr += `\n! colspan=\"${colSpan}\" ${headerName}`;
  }
}
/**
 * @description Creates a string representing a new section
 * @param {string} sectionTitle The name of the section
 * @return {string}
 */
function createSection(sectionTitle) {
  return `\n==${sectionTitle}==\n`;
}
/**
 * @description Creates a string representing a new subsection
 * @param {string} sectionTitle The name of the subsection
 * @return {string}
 */
function createSubSection(sectionTitle) {
  return `\n===${sectionTitle}===\n`;
}
/**
 * @description Creates a string representing a new subsubsection
 * @param {string} sectionTitle The name of the subsubsection
 * @return {string}
 */
function createSubSubSection(sectionTitle) {
  return `\n====${sectionTitle}====\n`;
}

/**
 * @description Creates a string that links to a page
 * @param {string} linkText The link text
 * @param {string} linkPage The page to link to
 * @return {string}
 */
function createPageLink(linkText, linkPage) {
  return `[[${linkPage}|${linkText}]]`;
}

/**
 * @description creates a string for an image that links to a page
 * @param {string} linkImage Image source
 * @param {string} linkPage Page to link to
 * @param {number} imageSize size of image in pixels
 * @param {string} imageAlignment image alignment
 * @return {string}
 */
function createImageLink(linkImage, linkPage, imageSize, imageAlignment) {
  return `[[File:${linkImage}|${imageSize}px|${imageAlignment}|link=${linkPage}]]`;
}
/**
 * @description Formats an array of objects into a wikimedia table
 * @param {Object[]} objectArray Array to format as a table
 * @param {Object[]} tableSpec Specification of what keys to format and how:
 * Contains objects with keys:
 * header: Name of header
 * just: Justification of cell data
 * arrayKey: key of object to format
 * defaultKeyValue: default value of object.arrayKey if value doesn't exist
 * formatFunc: function that is fed object.arrayKey
 * @return {string}
 */
function formatObjectArrayAsTable(objectArray, tableSpec) {
  const tableGen = new TableMaker('wikitable sortable stickyHeader');
  tableGen.startTable();
  tableGen.nextHeaderRow(); // New Code
  // Add headers
  for (let i = 0; i < tableSpec.length; i++) {
    tableGen.addHeader(tableSpec[i].header);
  }
  // Generate cells
  for (let i = 0; i < objectArray.length; i++) {
    tableGen.nextRow();
    for (let j = 0; j < tableSpec.length; j++) {
      // Exception for arrays of arrayKeys
      let keyValues;
      if (tableSpec[j].arrayKey instanceof Array) {
        keyValues = [];
        for (let k = 0; k < tableSpec[j].arrayKey.length; k++) {
          if (objectArray[i][tableSpec[j].arrayKey[k]] !== undefined) {
            keyValues[k] = objectArray[i][tableSpec[j].arrayKey[k]];
          } else {
            keyValues[k] = tableSpec[j].defaultKeyValue[k];
          }
        }
      } else {
        if (objectArray[i][tableSpec[j].arrayKey] !== undefined) {
          keyValues = objectArray[i][tableSpec[j].arrayKey];
        } else {
          keyValues = tableSpec[j].defaultKeyValue;
        }
      }
      if (tableSpec[j].isSorted) {
        tableGen.nextColumnSort(tableSpec[j].just, tableSpec[j].sortFunction(keyValues));
      } else {
        tableGen.nextColumn(tableSpec[j].just);
      }
      tableGen.addCellData(tableSpec[j].formatFunc(keyValues));
    }
  }
  tableGen.endTable();
  return tableGen.outputStr;
}

/**
 * @description Formats an array of objects into a wikimedia table with a second header
 * @param {Object[]} objectArray Array to format as a table
 * @param {Object[]} tableSpec Specification of what keys to format and how:
 * @param {Object[]} spanSpec Specification for span headers
 * Contains objects with keys:
 * header: Name of header
 * just: Justification of cell data
 * arrayKey: key of object to format
 * defaultKeyValue: default value of object.arrayKey if value doesn't exist
 * formatFunc: function that is fed object.arrayKey
 * @return {string}
 */
function formatObjectArrayAsTableWSH(objectArray, tableSpec, spanSpec) {
  const tableGen = new TableMaker('wikitable sortable stickyHeader');
  tableGen.startTable();
  // Add first header row
  tableGen.nextHeaderRow(); // New Code
  for (let i = 0; i < spanSpec.length; i++) {
    tableGen.addSpanHeader(spanSpec[i].spanText, spanSpec[i].spanLength);
  }
  // Add second header row
  tableGen.nextHeaderRow(); // New Code, replace nextRow()
  for (let i = 0; i < tableSpec.length; i++) {
    tableGen.addHeader(tableSpec[i].header);
  }
  // Generate cells
  for (let i = 0; i < objectArray.length; i++) {
    tableGen.nextRow();
    for (let j = 0; j < tableSpec.length; j++) {
      tableGen.nextColumn(tableSpec[j].just);
      // Exception for arrays of arrayKeys
      if (typeof (tableSpec[j].arrayKey) != 'string') {
        const keyValues = [];
        for (let k = 0; k < tableSpec[j].arrayKey.length; k++) {
          if (objectArray[i][tableSpec[j].arrayKey[k]] != undefined) {
            keyValues[k] = objectArray[i][tableSpec[j].arrayKey[k]];
          } else {
            keyValues[k] = tableSpec[j].defaultKeyValue[k];
          }
        }
        tableGen.addCellData(tableSpec[j].formatFunc(keyValues));
      } else {
        if (objectArray[i][tableSpec[j].arrayKey] != undefined) {
          tableGen.addCellData(tableSpec[j].formatFunc(objectArray[i][tableSpec[j].arrayKey]));
        } else {
          tableGen.addCellData(tableSpec[j].formatFunc(tableSpec[j].defaultKeyValue));
        }
      }
    }
  }
  tableGen.endTable();
  return tableGen.outputStr;
}

/**
 * @description Parses through an object array and returns a subarray that match the criteria defined by selectionFunc. Also adds a parentIndex key value
 * @param {Object[]} objectArray Array to find elements of
 * @param {Function} selectionFunc Function that operates on a single element of objectArray, must return true or false
 * @return {Object[]}
 */
function getObjectArraySubset(objectArray, selectionFunc) {
  const subObjectArray = [];
  for (let i = 0; i < objectArray.length; i++) {
    if (selectionFunc(objectArray[i])) {
      subObjectArray.push(objectArray[i]);
      subObjectArray[subObjectArray.length - 1].parentIndex = i;
    }
  }
  return subObjectArray;
}

/**
 * @description Used to assist in creating table specifications
 */
class TableSpecMaker {
  /**
   * @description Constructs an instance of tableSpecMaker
   */
  constructor() {
    this.tableSpec = [];
    this.spanSpec = [];
  }
  /**
   * @description Appends a new element to the tableSpecification
   * @param {string} colName Name of the column to display
   * @param {string} just Justification of text in the columns cells
   * @param {string} arrayKey Key of object array to format
   * @param {any} defaultKeyValue Default value of object array key value if undefined
   * @param {Function} formatFunc Format function for object array key value
   * @param {Function} sortOrderFunc Format function for object array key value that creates the data sort value
   */
  appendColumn(colName, just, arrayKey, defaultKeyValue, formatFunc, sortOrderFunc = undefined) {
    if (sortOrderFunc !== undefined) {
      this.tableSpec.push({
        header: colName,
        just: just,
        arrayKey: arrayKey,
        defaultKeyValue: defaultKeyValue,
        formatFunc: formatFunc,
        isSorted: true,
        sortFunction: sortOrderFunc,
      });
    } else {
      this.tableSpec.push({
        header: colName,
        just: just,
        arrayKey: arrayKey,
        defaultKeyValue: defaultKeyValue,
        formatFunc: formatFunc,
        isSorted: false,
      });
    }
  }
  /**
   * Appends a span to the table specification
   * @param {String} spanText The text contained in the span
   * @param {Number} spanLength The length of the span
   */
  appendSpan(spanText, spanLength) {
    this.spanSpec.push({
      spanLength: spanLength,
      spanText, spanText,
    });
  }
}

/**
 * @description Experimental function that doesn't work
 * @param {string} stringToCopy
 */
function copyToClipboard(stringToCopy) {
  const copyElement = document.createElement('textarea');
  copyElement.value = stringToCopy;
  document.body.appendChild(copyElement);
  copyElement.select();
  document.execCommand('copy');
  document.body.removeChild(copyElement);
}

/**
 * @description Gets an array of the locations a monster is found in
 * @param {Number} monsterID
 * @return {Array<String>}
 */
function getMonsterLocationArray(monsterID) {
  const locationArray = [];
  for (let i = 0; i < combatAreas.length; i++) {
    for (let j = 0; j < combatAreas[i].monsters.length; j++) {
      if (monsterID == combatAreas[i].monsters[j]) {
        locationArray.push(`${formatCombatAreaIDAsImageLink(i, 25, 'middle')} ${formatCombatAreaIDAsLink(i)}`);
        break;
      }
    }
  }
  for (let i = 0; i < slayerAreas.length; i++) {
    for (let j = 0; j < slayerAreas[i].monsters.length; j++) {
      if (monsterID == slayerAreas[i].monsters[j]) {
        locationArray.push(`${formatSlayerAreaIDAsImageLink(i, 25, 'middle')} ${formatSlayerAreaIDAsLink(i)}`);
        break;
      }
    }
  }
  for (let i = 0; i < DUNGEONS.length; i++) {
    for (let j = 0; j < DUNGEONS[i].monsters.length; j++) {
      if (monsterID == DUNGEONS[i].monsters[j]) {
        locationArray.push(`${formatDungeonIDAsImageLink(i, 25, 'middle')} ${formatDungeonIDAsLink(i)}`);
        break;
      }
    }
  }
  return locationArray;
}

/**
 * @description Generates an array of the possible keys that items have
 * @return {string[]} Array of Strings
 */
function getListOfItemKeys() {
  const keyList = [];
  const keyQuantity = [];
  let keyOnList;
  items.forEach((item) => {
    Object.keys(item).forEach((itemKey) => {
      keyOnList = false;
      for (let i = 0; i < keyList.length; i++) {
        if (keyList[i] == itemKey) {
          keyQuantity[i]++;
          keyOnList = true;
          break;
        }
      }
      if (!keyOnList) {
        keyList.push(itemKey);
        keyQuantity.push(1);
      }
    });
  });
  return {keys: keyList, qty: keyQuantity};
}

/**
 * @description Creates a string array of item uses to be formatted later
 * @param {number} itemID Index of items array
 * @return {Array<String>}
 */
function getItemUsesArray(itemID) {
  const itemUseArray = [];
  Object.keys(itemUses).forEach((key) => {
    for (let i = 0; i < itemUses[key].items.length; i++) {
      if (itemID == itemUses[key].items[i]) {
        itemUseArray.push(itemUses[key].format);
        break;
      }
    }
  });
  if (itemUseArray.length == 0) {
    itemUseArray.push('None');
  }
  return itemUseArray;
}

/**
 * @description Creates a string array of the items sources to be formatted later
 * @param {number} itemID Index of items array
 * @return {Array<String>}
 */
function getItemSourcesArray(itemID) {
  // Potential Sources:
  // Drop from enemy
  // Loot from chests/birdnests
  // Loot from thieving
  // Upgrading from another item
  // Skills: Woodcutting, Fishing, Cooking, Mining, Smithing, Farming, Fletching, Crafting, Runecrafting
  const itemSources = [];
  // Search monster drops
  let monsterList = '';
  for (let i = 0; i < combatAreas.length; i++) {
    for (let j = 0; j < combatAreas[i].monsters.length; j++) {
      const monsterID = combatAreas[i].monsters[j];
      if (MONSTERS[monsterID].lootTable != undefined) {
        for (let k = 0; k < MONSTERS[monsterID].lootTable.length; k++) {
          if (MONSTERS[monsterID].lootTable[k][0] == itemID) {
            monsterList += `${formatMonsterIDAsImageLink(monsterID, 25, 'middle')}, `;
            break;
          }
        }
      }
      if (MONSTERS[monsterID].bones == itemID) {
        monsterList += `${formatMonsterIDAsImageLink(monsterID, 25, 'middle')}, `;
      }
    }
  }
  for (let i = 0; i < slayerAreas.length; i++) {
    for (let j = 0; j < slayerAreas[i].monsters.length; j++) {
      const monsterID = slayerAreas[i].monsters[j];
      if (MONSTERS[monsterID].lootTable != undefined) {
        for (let k = 0; k < MONSTERS[monsterID].lootTable.length; k++) {
          if (MONSTERS[monsterID].lootTable[k][0] == itemID) {
            monsterList += `${formatMonsterIDAsImageLink(monsterID, 25, 'middle')}, `;
            break;
          }
        }
      }
      if (MONSTERS[monsterID].bones == itemID) {
        monsterList += `${formatMonsterIDAsImageLink(monsterID, 25, 'middle')}, `;
      }
    }
  }

  if (monsterList != '') {
    itemSources.push(`Killing: ${monsterList.slice(0, monsterList.length - 2)}`);
  }
  // Dungeons
  let dungeonList = '';
  for (let i = 0; i < DUNGEONS.length; i++) {
    for (let j = 0; j < DUNGEONS[i].rewards.length; j++) {
      if (DUNGEONS[i].rewards[j] == itemID) {
        dungeonList += `${formatDungeonIDAsImageLink(i, 25, 'middle')}, `;
      }
    }
  }
  if (dungeonList != '') {
    itemSources.push(`Completing: ${dungeonList.slice(0, dungeonList.length - 2)}`);
  }
  let chestList = '';
  // Search openable items
  for (let i = 0; i < openableItems.length; i++) {
    for (let j = 0; j < items[openableItems[i]].dropTable.length; j++) {
      if (items[openableItems[i]].dropTable[j][0] == itemID) {
        chestList += `${formatItemIDAsImageLink(openableItems[i], 25, 'middle')}, `;
        break;
      }
    }
  }
  if (chestList != '') {
    itemSources.push(`Opening: ${chestList.slice(0, chestList.length - 2)}`);
  }
  let thieveList = '';
  // Search thieving targets
  for (let i = 0; i < thievingNPC.length; i++) {
    for (let j = 0; j < thievingNPC[i].lootTable.length; j++) {
      if (thievingNPC[i].lootTable[j][0] == itemID) {
        thieveList += `${formatThievingIDAsImageLink(i, 25, 'middle')}, `;
        break;
      }
    }
  }
  if (thieveList != '') {
    itemSources.push(`Pickpocketing: ${thieveList.slice(0, thieveList.length - 2)}`);
  }
  if (itemID == CONSTANTS.item.Bobbys_Pocket || itemID == CONSTANTS.item.Chapeau_Noir) {
    itemSources.push(`${formatSkillImageLink('Thieving', 25, 'middle')} (Lv. ${1})`);
  }

  let farmList = '';
  let cookList = '';
  let burnList = '';
  // Search items for upgrades, being cooked, being farmed, being burnt
  for (let i = 0; i < items.length; i++) {
    if (items[i].trimmedItemID == itemID) {
      itemSources.push(`Upgrading: ${formatItemIDAsImageLink(i, 25, 'middle')}`);
    }
    if (items[i].grownItemID == itemID) {
      farmList += `${formatItemIDAsImageLink(i, 25, 'middle')}, `;
    }
    if (items[i].cookedItemID == itemID) {
      cookList += `${formatItemIDAsImageLink(i, 25, 'middle')}, `;
    }
    if (items[i].burntItemID == itemID) {
      burnList += `${formatItemIDAsImageLink(i, 25, 'middle')}, `;
    }
  }
  if (farmList != '') {
    itemSources.push(`Growing: ${farmList.slice(0, farmList.length - 2)}`);
  }
  if (cookList != '') {
    itemSources.push(`Cooking: ${cookList.slice(0, cookList.length - 2)}`);
  }
  if (burnList != '') {
    itemSources.push(`Burning: ${burnList.slice(0, burnList.length - 2)}`);
  }
  // Check for skills
  // Woodcutting
  for (let i = 0; i < trees.length; i++) {
    if (i == itemID) {
      itemSources.push(`${formatSkillImageLink('Woodcutting', 25, 'middle')} (Lv. ${trees[i].level})`);
    }
  }
  if (itemID == CONSTANTS.item.Bird_Nest) {
    itemSources.push(`${formatSkillImageLink('Woodcutting', 25, 'middle')} (Lv. ${1})`);
  }
  // Fishing
  for (let i = 0; i < fishingItems.length; i++) {
    if (fishingItems[i].itemID == itemID) {
      itemSources.push(`${formatSkillImageLink('Fishing', 25, 'middle')} (Lv. ${fishingItems[i].fishingLevel})`);
    }
  }
  for (let i = 0; i < junkItems.length; i++) {
    if (junkItems[i] == itemID) {
      itemSources.push(`${formatSkillImageLink('Fishing', 25, 'middle')} (Lv. 1)`);
    }
  }
  for (let i = 0; i < specialItems.length; i++) {
    if (specialItems[i][0] == itemID) {
      itemSources.push(`${formatSkillImageLink('Fishing', 25, 'middle')} (Lv. 1)`);
    }
  }
  // Firemaking
  if (itemID == CONSTANTS.item.Coal_Ore) {
    itemSources.push(`${formatSkillImageLink('Firemaking', 25, 'middle')} (Lv. ${1})`);
  }
  // Mining
  if (items[itemID].miningLevel != undefined) {
    itemSources.push(`${formatSkillImageLink('Mining', 25, 'middle')} (Lv. ${items[itemID].miningLevel})`);
  }
  if (items[itemID].type == 'Gem') {
    itemSources.push(`${formatSkillImageLink('Mining', 25, 'middle')} (Lv. ${1})`);
  }
  // Smithing
  if (items[itemID].smithingLevel != undefined) {
    itemSources.push(`${formatSkillImageLink('Smithing', 25, 'middle')} (Lv. ${items[itemID].smithingLevel})`);
  }
  // Fletching
  if (items[itemID].fletchingLevel != undefined) {
    itemSources.push(`${formatSkillImageLink('Fletching', 25, 'middle')} (Lv. ${items[itemID].fletchingLevel})`);
  }
  // Crafting
  if (items[itemID].craftingLevel != undefined) {
    itemSources.push(`${formatSkillImageLink('Crafting', 25, 'middle')} (Lv. ${items[itemID].craftingLevel})`);
  }
  // Runecrafting
  if (items[itemID].runecraftingLevel != undefined) {
    itemSources.push(`${formatSkillImageLink('Runecrafting', 25, 'middle')} (Lv. ${items[itemID].runecraftingLevel})`);
  }
  // Herblore
  if (items[itemID].fromHerblore) {
    itemSources.push(`${formatSkillImageLink('Herblore', 25, 'middle')} (Lv. ${items[itemID].herbloreLevel})`);
  }
  // Mastery Tokens
  if (items[itemID].isToken) {
    itemSources.push(`${formatSkillImageLink(skillName[items[itemID].skill], 25, 'middle')} (Lv. ${1})`);
  }
  // Shop
  // skillcapeItems,gloveID,
  const shopItems = [CONSTANTS.item.Green_Dragonhide, CONSTANTS.item.Blue_Dragonhide, CONSTANTS.item.Red_Dragonhide, CONSTANTS.item.Cooking_Gloves, CONSTANTS.item.Mining_Gloves, CONSTANTS.item.Smithing_Gloves, CONSTANTS.item.Thieving_Gloves, CONSTANTS.item.Gem_Gloves, CONSTANTS.item.Bowstring, CONSTANTS.item.Compost, CONSTANTS.item.Leather, CONSTANTS.item.Weird_Gloop];
  let inShop = false;
  for (let i = 0; i < shopItems.length; i++) {
    if (itemID == shopItems[i]) {
      inShop = true;
      break;
    }
  }
  for (let i = 0; i < skillcapeItems.length; i++) {
    if (itemID == skillcapeItems[i]) {
      inShop = true;
      break;
    }
  }
  for (let i = 0; i < slayerItems.length; i++) {
    if (itemID == slayerItems[i]) {
      inShop = true;
      break;
    }
  }
  if (inShop) {
    itemSources.push('[[Shop]]');
  }
  if (itemID == CONSTANTS.item.Signet_Ring_Half_B) {
    itemSources.push('Killing any [[Monsters|Monster]]');
  }
  if (itemID == CONSTANTS.item.Signet_Ring_Half_A) {
    itemSources.push('Any non-combat [[:Category:Skills|Skill]] action');
  }
  if (itemID == CONSTANTS.item.Amulet_of_Calculated_Promotion || itemID == CONSTANTS.item.Clue_Chasers_Insignia || itemID == CONSTANTS.item.Lemon) {
    itemSources.push('[[Easter Eggs]]');
  }
  if (itemSources.length == 0) {
    itemSources.push('None');
  }
  return itemSources;
}

/**
 * @description Determines if a monster can only be found in dungeons
 * @param {number} monsterID Index of MONSTERS array
 * @return {Boolean}
 */
function isMonsterDungeonOnly(monsterID) {
  isDungeon = true;
  for (i = 0; i < combatAreas.length; i++) {
    for (let j = 0; j < combatAreas[i].monsters.length; j++) {
      if (combatAreas[i].monsters[j] == monsterID) {
        isDungeon = false;
        break;
      }
    }
    if (!isDungeon) {
      break;
    }
  }
  for (i = 0; i < slayerAreas.length; i++) {
    for (let j = 0; j < slayerAreas[i].monsters.length; j++) {
      if (slayerAreas[i].monsters[j] == monsterID) {
        isDungeon = false;
        break;
      }
    }
    if (!isDungeon) {
      break;
    }
  }
  return isDungeon;
}

/**
 * @description Sets the first character of a string to uppercase
 * @param {string} string
 * @return {String}
 */
function setToUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @description Data processing function that looks through known page names and generates non duplicated names
 * @return {*}
 */
function findDuplicatePageNames() {
  const dupeData = {
    duplicateNames: [],
    usedBaseNames: [],
  };

  // Create arrays for particular page names
  const dedupeStrings = { // Append to pageName to uniquely identify them
    items: ' (item)',
    monsters: ' (monster)',
    thievingTarget: ' (thieving)',
    combatAreas: ' (combat area)',
    slayerAreas: ' (slayer area)',
    dungeons: ' (dungeon)',
    spells: ' (spell)',
    prayers: ' (prayer)',
    axeUpgrades: ' (upgrade)',
    pickUpgrades: ' (upgrade)',
    rodUpgrades: ' (upgrade)',
    fireUpgrades: ' (upgrade)',
    eatUpgrades: ' (upgrade)',
    miscUpgrades: ' (upgrade)',
    godUpgrades: ' (upgrade)',
  };
  const pageNames = { // Arrays with unique page names to generate links/create pages with
    items: [],
    monsters: [],
    thievingTarget: [],
    combatAreas: [],
    slayerAreas: [],
    dungeons: [],
    spells: [],
    prayers: [],
    axeUpgrades: [],
    pickUpgrades: [],
    rodUpgrades: [],
    fireUpgrades: [],
    eatUpgrades: [],
    miscUpgrades: [],
    godUpgrades: [],
  };

  // Start populating base names
  for (let i = 0; i < items.length; i++) {
    dupeData.usedBaseNames.push(items[i].name);
    pageNames.items.push(items[i].name);
  }
  const monsterDupes = findSelfDuplicateNames(MONSTERS, 'name');
  for (let i = 0; i < MONSTERS.length; i++) {
    let monsterBasePage = MONSTERS[i].name;
    if (isItemOnArray(monsterBasePage, monsterDupes.duplicateNames)) {
      monsterBasePage += ` (lv. ${getMonsterCombatLevel(i)})`;
    }
    pageNames.monsters.push(monsterBasePage);
    addNameToDupeData(dupeData, monsterBasePage);
  }
  for (let i = 0; i < thievingNPC.length; i++) {
    pageNames.thievingTarget.push(thievingNPC[i].name);
    addNameToDupeData(dupeData, thievingNPC[i].name);
  }
  for (let i = 0; i < combatAreas.length; i++) {
    pageNames.combatAreas.push(combatAreas[i].areaName);
    addNameToDupeData(dupeData, combatAreas[i].areaName);
  }
  for (let i = 0; i < slayerAreas.length; i++) {
    pageNames.slayerAreas.push(slayerAreas[i].areaName);
    addNameToDupeData(dupeData, slayerAreas[i].areaName);
  }
  for (let i = 0; i < DUNGEONS.length; i++) {
    pageNames.dungeons.push(DUNGEONS[i].name);
    addNameToDupeData(dupeData, DUNGEONS[i].name);
  }
  for (let i = 0; i < SPELLS.length; i++) {
    pageNames.spells.push(SPELLS[i].name);
    addNameToDupeData(dupeData, SPELLS[i].name);
  }
  for (let i = 0; i < PRAYER.length; i++) {
    pageNames.prayers.push(PRAYER[i].name);
    addNameToDupeData(dupeData, PRAYER[i].name);
  }
  // Upgrade Names
  for (let i = 0; i < tiers.length; i++) {
    const axeName = getAxeUpgradeName(i);
    const pickName = getPickUpgradeName(i);
    const rodName = getRodUpgradeName(i);
    pageNames.axeUpgrades.push(axeName);
    addNameToDupeData(dupeData, axeName);
    pageNames.pickUpgrades.push(pickName);
    addNameToDupeData(dupeData, pickName);
    pageNames.rodUpgrades.push(rodName);
    addNameToDupeData(dupeData, rodName);
  }
  for (let i = 0; i < cookingFireData.length; i++) {
    const fireName = getFireUpgradeName(i);
    pageNames.fireUpgrades.push(fireName);
    addNameToDupeData(dupeData, fireName);
  }
  for (let i = 0; i < autoEatData.length; i++) {
    pageNames.eatUpgrades.push(autoEatData[i].title);
    addNameToDupeData(dupeData, autoEatData[i].title);
  }
  const miscUpgrades = ['Multi-Tree', 'Extra Equipment Set', 'Bank Slot'];
  for (let i = 0; i < miscUpgrades.length; i++) {
    pageNames.miscUpgrades.push(miscUpgrades[i]);
    addNameToDupeData(dupeData, miscUpgrades[i]);
  }
  for (let i = 0; i < godUpgradeData.length; i++) {
    pageNames.godUpgrades.push(godUpgradeData[i].name);
    addNameToDupeData(dupeData, godUpgradeData[i].name);
  }
  // De-duplicate duplicate names, and generate disambiguation data
  const disambiguationData = {
    pageNames: [],
    pageLinks: [],
  };
  for (let i = 0; i < dupeData.duplicateNames.length; i++) {
    disambiguationData.pageNames.push(dupeData.duplicateNames[i]);
    disambiguationData.pageLinks.push([]);
  }
  for (let i = 0; i < monsterDupes.duplicateNames.length; i++) {
    disambiguationData.pageNames.push(monsterDupes.duplicateNames[i]);
    disambiguationData.pageLinks.push([]);
  }
  for (let i = 0; i < MONSTERS.length; i++) {
    const dupeIndices = findItemOnArray(MONSTERS[i].name, monsterDupes.duplicateNames);
    if (dupeIndices.length > 0) {
      disambiguationData.pageLinks[dupeIndices[0] + dupeData.duplicateNames.length].push(`[[${pageNames.monsters[i]}]]`);
    }
  }
  Object.keys(pageNames).forEach((nameClass) => {
    for (let i = 0; i < pageNames[nameClass].length; i++) {
      const dupeIndices = findItemOnArray(pageNames[nameClass][i], dupeData.duplicateNames);
      if (dupeIndices.length > 0) {
        pageNames[nameClass][i] += dedupeStrings[nameClass];
        disambiguationData.pageLinks[dupeIndices[0]].push(`[[${pageNames[nameClass][i]}]]`);
      }
    }
  });

  const returnObject = {
    pageNames: pageNames,
    disambiguationData: disambiguationData,
  };
  return returnObject;
}

/**
 * Adds An arrays names to the dupe data
 * @param {Array} array Array containing names
 * @param {String} arrayKey Key of array that corresponds to name
 * @return {*}
 */
function findSelfDuplicateNames(array, arrayKey) {
  const dupeData = {
    duplicateNames: [],
    usedBaseNames: [],
  };
  for (let i = 0; i < array.length; i++) {
    addNameToDupeData(dupeData, array[i][arrayKey]);
  }
  return dupeData;
}

/**
 * Adds a name to the dupe data
 * @param {*} dupeData Dupe data
 * @param {String} basePageName Page Name before disambiguation
 */
function addNameToDupeData(dupeData, basePageName) {
  if (isItemOnArray(basePageName, dupeData.usedBaseNames)) {
    if (!isItemOnArray(basePageName, dupeData.duplicateNames)) {
      dupeData.duplicateNames.push(basePageName);
    }
  } else {
    dupeData.usedBaseNames.push(basePageName);
  }
}

/**
 * @description Returns true if arrayItem is contained on arrayToSearch
 * @param {*} arrayItem
 * @param {Array} arrayToSearch
 * @return {Boolean}
 */
function isItemOnArray(arrayItem, arrayToSearch) {
  for (let i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i] == arrayItem) {
      return true;
    }
  }
  return false;
}

/**
 * @description Returns the indices where the arrayItem is found
 * @param {*} arrayItem
 * @param {Array} arrayToSearch
 * @return {Number}
 */
function findItemOnArray(arrayItem, arrayToSearch) {
  const indices = [];
  for (let i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i] == arrayItem) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Replaces a table in a string with a newTable
 * @param {string} originalString
 * @param {string} newTableString
 * @return {String}
 */
function replaceTableInString(originalString, newTableString) {
  return originalString.replace(TABLEREGEX, newTableString);
}

/**
 * Extracts the extension from a file name
 * @param {String} filename The original filename
 * @return {String} The file extension
 */
function getFileExtension(filename) {
  const matches = filename.match(EXTENSIONREGEX);
  return matches[0].replace(EXTENSIONREGEX2, '');
}

/** Shows which items have no bot defined source template */
function showEmptySourceTemplates() {
  const emptyList = [];
  for (let i=0; i<items.length; i++) {
    const sourcePage = createItemSourceTemplatePage(i);
    if (sourcePage == `<noinclude>This template was autogenerated by MelvorWikiBot.\n${BOTCATEGORY}\n[[Category:Item Sources]]\n${VERSIONCATEGORY}</noinclude>`) {
      emptyList.push(items[i].name);
    }
  }
  console.log(emptyList);
}
