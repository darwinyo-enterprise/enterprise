export * from './integrationEvent.service';
import { IntegrationEventService } from './integrationEvent.service';
export * from './orders.service';
import { OrdersService } from './orders.service';
export const APIS = [IntegrationEventService, OrdersService];
