/// <reference path="bulkOperations.js" />
/// <reference path="commonElements.js" />
/// <reference path="keyFormatters.js" />
/// <reference path="main.js" />
/// <reference path="pageGenerators.js" />
/// <reference path="selectionFunctions.js" />
/// <reference path="tableMakers.js" />
/// <reference path="templateFillers.js" />
/// <reference path="uiCallbacks.js" />
/// <reference path="wikiAPI.js" />

//Contains a number of functions to be used with Array.sort
/**
 * @description Sorts items by defence level requirements
 * @param {Object} item1 
 * @param {Object} item2 
 */
function sortByDefenceLevel(item1, item2) {
    var x = (item1.defenceLevelRequired == undefined) ? 0 : item1.defenceLevelRequired
    var y = (item2.defenceLevelRequired == undefined) ? 0 : item2.defenceLevelRequired
    return (x - y)
}
/**
 * @description Sorts items by ranged level requirements
 * @param {Object} item1 
 * @param {Object} item2 
 */
function sortByRangedLevel(item1, item2) {
    var x = (item1.rangedLevelRequired == undefined) ? 0 : item1.rangedLevelRequired
    var y = (item2.rangedLevelRequired == undefined) ? 0 : item2.rangedLevelRequired
    return (x - y)
}
/**
 * @description Sorts items by magic level requirements
 * @param {Object} item1 
 * @param {Object} item2 
 */
function sortByMagicLevel(item1, item2) {
    var x = (item1.magicLevelRequired == undefined) ? 0 : item1.magicLevelRequired
    var y = (item2.magicLevelRequired == undefined) ? 0 : item2.magicLevelRequired
    return (x - y)
}

/**
 * @description Sorts items by attack level requirements
 * @param {Object} item1 
 * @param {Object} item2 
 */
function sortByAttackLevel(item1, item2) {
    var x = (item1.attackLevelRequired == undefined) ? 0 : item1.attackLevelRequired
    var y = (item2.attackLevelRequired == undefined) ? 0 : item2.attackLevelRequired
    return (x - y)
}