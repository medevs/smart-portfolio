import type { Plot } from "./types";

/**
 * Where each catalog item sits on the ground grid.
 * Row 0 is the horizon; higher rows paint in front.
 * Move a building by changing col/row. Add a product by adding a row here.
 * `sponsorable` marks plots a future "help build" pass can claim.
 * The ReelStyles barn is not sponsorable.
 */
export const plots: Plot[] = [
  { id: "tree-1", itemId: "tree", col: 0, row: 0, cols: 1, rows: 2, sponsorable: true },
  { id: "tree-2", itemId: "blossom", col: 2, row: 0, cols: 1, rows: 2, sponsorable: true },
  { id: "tree-3", itemId: "tree", col: 1, row: 1, cols: 1, rows: 2, sponsorable: true },
  { id: "tree-4", itemId: "blossom", col: 3, row: 1, cols: 1, rows: 2, sponsorable: true },
  { id: "greenhouse", itemId: "greenhouse", col: 4, row: 2, cols: 2, rows: 2, sponsorable: true },

  { id: "windmill", itemId: "windmill", col: 20, row: 0, cols: 2, rows: 3 },
  { id: "water-tower", itemId: "water-tower", col: 22, row: 1, cols: 2, rows: 3 },

  { id: "about", itemId: "about", col: 5, row: 2, cols: 4, rows: 2 },
  { id: "reelstyles", itemId: "reelstyles", col: 10, row: 2, cols: 5, rows: 2, sponsorable: false },
  { id: "mentorclone", itemId: "mentorclone", col: 15, row: 1, cols: 2, rows: 3 },
  { id: "talkthedoc", itemId: "talkthedoc", col: 17, row: 2, cols: 3, rows: 2 },

  { id: "coop", itemId: "coop", col: 0, row: 3, cols: 2, rows: 2 },
  { id: "crops", itemId: "crops", col: 0, row: 5, cols: 3, rows: 1, sponsorable: true },
  { id: "pond", itemId: "pond", col: 3, row: 4, cols: 3, rows: 2, sponsorable: true },
  { id: "wheat", itemId: "wheat", col: 8, row: 4, cols: 4, rows: 2, sponsorable: true },
  { id: "youtube", itemId: "youtube", col: 9, row: 5, cols: 2, rows: 2 },

  { id: "chicken-1", itemId: "chicken", col: 1, row: 6, animDelay: 0, sponsorable: true },
  { id: "chicken-2", itemId: "hen", col: 2, row: 6, flip: true, animDelay: 0.4, sponsorable: true },
  { id: "chicken-3", itemId: "chicken", col: 1, row: 5, animDelay: 0.8, sponsorable: true },
  { id: "cat", itemId: "cat", col: 6, row: 5, animDelay: 0.2, sponsorable: true },
  { id: "dog", itemId: "dog", col: 7, row: 5, animDelay: 0.15 },

  { id: "cow-1", itemId: "cow", col: 12, row: 5, cols: 2, rows: 2, sponsorable: true },
  { id: "cow-2", itemId: "cow", col: 14, row: 6, cols: 2, rows: 2, flip: true, animDelay: 0.6, sponsorable: true },
  { id: "sheep-1", itemId: "sheep", col: 13, row: 6, animDelay: 0.3, sponsorable: true },
  { id: "sheep-2", itemId: "sheep", col: 16, row: 5, flip: true, animDelay: 0.7, sponsorable: true },
  { id: "tractor", itemId: "tractor", col: 11, row: 6, cols: 2, rows: 1 },
  { id: "hay", itemId: "hay", col: 16, row: 6, sponsorable: true },

  { id: "mailbox", itemId: "mailbox", col: 5, row: 6 },
  { id: "journal", itemId: "journal", col: 4, row: 6 },
  { id: "dailyway", itemId: "dailyway", col: 18, row: 5, cols: 2, rows: 2 },

  { id: "flower", itemId: "flower", col: 3, row: 6 },
  { id: "fence-post", itemId: "fence-post", col: 10, row: 7 },
  { id: "named-animal", itemId: "named-animal", col: 15, row: 7 },
  { id: "plot", itemId: "plot", col: 8, row: 7 },

  { id: "fence-1", itemId: "fence", col: 11, row: 7, cols: 2, rows: 1 },
  { id: "fence-2", itemId: "fence", col: 13, row: 7, cols: 2, rows: 1 },
  { id: "fence-3", itemId: "fence", col: 6, row: 7, cols: 2, rows: 1 },
];
