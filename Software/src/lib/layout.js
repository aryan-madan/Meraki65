export const U = 54;
export const GAP = 6;
export const TOTAL_COLUMNS = 16;

export const LAYER_META = [
  { id: 0, name: 'Win Base', short: 'WB' },
  { id: 1, name: 'Win Fn', short: 'WF' },
  { id: 2, name: 'Mac Base', short: 'MB' },
  { id: 3, name: 'Mac Fn', short: 'MF' },
];

export const MATRIX_LAYOUT = [
  [
    { legend: 'Esc', matrix: [0, 0], x: 0, w: 1 },
    { legend: '1', shifted: '!', matrix: [0, 1], x: 1, w: 1 },
    { legend: '2', shifted: '@', matrix: [0, 2], x: 2, w: 1 },
    { legend: '3', shifted: '#', matrix: [0, 3], x: 3, w: 1 },
    { legend: '4', shifted: '$', matrix: [0, 4], x: 4, w: 1 },
    { legend: '5', shifted: '%', matrix: [0, 5], x: 5, w: 1 },
    { legend: '6', shifted: '^', matrix: [0, 6], x: 6, w: 1 },
    { legend: '7', shifted: '&', matrix: [0, 7], x: 7, w: 1 },
    { legend: '8', shifted: '*', matrix: [0, 8], x: 8, w: 1 },
    { legend: '9', shifted: '(', matrix: [0, 9], x: 9, w: 1 },
    { legend: '0', shifted: ')', matrix: [0, 10], x: 10, w: 1 },
    { legend: '-', shifted: '_', matrix: [0, 11], x: 11, w: 1 },
    { legend: '=', shifted: '+', matrix: [0, 12], x: 12, w: 1 },
    { legend: '\\', shifted: '|', matrix: [0, 13], x: 13, w: 1 },
    { legend: '`', shifted: '~', matrix: [0, 14], x: 14, w: 1 },
  ],
  [
    { legend: 'Tab', matrix: [1, 0], x: 0, w: 1.5 },
    { legend: 'Q', matrix: [1, 1], x: 1.5, w: 1 },
    { legend: 'W', matrix: [1, 2], x: 2.5, w: 1 },
    { legend: 'E', matrix: [1, 3], x: 3.5, w: 1 },
    { legend: 'R', matrix: [1, 4], x: 4.5, w: 1 },
    { legend: 'T', matrix: [1, 5], x: 5.5, w: 1 },
    { legend: 'Y', matrix: [1, 6], x: 6.5, w: 1 },
    { legend: 'U', matrix: [1, 7], x: 7.5, w: 1 },
    { legend: 'I', matrix: [1, 8], x: 8.5, w: 1 },
    { legend: 'O', matrix: [1, 9], x: 9.5, w: 1 },
    { legend: 'P', matrix: [1, 10], x: 10.5, w: 1 },
    { legend: '[', shifted: '{', matrix: [1, 11], x: 11.5, w: 1 },
    { legend: ']', shifted: '}', matrix: [1, 12], x: 12.5, w: 1 },
    { legend: 'Bspc', matrix: [1, 13], x: 13.5, w: 1.5 },
    { legend: 'PgUp', matrix: [1, 14], x: 15, w: 1 },
  ],
  [
    { legend: 'Ctrl', matrix: [2, 0], x: 0, w: 1.75 },
    { legend: 'A', matrix: [2, 1], x: 1.75, w: 1 },
    { legend: 'S', matrix: [2, 2], x: 2.75, w: 1 },
    { legend: 'D', matrix: [2, 3], x: 3.75, w: 1 },
    { legend: 'F', matrix: [2, 4], x: 4.75, w: 1 },
    { legend: 'G', matrix: [2, 5], x: 5.75, w: 1 },
    { legend: 'H', matrix: [2, 6], x: 6.75, w: 1 },
    { legend: 'J', matrix: [2, 7], x: 7.75, w: 1 },
    { legend: 'K', matrix: [2, 8], x: 8.75, w: 1 },
    { legend: 'L', matrix: [2, 9], x: 9.75, w: 1 },
    { legend: ';', shifted: ':', matrix: [2, 10], x: 10.75, w: 1 },
    { legend: "'", shifted: '"', matrix: [2, 11], x: 11.75, w: 1 },
    { legend: 'Enter', matrix: [2, 12], x: 12.75, w: 2.25 },
    { legend: 'PgDn', matrix: [2, 13], x: 15, w: 1 },
  ],
  [
    { legend: 'Shift', matrix: [3, 0], x: 0, w: 2.25 },
    { legend: 'Z', matrix: [3, 1], x: 2.25, w: 1 },
    { legend: 'X', matrix: [3, 2], x: 3.25, w: 1 },
    { legend: 'C', matrix: [3, 3], x: 4.25, w: 1 },
    { legend: 'V', matrix: [3, 4], x: 5.25, w: 1 },
    { legend: 'B', matrix: [3, 5], x: 6.25, w: 1 },
    { legend: 'N', matrix: [3, 6], x: 7.25, w: 1 },
    { legend: 'M', matrix: [3, 7], x: 8.25, w: 1 },
    { legend: ',', shifted: '<', matrix: [3, 8], x: 9.25, w: 1 },
    { legend: '.', shifted: '>', matrix: [3, 9], x: 10.25, w: 1 },
    { legend: '/', shifted: '?', matrix: [3, 10], x: 11.25, w: 1 },
    { legend: 'Shift', matrix: [3, 11], x: 12.25, w: 1.75 },
    { legend: '↑', matrix: [3, 12], x: 14, w: 1 },
    { legend: 'Ins', matrix: [3, 13], x: 15, w: 1 },
  ],
  [
    { legend: 'Fn', matrix: [4, 0], x: 0, w: 1.5 },
    { legend: 'Cmd', matrix: [4, 1], x: 2.5, w: 1.5 },
    { legend: 'Space', matrix: [4, 2], x: 4, w: 7 },
    { legend: 'Cmd', matrix: [4, 3], x: 11, w: 1.5 },
    { legend: '←', matrix: [4, 4], x: 13, w: 1 },
    { legend: '↓', matrix: [4, 5], x: 14, w: 1 },
    { legend: '→', matrix: [4, 6], x: 15, w: 1 },
  ],
];

const GROUPS = [
  {
    name: 'Alphas',
    options: [
      ['A', 0x0004], ['B', 0x0005], ['C', 0x0006], ['D', 0x0007], ['E', 0x0008], ['F', 0x0009],
      ['G', 0x000a], ['H', 0x000b], ['I', 0x000c], ['J', 0x000d], ['K', 0x000e], ['L', 0x000f],
      ['M', 0x0010], ['N', 0x0011], ['O', 0x0012], ['P', 0x0013], ['Q', 0x0014], ['R', 0x0015],
      ['S', 0x0016], ['T', 0x0017], ['U', 0x0018], ['V', 0x0019], ['W', 0x001a], ['X', 0x001b],
      ['Y', 0x001c], ['Z', 0x001d],
    ],
  },
  {
    name: 'Numbers',
    options: [
      ['1', 0x001e], ['2', 0x001f], ['3', 0x0020], ['4', 0x0021], ['5', 0x0022],
      ['6', 0x0023], ['7', 0x0024], ['8', 0x0025], ['9', 0x0026], ['0', 0x0027],
    ],
  },
  {
    name: 'Punctuation',
    options: [
      ['-', 0x002d], ['=', 0x002e], ['[', 0x002f], [']', 0x0030], ['\\', 0x0031],
      [';', 0x0033], ["'", 0x0034], ['`', 0x0035], [',', 0x0036], ['.', 0x0037], ['/', 0x0038],
    ],
  },
  {
    name: 'Modifiers',
    options: [
      ['Ctrl', 0x00e0], ['Shift', 0x00e1], ['Alt', 0x00e2], ['Cmd', 0x00e3],
      ['RCtrl', 0x00e4], ['RShift', 0x00e5], ['RAlt', 0x00e6], ['RCmd', 0x00e7],
      ['Caps', 0x0039], ['Fn', 0x7e01], ['OS Toggle', 0x7e00],
    ],
  },
  {
    name: 'Editing',
    options: [
      ['Esc', 0x0029], ['Tab', 0x002b], ['Enter', 0x0028], ['Space', 0x002c], ['Bspc', 0x002a],
      ['Delete', 0x004c], ['Insert', 0x0049], ['Home', 0x004a], ['End', 0x004d], ['PgUp', 0x004b], ['PgDn', 0x004e],
    ],
  },
  {
    name: 'Arrows',
    options: [
      ['←', 0x0050], ['→', 0x004f], ['↑', 0x0052], ['↓', 0x0051],
    ],
  },
  {
    name: 'Function',
    options: [
      ['F1', 0x003a], ['F2', 0x003b], ['F3', 0x003c], ['F4', 0x003d], ['F5', 0x003e], ['F6', 0x003f],
      ['F7', 0x0040], ['F8', 0x0041], ['F9', 0x0042], ['F10', 0x0043], ['F11', 0x0044], ['F12', 0x0045],
      ['Boot', 0x7e02],
    ],
  },
  {
    name: 'Media',
    options: [
      ['Mute', 0x00a8], ['Vol+', 0x00a9], ['Vol-', 0x00aa], ['Play', 0x00ae], ['Next', 0x00ab], ['Prev', 0x00ac],
    ],
  },
  {
    name: 'Layer',
    options: [
      ['Trans', 0x0001], ['No', 0x0000],
    ],
  },
];

export const KEYCODE_GROUPS = GROUPS;

export const KEYCODE_LABELS = Object.fromEntries(
  GROUPS.flatMap((group) => group.options.map(([label, keycode]) => [keycode, label]))
);

export function getKeyLabel(keycode) {
  if (keycode in KEYCODE_LABELS) {
    return KEYCODE_LABELS[keycode];
  }

  if (keycode >= 0x0004 && keycode <= 0x001d) {
    return String.fromCharCode('A'.charCodeAt(0) + keycode - 0x0004);
  }

  return `0x${keycode.toString(16).toUpperCase().padStart(4, '0')}`;
}

export function getPhysicalKey(row, col) {
  return MATRIX_LAYOUT.flat().find((key) => key.matrix[0] === row && key.matrix[1] === col) ?? null;
}
