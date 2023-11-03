export enum EventType {
  /* card */
  CommentCreated = 'comment-created',
  CardMoved = 'card-moved',
  AmountChanged = 'amount-changed',
  AttributeChanged = 'attribute-changed',
  NameChanged = 'name-changed',
  ClosedAtChanged = 'closed-at-changed',
  NextFollowUpAtChanged = 'next-follow-up-at-changed',
  NextFollowUpAtWarning = 'next-follow-up-at-warning',
  Created = 'created',
  Assigned = 'assigned',
  Deleted = 'deleted',

  /* lane */
  ForecastTotal = 'forecast-total',
  ForecastCard = 'forecast-card',
}

// TODO split event types into CardEvent and AccountEven
