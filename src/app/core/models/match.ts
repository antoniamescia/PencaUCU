export interface Match {
  match_id: number;
  match_date: Date;
  team_local_id: number;
  team_visitor_id: number;
  goals_local: number;
  goals_visitor: number;
  championship_id: number;
  stage_id?: number;
  stage_name?: string;
  group_name?: string;
}
