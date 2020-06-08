// Functions for bulk wiki operations
/**
 * @description Uploads multiple images to the wiki in succession
 * @param {string[]} imageFileNames The names of the files on the wiki
 * @param {string[]} imageSourceURLs The URLs of the images from the game
 * @param {string} imageText The text to attach to the image page
 * @async
 */
async function bulkUploadImages(imageFileNames, imageSourceURLs, imageText) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let imagesUploaded = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  let i = 0;
  let imageUploadAttempts = 0;
  console.log(`Starting Image upload process for ${imageFileNames.length} Images.`);
  while (!imagesUploaded) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (imageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    imageUploadAttempts++;
    const uploadResults = await uploadImageFromUrlViaBlob(imageFileNames[i], imageText, imageSourceURLs[i], csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else if (errorCode == 'fileexists-no-change') {
        // Image already exists
        console.log(`Image: ${imageFileNames[i]} has not changed.`);
        imageUploadAttempts = 0;
        i++;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during uploads.');
        break;
      }
    } else {
      console.log(`Image: ${imageFileNames[i]} has been uploaded.`);
      imageUploadAttempts = 0;
      i++;
    }
    if (i == imageFileNames.length) {
      imagesUploaded = true;
    }
  }
  console.log(`${imageFileNames.length} Images succesfully uploaded.`);
  imageUploadInProgress = false;
}

/**
 * @description Overwrites/creates each Monster page
 * @param {number} indexStart Starting index of MONSTERS array
 * @param {number} indexEnd End index of MONSTERS array
 * @async
 */
async function bulkCreateItemPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= items.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= items.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(items[i].name, createItemPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for item: ${items[i].name} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}

/**
 * @description Overwrites/creates each monster page
 * @param {number} indexStart Starting index of items array
 * @param {number} indexEnd End index of items array
 * @async
 */
async function bulkCreateMonsterPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= MONSTERS.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= MONSTERS.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.monsters[i], createMonsterPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for item: ${wikiPageNames.monsters[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}

/**
 * @description Overwrites/creates each combat area page
 * @param {number} indexStart Starting index of items array
 * @param {number} indexEnd End index of items array
 * @async
 */
async function bulkCreateCombatAreaPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= combatAreas.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= combatAreas.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.combatAreas[i], createCombatAreaPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for combat area: ${wikiPageNames.combatAreas[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}


/**
 * @description Overwrites/creates each combat area page
 * @param {number} indexStart Starting index of items array
 * @param {number} indexEnd End index of items array
 * @async
 */
async function bulkCreateSlayerAreaPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= slayerAreas.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= slayerAreas.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.slayerAreas[i], createSlayerAreaPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for slayer area: ${wikiPageNames.slayerAreas[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}


/**
 * @description Overwrites/creates each combat area page
 * @param {number} indexStart Starting index of items array
 * @param {number} indexEnd End index of items array
 * @async
 */
async function bulkCreateDungeonPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= DUNGEONS.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= DUNGEONS.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.dungeons[i], createDungeonPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for dungeon: ${wikiPageNames.dungeons[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}

/**
 * @description Overwrites/creates each combat area page
 * @param {number} indexStart Starting index of items array
 * @param {number} indexEnd End index of items array
 * @async
 */
async function bulkCreateSpellPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= SPELLS.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= SPELLS.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.spells[i], createSpellPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for spell: ${wikiPageNames.spells[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}

/**
 * Bulk Creates individual prayer pages
 * @param {Number} indexStart Starting index of PRAYER array
 * @param {Number} indexEnd End index of PRAYER
 * @async
 */
async function bulkCreatePrayerPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= PRAYER.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= PRAYER.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.prayers[i], createPrayerPageContent(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for prayer: ${wikiPageNames.prayers[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}
/**
 * Bulk creates individual theiving target pages
 * @param {Number} indexStart Starting index of thievingNPC
 * @param {Number} indexEnd End index of thievingNPC
 * @async
 */
async function bulkCreateThievingPages(indexStart, indexEnd) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;
  if (indexStart < 0 || indexStart >= thievingNPC.length) {
    console.log('Bad start index');
    return;
  }
  if (indexEnd < indexStart || indexEnd >= thievingNPC.length) {
    console.log('Bad end index');
    return;
  }

  let i = indexStart;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${indexEnd - indexStart + 1} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(wikiPageNames.thievingTarget[i], createThievingTargetPage(i), 'Page automatically generated by MelvorWikiBot.', csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page for prayer: ${wikiPageNames.thievingTarget[i]} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (indexEnd + 1)) {
      pagesCreated = true;
    }
  }
  if (pagesCreated) {
    console.log(`${indexEnd - indexStart + 1} Pages succesfully created.`);
  } else {
    console.log('Pages have failed to be created.');
  }
  imageUploadInProgress = false;
}
/**
 * Bulk creates individual upgrades pages
 * @async
 */
async function bulkCreateUpgradePages() {
  const pageData = [];
  for (let i = 1; i < tiers.length; i++) {
    pageData.push({
      name: wikiPageNames.axeUpgrades[i],
      content: createUpgradePageContent(fillAxeUpgradeTemplate(i)),
    });
    pageData.push({
      name: wikiPageNames.pickUpgrades[i],
      content: createUpgradePageContent(fillPickUpgradeTemplate(i)),
    });
    pageData.push({
      name: wikiPageNames.rodUpgrades[i],
      content: createUpgradePageContent(fillRodUpgradeTemplate(i)),
    });
  }
  for (let i = 0; i < cookingFireData.length; i++) {
    pageData.push({
      name: wikiPageNames.fireUpgrades[i],
      content: createUpgradePageContent(fillFireUpgradeTemplate(i)),
    });
  }
  for (let i = 0; i < autoEatData.length; i++) {
    pageData.push({
      name: wikiPageNames.eatUpgrades[i],
      content: createUpgradePageContent(fillEatUpgradeTemplate(i)),
    });
  }
  for (let i = 0; i < godUpgradeData.length; i++) {
    pageData.push({
      name: wikiPageNames.godUpgrades[i],
      content: createUpgradePageContent(fillGodUpgradeTemplate(i)),
    });
  }
  bulkCreatePages(pageData);
}

/**
 * Bulk creates invididual god upgrade pages
 * @async
 */
async function createGodUpgradePages() {
  const pageData = [];
  for (let i = 0; i < godUpgradeData.length; i++) {
    pageData.push({
      name: wikiPageNames.godUpgrades[i],
      content: createUpgradePageContent(fillGodUpgradeTemplate(i)),
    });
  }
  bulkCreatePages(pageData);
}
/**
 * Bulk creates table templates contained in the master table. Will overwrite
 * @async
 */
async function bulkCreateTableTemplates() {
  const pageData = [];
  for (let i = 0; i < masterTable.length; i++) {
    if (masterTable[i].isPageContent != true) {
      pageData.push({
        name: `Template:${masterTable[i].name}`,
        content: createTableTemplatePage(masterTable[i].generate()),
      });
    }
  }
  // Add Loot Tables
  for (let i = 0; i < openableItems.length; i++) {
    pageData.push({
      name: `Template:${items[openableItems[i]].name}LootTable`,
      content: createTableTemplatePage(createChestDropTable(openableItems[i])),
    });
  }
  bulkCreatePages(pageData, true);
}

/**
 * Bulk creates item source templates for each item. Will overwrite
 * @async
 */
async function bulkCreateItemSourceTemplates() {
  const pageData = [];
  for (let i = 0; i < items.length; i++) {
    pageData.push({
      name: `Template:${items[i].name} Sources`,
      content: createItemSourceTemplatePage(i),
    });
  }
  bulkCreatePages(pageData, true);
}

/**
 * Bulk creates pages
 * @param {Array} pageData Array containing which pages to create, and their content
 * @param {Boolean} overwrite Creation should overwrite existing pages
 */
async function bulkCreatePages(pageData, overwrite = false) {
  if (imageUploadInProgress) {
    console.log('An upload job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesCreated = false;
  const maxUploadAttempts = 10;
  let validToken = false;
  let csrftoken;

  let i = 0;
  let pageUploadAttempts = 0;
  console.log(`Starting page creation process for ${pageData.length} pages.`);
  while (!pagesCreated) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await createWikiPage(pageData[i].name, pageData[i].content, 'Page automatically generated by MelvorWikiBot.', csrftoken, overwrite);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page creation.');
        break;
      }
    } else {
      console.log(`Page: ${pageData[i].name} has been created.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (pageData.length)) {
      pagesCreated = true;
    }
  }
  imageUploadInProgress = false;
  if (pagesCreated) {
    console.log(`${pageData.length} Pages succesfully created.`);
    return true;
  } else {
    console.log('Pages have failed to be created.');
    return false;
  }
}

/**
 * Bulk edits pages
 * @param {Array} pageData Array containing which pages to edit, and the new content
 * @param {String} editSummary Summary text for each edit
 */
async function bulkEditPages(pageData, editSummary) {
  if (imageUploadInProgress) {
    console.log('An edit job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesEdited = false;
  const maxUploadAttempts = 1;
  let validToken = false;
  let csrftoken;

  let i = 0;
  let pageUploadAttempts = 0;
  console.log(`Starting page editing process for ${pageData.length} pages.`);
  while (!pagesEdited) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await editWikiPage(pageData[i].name, pageData[i].content, editSummary, csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page edit.');
        break;
      }
    } else {
      console.log(`Page: ${pageData[i].name} has been edited.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (pageData.length)) {
      pagesEdited = true;
    }
  }
  imageUploadInProgress = false;
  if (pagesEdited) {
    console.log(`${pageData.length} Pages succesfully edited.`);
    return true;
  } else {
    console.log('Pages have failed to edited.');
    return false;
  }
}

/**
 * Bulk edits the sections on pages
 * @param {Array} pageData Array containing which pages and sections to edit, and the new section content
 * @param {String} editSummary Summary text for each edit
 */
async function bulkEditPageSections(pageData, editSummary) {
  if (imageUploadInProgress) {
    console.log('An edit job is already in progress.');
    return;
  }
  imageUploadInProgress = true;
  let pagesEdited = false;
  const maxUploadAttempts = 1;
  let validToken = false;
  let csrftoken;

  let i = 0;
  let pageUploadAttempts = 0;
  console.log(`Starting page editing process for ${pageData.length} pages.`);
  while (!pagesEdited) {
    // Get new token if it is bad
    if (!validToken) {
      console.log('Requesting new CRSF token.');
      csrftoken = await getCsrfToken();
      validToken = true;
    }
    if (pageUploadAttempts >= maxUploadAttempts) {
      imageUploadInProgress = false;
      console.error('Maximum upload attempts reached.');
      break;
    }
    // Attempt to upload the current imageIndex
    pageUploadAttempts++;
    const uploadResults = await editWikiPageSection(pageData[i].name, pageData[i].section, pageData[i].content, editSummary, csrftoken);
    if (uploadResults.error) {
      const errorCode = uploadResults.error.code;
      if (errorCode == 'badtoken') {
        console.log('CRSF Token has expired.');
        validToken = false;
      } else {
        console.log('Unknown error detected:');
        console.log(uploadResults.error);
        imageUploadInProgress = false;
        console.error('Unknown error occured during page edit.');
        break;
      }
    } else {
      console.log(`Page: ${pageData[i].name} has been edited.`);
      pageUploadAttempts = 0;
      i++;
    }
    if (i == (pageData.length)) {
      pagesEdited = true;
    }
  }
  imageUploadInProgress = false;
  if (pagesEdited) {
    console.log(`${pageData.length} Pages succesfully edited.`);
    return true;
  } else {
    console.log('Pages have failed to edited.');
    return false;
  }
}
