/*
 * DCP-SORT
 * @file    dcp-sort.js
 * 
 *          A distributed sorting algorithm, designed to sort large sets of numbers leveraging a massively parallel system, the Distributed Compute Protocol (DCP).
 *          It works by splitting the dataset into chunks of roughly equal sizes, and performing the default sort (usually TimSort) on each chunk in parallel on
 *          other machines (using DCP). The returning sorted chunks can then be merged greedily to create a large sorted list. Time and space complexity analysis will
 *          be included in the README
 * 
 * @author  Connor Crowe, connorthecrowe@gmail.com
 * @date    December 2021 - September 2022 (on and off)
*/

/* GENERATE INPUT 
 * Can be swapped with actual an actual data set */
function generateInput(amount, maximum)
{
    const generatedInput = [];
    for (let i = 0; i < amount; i += 1)
    {
        generatedInput.push(Math.floor(Math.random() * maximum))
    }
    return generatedInput
}

/* SPLIT INPUT
 * Splits a passed array into discrete, roughly equal chunks */
function splitInput(arr, numChunks) 
{
    const chunks = [];
    for (let i = 0; i < numChunks; i += 1) chunks[i] = [];
    for (let i = 0; i < arr.length; i += 1) chunks[i % numChunks].push(arr[i])
    return chunks
}

/* DISTRIBUTED WORK FUNCTION 
 * This is the function that runs on many workers in parallel using dcp-client. Each function sorts one chunk */
async function distributedWorkFunction(arr)
{
    progress();
    return arr.sort(function(a, b) {
        return a - b;
    });
}