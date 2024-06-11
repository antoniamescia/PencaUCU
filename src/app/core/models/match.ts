export interface Match {
  match_id: number;
  date: Date;
  team_local_id?: number;
  team_visitor_id?: number;
  goals_local?: number;
  goals_visitor?: number;
  championship_id?: number;
}
