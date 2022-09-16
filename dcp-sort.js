/*
 * DCP-SORT
 * A distributed sorting algorithm, designed to sort large sets of numbers leveraging a massively parallel system, the Distributed Compute Protocol (DCP).
 * It works by splitting the dataset into chunks of roughly equal sizes, and performing the default sort (usually TimSort) on each chunk in parallel on
 * other machines (using DCP). The returning sorted chunks can then be merged greedily to create a large sorted list. Time and space complexity analysis will
 * be included in the README
 * 
 * Author: Connor Crowe
 * Date: December 2021
*/
