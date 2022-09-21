# dcp-sort
A distributed sorting algorithm using the [Distributive Compute Protocol](https://dcp.dev) (DCP).

Originally written in 2021 as a tutorial to demonstrate DCP to universities, hackathons, and new DCP users. The tutorials can still be found for [Node](https://docs.dcp.dev/tutorials/node/dcp-sort.html) and [Web](https://docs.dcp.dev/tutorials/web/dcp-sort.html). It has since been refactored slightly to improve usability and make testing easier. 

## Summary
The algorithm is designed to leverage a large parallel system to potentially accelerate sorting. To do this, the data is first split into chunks. Then, each chunk is sent to a "Worker" on the parallel compute network to be sorted. This step is done in parallel across multiple workers. Finally, when each chunk has been sorted, a greedy merging algorithm combines the sorted chunks to create the final sorted dataset. 
- (Optional) Generate numbers to sort
    - Can be replaced with a real dataset
- Split input into chunks
- Sort each chunk in parallel on DCP Workers
- Merge the chunks
    - Compare the first (lowest) element of each chunk, add the lowest to the output set and pop it from its chunk
    - Repeat until the chunks are all empty
- (Optional) Validate output to ensure everything is sorted

## Usage


## Time and Space Complexity Analysis