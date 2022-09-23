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
*Draft:*
Assume that it is not necessary to generate input (that is, you already have data you wish to sort). Also assume that it is not necessary to validate the sorted output (since you trust the algorithm, and this is `O(n)` anyway).

There is then complexity in three steps:
1. The splitting of the input data into chunks
2. The parallel sorting of chunks
3. The non-parallel merging of chunks

Here are some terms to be used:
- `n` = the total number of items to be sorted from the input data
- `c` = the number of chunks that the input is split into
- `m` = `n` / `c` or `input` / `chunks`, the number of items to be sorted in a given chunk
- `w` = the number of parallel DCP Workers able to sort a chunk when the job is initiated

### Time Complexity
#### 1. Splitting input into chunks
Each element in the input only needs to be operated on once to assign it to a chunk.
```
O(c) + O(n)
= O(n)
```

#### 2. Parallel sorting into chunks
This part is trickier since it is done in parallel across multiple DCP Workers. First, consider one worker - the complexity would be `O(nlogn)`. Then, consider a number of workers equal to the number of chunks. Each chunk would go to one worker, they would all run at the same time, and complete at roughly the same time. The complexity would be `O(mlogm)`. (Note: see definition of `m` above).

However, if the number of workers can't be assumed, then it must factor in. Consider 4 chunks, and 2 workers. The first two chunks would complete in `O(mlogm)` time, then the next two would as well. This makes our time `2 * O(mlogm)`. More generally, the time is affected by the ratio of chunks to workers. This makes it `O((c/w) mlogm)`, but since `m=n/c`, it becomes: `O((c/w)(n/c)log(n/c))`.

Simplifying the above, we get:
```
O(nlogm / w)
```

#### 3. Merging the Chunks
To merge the chunks we examine the top of each one and pop the lowest into the sorted output. In worst case, the lowest number is in the last chunk searched every time (`n` times). 
```
O((search chunks) * n) 
= O(cn)
```

#### Total Time Complexity
```
O(splitting) + O(sorting) + O(merging)  
= O(n) + O(nlogm / w) + O(cn)
```
So which is the worse term? Increasing the number of workers available (to a maximum of `w = c`) decreases the sort term. Increasing the number of chunks actually decreases the sort term slightly, but has a larger impact on increasing the merge term. 

In the typical case (many workers, `c ≈ w`), the merge term is longer than the sort term, except for ludicrously high numbers of items to be sorted in the input set.
> For `w = c = 5`, the two terms' complexities intersect at `n = 5 * E25`)

**This makes total time complexity is `O(nlogm / w) + O(cn)`, with `O(cn)` representing the average case.**