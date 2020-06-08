//Fetch implementation of wiki api
/// <reference path="bulkOperations.js" />
/// <reference path="commonElements.js" />
/// <reference path="keyFormatters.js" />
/// <reference path="main.js" />
/// <reference path="pageGenerators.js" />
/// <reference path="selectionFunctions.js" />
/// <reference path="sortFunctions.js" />
/// <reference path="tableMakers.js" />
/// <reference path="templateFillers.js" />
/// <reference path="uiCallbacks.js" />

//Basic API Calls
async function getFullWikiPage(pageTitle) {
    let params = {
        origin: '*',
        action: 'parse',
        page: pageTitle,
        prop: 'wikitext',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    // console.log(`Requesting wikitext for Page: ${pageTitle}`);
    let data = await response.json();

    let output = { text: '', success: false, error: '' };
    try {
        output.text = data.parse.wikitext['*'];
        output.success = true;
    } catch {
        output.error = data.error.info;
        console.warn(`Could not get wikitext for Page: ${pageTitle}.`)
    }
    return output;
}

async function getWikiHTMLFromTitle(pageID) {
    let params = {
        origin: '*',
        action: 'parse',
        page: pageTitle,
        prop: 'wikitext',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    // console.log(`Requesting wikitext for Page: ${pageTitle}`);
    let data = await response.json();

    let output = { text: '', success: false, error: '' };
    try {
        output.text = data.parse.wikitext['*'];
        output.success = true;
    } catch {
        output.error = data.error.info;
        console.warn(`Could not get wikitext for Page: ${pageTitle}.`)
    }
    return output;
}
async function getWikiPageSection(pageTitle, pageSection = 0) {
    let params = {
        origin: '*',
        action: 'parse',
        page: pageTitle,
        section: pageSection,
        prop: 'wikitext',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    //console.log(`Requesting wikitext for Page: ${pageTitle}, Section: ${pageSection}`);
    let data = await response.json();
    try {
        return data.parse.wikitext['*'];
    } catch {
        throw ('Could not get wikitext: ' + data.error.info)
    }
}

async function getPageSections(pageTitle) {
    let params = {
        origin: '*',
        action: 'parse',
        page: pageTitle,
        prop: 'sections',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    let data = await response.json();
    console.log(`Requesting sections for Page: ${pageTitle}`);
    try {
        return data.parse.sections;
    } catch {
        throw ('Could not get page sections: ' + data.error.info);
    }
}

async function getLastRevisions(pageTitle, maxRev) {
    let params = {
        origin: '*',
        action: 'query',
        prop: 'revisions',
        titles: pageTitle,
        rvslots: '*',
        rvlimit: maxRev,
        rvprop: 'timestamp|user|comment|ids',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    let data = await response.json();
    console.log(`Requesting last revision for Page: ${pageTitle}`);
    try {
        let revisions;
        let pages = data.query.pages;
        Object.keys(pages).forEach(pageID => { revisions = pages[pageID].revisions; })
        console.log(revisions);
        return revisions;
    } catch {
        throw ('Could not get page sections: ' + data.error.info);
    }
}

/**
 * @description Requests the members of a category that are pages
 * @param {String} categoryName The name of the category, does not include Category:
 */
async function getCategoryPageMembers(categoryName) {
    let params = {
        origin: '*',
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${categoryName}`,
        cmprop: 'ids|title',
        cmtype: 'page',
        cmlimit: 'max',
        format: 'json'
    };
    let endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    let data = await response.json();
    console.log(`Requesting pages in Category:${categoryName}`);
    try {
        let pages = data.query.categorymembers;
        return pages;
    } catch {
        throw (`Could not get get Category:${categoryName}.` + data.error.info);
    }
}


async function getLoginToken() {
    var params = {
        action: 'query',
        meta: 'tokens',
        type: 'login',
        format: 'json'
    };
    var endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint);
    let data = await response.json();
    console.log('Got login token');
    console.log(data.query.tokens.logintoken);
    return data.query.tokens.logintoken;
}

async function getLoginRequest(logintoken, user, pass) {
    var params = {
        action: 'login',
        format: 'json'
    };
    var loginData = {
        lgtoken: logintoken,
        lgname: user,
        lgpassword: pass
    }
    var loginData2 = createFormData(loginData);
    var endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint, {
        method: 'POST',
        body: loginData2
    });
    let data = await response.json();
    console.log(data);
}

async function getLogoutRequest(csrftoken) {
    var params = {
        action: 'logout',
        format: 'json'
    };
    var logoutData = {
        token: csrftoken
    };
    let response = await fetch(WIKURL + createQueryString(params), {
        method: 'POST',
        body: createFormData(logoutData)
    });
    let data = await response.json();
    console.log(data);
}

async function getCsrfToken() {
    var params = {
        action: 'query',
        meta: 'tokens',
        format: 'json'
    };
    let response = await fetch(WIKURL + createQueryString(params));
    let data = await response.json();
    try {
        return data.query.tokens.csrftoken;
    } catch {
        console.error('Could not obtain CRSF token');
    }
}

async function getRollBackToken() {
    var params = {
        action: 'query',
        meta: 'tokens',
        type: 'rollback',
        format: 'json'
    };
    let response = await fetch(WIKURL + createQueryString(params));
    let data = await response.json();
    try {
        return data.query.tokens.rollbacktoken;
    } catch {
        console.error('Could not obtain rollback token');
    }
}

/**
 * @description Attempts to upload an image to the wiki via url
 * @param {string} imageFileName The name of the file
 * @param {string} imageText The text to attach to the image
 * @param {string} imageURL The URL of the image
 * @param {string} csrfToken A valid csrfToken
 */
async function uploadImageFromUrlViaUrl(imageFileName, imageText, imageURL, csrfToken) {
    var params = {
        action: 'upload',
        format: 'json'
    };
    var imageData = {
        filename: imageFileName,
        comment: 'Automatically uploaded',
        text: imageText,
        url: imageURL,
        token: csrfToken
    }
    var imageForm = createFormData(imageData);
    var endpoint = WIKURL + createQueryString(params);
    let response = await fetch(endpoint, {
        method: 'POST',
        body: imageForm
    });
    let data = await response.json();
    console.log(data);
}

async function uploadImageFromUrlViaBlob(imageFileName, imageText, fileURL, token) {
    //Get the file as a blob from the URL
    let imageBlob = await fetch(fileURL).then(r => r.blob());
    //Generate the request data
    var params = {
        action: 'upload',
        format: 'json'
    };
    //Create form data and append values
    var imageForm = new FormData();
    imageForm.append('filename', imageFileName);
    imageForm.append('ignorewarnings', '1');
    imageForm.append('comment', 'Automatically uploaded by MelvorWikiBot');
    imageForm.append('text', imageText);
    imageForm.append('token', token);
    imageForm.append('file', imageBlob)
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: imageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}

async function createWikiPage(pageTitle, pageContent, editSummary, token, overWrite) {
    //Generate the request data
    var params = {
        action: 'edit',
        format: 'json'
    };
    //Create form data and append values
    var pageForm = new FormData();
    pageForm.append('title', pageTitle);
    // pageForm.append('section', '0');
    pageForm.append('text', pageContent);
    pageForm.append('summary', editSummary);
    pageForm.append('notminor', '1');
    pageForm.append('bot', '1');
    pageForm.append('recreate', '1');
    if (!overWrite) {
    pageForm.append('createonly', '1')
    }
    pageForm.append('contentformat', 'text/x-wiki');
    pageForm.append('contentmodel', 'wikitext');
    pageForm.append('token', token);
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: pageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}

async function rollBackPage(pageTitle, user, summary) {
    rollbacktoken = await getRollBackToken();
    //Generate the request data
    var params = {
        action: 'rollback',
        format: 'json'
    };
    //Create form data and append values
    var pageForm = new FormData();
    pageForm.append('title', pageTitle);
    pageForm.append('user', user);
    pageForm.append('summary', summary);
    pageForm.append('markbot', '1');
    pageForm.append('token', rollbacktoken);
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: pageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}

async function editWikiPage(pageTitle, newContent, editSummary, token) {
    //Generate the request data
    var params = {
        action: 'edit',
        format: 'json'
    };
    //Create form data and append values
    var pageForm = new FormData();
    pageForm.append('title', pageTitle);
    // pageForm.append('section', '0');
    pageForm.append('text', newContent);
    pageForm.append('summary', editSummary);
    pageForm.append('notminor', '1');
    pageForm.append('bot', '1');
    pageForm.append('nocreate', '1');
    pageForm.append('contentformat', 'text/x-wiki');
    pageForm.append('contentmodel', 'wikitext');
    pageForm.append('token', token);
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: pageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}

async function undoLastEdit(pageTitle, token, revID, undoToID) {
    //Generate the request data
    var params = {
        action: 'edit',
        format: 'json'
    };
    //Create form data and append values
    var pageForm = new FormData();
    pageForm.append('title', pageTitle);
    pageForm.append('undo', revID);
    pageForm.append('undoafter',undoToID)
    pageForm.append('summary', 'Undo bad edit.');
    pageForm.append('notminor', '1');
    pageForm.append('bot', '1');
    pageForm.append('nocreate', '1');
    pageForm.append('contentformat', 'text/x-wiki');
    pageForm.append('contentmodel', 'wikitext');
    pageForm.append('token', token);
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: pageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}

async function editWikiPageSection(pageTitle, sectionID, newContent, editSummary, token) {
    //Generate the request data
    var params = {
        action: 'edit',
        format: 'json'
    };
    //Create form data and append values
    var pageForm = new FormData();
    pageForm.append('title', pageTitle);
    pageForm.append('section', `${sectionID}`);
    pageForm.append('text', newContent);
    pageForm.append('summary', editSummary);
    pageForm.append('notminor', '1');
    pageForm.append('bot', '1');
    pageForm.append('nocreate', '1');
    pageForm.append('contentformat', 'text/x-wiki');
    pageForm.append('contentmodel', 'wikitext');
    pageForm.append('token', token);
    //Create request URL
    var endpoint = WIKURL + createQueryString(params);
    //Send the request
    let response = await fetch(endpoint, {
        method: 'POST',
        body: pageForm
    });
    //Parse the results
    let data = await response.json();
    //Log the results
    return data;
}
//API calls with output processing
/**
 * @description Searches a page for the section with the given title. Returns the matches
 * @param {string} pageTitle Title of page to search
 * @param {string} sectionTitle Title of section to search for
 */
async function getSectionIDs(pageTitle, sectionTitle) {
    let pageSections = await getPageSections(pageTitle);
    sectionIDs = [];
    for (let i = 0; i < pageSections.length; i++) {
        if (pageSections[i].line == sectionTitle) {
            sectionIDs.push(parseInt(pageSections[i].index));
        }
    }
    return sectionIDs;
}


//Support functions for fetch API
function createQueryString(params) {
    var qString = '?';
    var pKeys = Object.keys(params);
    qString += pKeys[0] + '=' + params[pKeys[0]];
    for (let i = 1; i < pKeys.length; i++) {
        qString += '&' + pKeys[i] + '=' + params[pKeys[i]];
    }
    return qString;
}

function createFormData(data) {
    var dataForm = new FormData();
    Object.keys(data).forEach(keys => { dataForm.append(keys, data[keys]) });
    return dataForm;
}