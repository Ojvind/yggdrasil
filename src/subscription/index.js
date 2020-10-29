import { PubSub } from 'apollo-server';

import * as BOOK_EVENTS from './book';

export const EVENTS = {
  BOOK: BOOK_EVENTS,
};

export default new PubSub();
