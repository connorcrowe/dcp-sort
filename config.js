/**
 * @file        config.js
 * 
 *              Manage all configurable options for dcp-sort
 * 
 * @author      Connor Crowe
 * @date        September 2022
 */


function init() {
    return {
        chunks: 10,
        perChunk: 250,
        maxIntGenerated: 999,
        validateResults: false,
    };
}

module.exports = { init };