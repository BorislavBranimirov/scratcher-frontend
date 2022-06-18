import { schema } from 'normalizr';
import { Scratch, User } from './types';

export const scratchEntity = new schema.Entity<Scratch>('scratches');

export const userEntity = new schema.Entity<User>('users');
