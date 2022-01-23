import {
  MqttClient,
  IClientOptions,
  IClientPublishOptions,
  IClientSubscribeOptions,
  ISubscriptionGrant,
  ISubscriptionMap,
} from 'mqtt';

export * from 'mqtt/types/lib/client-options';
export * from 'mqtt/types/lib/store';

export {
  // mqtt/types/lib/client
  ISubscriptionGrant,
  ISubscriptionRequest,
  ISubscriptionMap,
  OnMessageCallback,
  OnPacketCallback,
  OnErrorCallback,
  IStream,

  // mqtt-packet
  QoS,
  PacketCmd,
  IPacket,
  IConnectPacket,
  IPublishPacket,
  IConnackPacket,
  ISubscription,
  ISubscribePacket,
  ISubackPacket,
  IUnsubscribePacket,
  IUnsubackPacket,
  IPubackPacket,
  IPubcompPacket,
  IPubrelPacket,
  IPubrecPacket,
  IPingreqPacket,
  IPingrespPacket,
  IDisconnectPacket,
  Packet
} from 'mqtt'

export interface IMqttClient extends MqttClient {}

export declare class AsyncMqttClient extends MqttClient {
  constructor (client: IMqttClient);

  public subscribe (topic: string | string[], opts: IClientSubscribeOptions): Promise<ISubscriptionGrant[]>
  public subscribe (topic: string | string[] | ISubscriptionMap): Promise<ISubscriptionGrant[]>
  /* original */ public subscribe (topic: string | string[], opts: IClientSubscribeOptions, callback: never): this
  /* original */ public subscribe (topic: string | string[] | ISubscriptionMap, callback: never): this

  public unsubscribe (topic: string | string[]): Promise<void>
  /* original */ public unsubscribe (topic: string | string[], callback: never): this;

  public publish (topic: string, message: string | Buffer, opts: IClientPublishOptions): Promise<void>
  public publish (topic: string, message: string | Buffer): Promise<void>
  /* original */ public publish (topic: string, message: string | Buffer, opts: IClientPublishOptions, callback: never): this
  /* original */ public publish (topic: string, message: string | Buffer, callback: never): this

  public end (force?: boolean): Promise<void>
  /* original */ public end (force: boolean, callback: never): this;
}

export declare function connect (brokerUrl?: string | any, opts?: IClientOptions): AsyncMqttClient
export declare function connectAsync (brokerUrl: string | any, opts?: IClientOptions, allowRetries?: boolean): Promise<AsyncMqttClient>

export { AsyncMqttClient as AsyncClient }
