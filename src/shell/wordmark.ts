// Half-row bitmap: two rows here make one terminal row. The last column is
// empty so the offset layer of the T has a cell to land in.
const BITMAP = [
  '######...#######..######...######..######.',
  '#######..#######..######...######..######.',
  '##...##..##...##..##...##..##..##....##...',
  '#######..#######..#######..##..##....##...',
  '######...#######..#######..##..##....##...',
  '##.###...##...##..##...##..##..##....##...',
  '##..###..##...##..######...######....##...',
  '##...##..##...##..######...######....##...',
];

export const WORDMARK_WIDTH = BITMAP[0].length;

export interface ShadowPaint {
  foreground: (text: string) => string;
  background: (text: string) => string;
}

enum Half {
  Empty,
  Front,
  Shadow,
}

function halfAt(row: string, column: number): Half {
  if (row[column] === '#') return Half.Front;
  return row[column - 1] === '#' ? Half.Shadow : Half.Empty;
}

function block(top: boolean, bottom: boolean): string {
  if (top && bottom) return '█';
  if (top) return '▀';
  return bottom ? '▄' : ' ';
}

function cell(top: Half, bottom: Half, shadow: ShadowPaint | null): string {
  const front = block(top === Half.Front, bottom === Half.Front);
  const behind = block(top === Half.Shadow, bottom === Half.Shadow);
  if (!shadow || behind === ' ') return front;
  // The front layer is the default foreground, which cannot be used as a
  // background, so a cell holding both layers draws the front half as the
  // glyph and shows the shadow through the background.
  return front === ' ' ? shadow.foreground(behind) : shadow.background(front);
}

export function renderWordmark(shadow: ShadowPaint | null): string[] {
  const rows: string[] = [];
  for (let y = 0; y < BITMAP.length; y += 2) {
    let row = '';
    for (let x = 0; x < WORDMARK_WIDTH; x++) {
      row += cell(halfAt(BITMAP[y], x), halfAt(BITMAP[y + 1], x), shadow);
    }
    rows.push(row);
  }
  return rows;
}
