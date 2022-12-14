/**
 * DCP-SORT
 * @file    dcp-sort.js
 * 
 *          Originally written as a tutorial to demonstrate the Distributed Compute Protocol (DCP) in 2021 on docs.dcp.dev
 *          A distributed sorting algorithm, designed to sort large sets of numbers leveraging a massively parallel system, DCP.
 *          It works by splitting the dataset into chunks of roughly equal sizes, and performing the default sort (usually TimSort) on each chunk in parallel on
 *          other machines (using DCP). The returning sorted chunks can then be merged greedily to create a large sorted list. Time and space complexity analysis will
 *          be included in the README
 * 
 * @author  Connor Crowe, connorthecrowe@gmail.com
 * @date    September 2022
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

/* MERGE CHUNKS
 * Takes sorted chunks and greedily combines them to return one sorted array */
function mergeChunks(arr)
{
    const sorted = []
    while(arr.length) 
    {
        let currentChunk = arr[0];
        let bestChunkIndex = 0;
        let bestValue = currentChunk[0];

        for (let i = 0; i < arr.length; i += 1)
        {
            currentChunk = arr[i];
            if (currentChunk[0] < bestValue)
            {
                [ bestValue ] = currentChunk;
                bestChunkIndex = i;
            }
        }

        sorted.push(arr[bestChunkIndex].shift());
        if (arr[bestChunkIndex].length === 0) arr.splice(bestChunkIndex, 1);
    }
    return sorted;
}

/* VALIDATE ORDER 
 * Runs through the resulting array and confirms sorted order */
function validateOrder(arr) 
{
    for (let i = 1; i < arr.length; i += 1)
    {
        if (arr[i] < arr[i-1]) return false;
    }
    return true;
}

/* MAIN
 * Generate input (or provide one), split it, then use dcp-client to run the work function on the chunks. Finally, merge the chunks and test the output. */
async function main() 
{
    const compute = require('dcp/compute');
    const config = require('./config').init();

    // Create input
    let inputSet = splitInput(generateInput(config.chunks*config.perChunk, config.maxIntGenerated), config.chunks);

    const job = compute.for(inputSet, distributedWorkFunction);
    const timeStart = Date.now()
    job.public.name = 'DCP-SORT'
    //job.computeGroups = [{}]; //

    job.on('accepted', () => {
        timeAccepted = Date.now()
        console.log(`${Math.round((Date.now() - timeStart) / 100) /10}s\tJob Accepted, beginning distributed sorting. Id: ${job.id}`)
    })

    let resultSet = await job.exec();
    resultSet = Array.from(resultSet);
    timeSorted = Date.now()
    console.log(`${Math.round((Date.now() - timeStart) / 100) /10}s\tParallel sorting of chunks complete, beginning merging`);

    resultSet = mergeChunks(resultSet);
    timeMerged = Date.now()
    console.log(`${Math.round((Date.now() - timeStart) / 100) /10}s\tMerging chunks complete. ${config.validateResults ? 'Validating...' : 'Skipping validation (config)'}`);

    if (config.validatedResults)
    {
        if (validateOrder(resultSet)){
            console.log(`${Math.round((Date.now() - timeStart) / 100) /10}s\tSort order validated. All done!`)
        } else console.error('ERROR: Numbers not properly sorted! Something is wrong.')
    }
    
    console.log(`~~~\nFINISHED\nNumbers:\t${config.chunks*config.perChunk}\tChunks:${config.chunks}\nAcceptance:\t${(timeAccepted-timeStart)/1000}\nSorting:\t${(timeSorted-timeAccepted)/1000}\nMerging:\t${(timeMerged-timeSorted)/1000}`);
}

require('dcp-client')
  .init('https://scheduler.distributed.computer')
  .then(main)
  .catch(console.error)
  .finally(process.exit);