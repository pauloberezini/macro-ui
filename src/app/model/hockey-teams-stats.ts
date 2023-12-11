export interface HockeyTeamStats {
  teamName: string;
  gamesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
  all: {
    goalsAverage: number;
    lossesAverage: number;
  };
  home: {
    goalsAverage: number;
    lossesAverage: number;
  };
  guest: {
    goalsAverage: number;
    lossesAverage: number;
  };
}
