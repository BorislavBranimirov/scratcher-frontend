import { schema } from 'normalizr';
import { Scratch } from './types';

export const scratchEntity = new schema.Entity<Scratch>('scratches');
