// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Prisma } from '@prisma/client';

declare module '@prisma/client' {
  namespace Prisma {
    interface CategoryOrderByWithRelationInput {
      sortOrder?: Prisma.SortOrder;
    }
  }
}

export {}; 