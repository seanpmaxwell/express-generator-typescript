import type { ISOString } from '@src/common/utils/date-utils';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

export interface Entity {
  id: string; // @PK
  created: ISOString; // @audit
}
