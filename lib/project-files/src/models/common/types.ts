export interface Entity {
  id: number; // @PK
  created: Date | string; // @audit
}
