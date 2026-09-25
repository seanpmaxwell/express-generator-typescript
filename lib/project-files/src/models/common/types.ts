import { ISOString } from '@src/common/types/primitive-alts';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export interface Entity {
  id: string; // @PK
  created: ISOString; // @audit
}
