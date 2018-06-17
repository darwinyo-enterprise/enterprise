import { Injectable } from '@angular/core';
import { HubConnection, HttpConnection, TransportType } from '@aspnet/signalr'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Select, Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { UpdateOrderStatus } from '../../shared/order.action';
import { IConfiguration, AppState, SecurityService } from '@enterprise/core/src';

@Injectable({
  providedIn: 'root'
})
export class OrderSignalRService {
  private _hubConnection: HubConnection;
  private _httpConnection: HttpConnection;
  private SignalrHubUrl = '';

  @Select(AppState.configuration)
  configurations$: Observable<IConfiguration>;

  constructor(
    private securityService: SecurityService,
    private store: Store
  ) {
    this.configurations$.pipe(take(1)).subscribe(config => {
      this.SignalrHubUrl = config.signalrUrl;
      this.init();
    })
  }

  public stop() {
    this._hubConnection.stop();
  }

  private init() {
    if (this.securityService.IsAuthorized === true) {
      this.register();
      this.stablishConnection();
      this.registerHandlers();
    }
  }

  private register() {
    this._httpConnection = new HttpConnection(this.SignalrHubUrl + '/hub/notificationhub', {
      transport: TransportType.LongPolling,
      accessTokenFactory: () => this.securityService.GetToken()
    });
    this._hubConnection = new HubConnection(this._httpConnection);
  }

  private stablishConnection() {
    this._hubConnection.start()
      .then(() => {
        console.log('Hub connection started')
      })
      .catch(() => {
        console.log('Error while establishing connection')
      });
  }

  private registerHandlers() {
    this._hubConnection.on('UpdatedOrderState', (msg) => {
      this.store.dispatch(new UpdateOrderStatus(msg.orderId, msg.status));
    });
  }

}
