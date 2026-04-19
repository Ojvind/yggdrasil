import { PubSub } from 'graphql-subscriptions';

import * as BOOK_EVENTS from './book';

export const EVENTS = {
  BOOK: BOOK_EVENTS,
};

export default new PubSub();
