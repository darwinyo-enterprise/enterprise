import { IntegrationEventLogEntry } from '../../api/model/integrationEventLogEntry';

export const IntegrationEventLogMock = [
  <IntegrationEventLogEntry>{
    orderStatus: 'order started',
    creationTime: new Date(),
    eventId: 'test',
    eventTypeName: 'test',
    state: IntegrationEventLogEntry.StateEnum.Published,
    timesSent: 1,
    content: '1',
    orderId: 1
  },
  {
    orderStatus: 'waiting validation',
    creationTime: new Date(),
    eventId: 'test',
    eventTypeName: 'test',
    state: IntegrationEventLogEntry.StateEnum.Published,
    timesSent: 1,
    content: '1',
    orderId: 1
  },
  {
    orderStatus: 'order stock checked',
    creationTime: new Date(),
    eventId: 'test',
    eventTypeName: 'test',
    state: IntegrationEventLogEntry.StateEnum.Published,
    timesSent: 1,
    content: '1',
    orderId: 1
  },
  {
    orderStatus: 'order approved',
    creationTime: new Date(),
    eventId: 'test',
    eventTypeName: 'test',
    state: IntegrationEventLogEntry.StateEnum.Published,
    timesSent: 1,
    content: '1',
    orderId: 1
  },
  {
    orderStatus: 'order paid',
    creationTime: new Date(),
    eventId: 'test',
    eventTypeName: 'test',
    state: IntegrationEventLogEntry.StateEnum.Published,
    timesSent: 1,
    content: '1',
    orderId: 1
  }
];
