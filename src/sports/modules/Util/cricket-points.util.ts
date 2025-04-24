export function calculateBattingPoints(runs: number, sixes: number, notOut: boolean): number {
  let points = runs;
  points += sixes * 4;

  if (runs >= 25) points += 4;
  if (runs >= 50) points += 8;
  if (runs >= 75) points += 12;
  if (runs >= 100) points += 16;

  if (notOut) points += 12;
  return points;
}

export function calculateBowlingPoints(wickets: number, maidens: number): number {
  let points = wickets * 25;

  if (wickets >= 3) points += 4;
  if (wickets >= 4) points += 8;
  if (wickets >= 5) points += 12;

  points += maidens * 12;
  return points;
}
