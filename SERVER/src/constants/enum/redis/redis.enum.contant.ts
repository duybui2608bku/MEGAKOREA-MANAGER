export enum RedisKey {
  USER_LIST = 'user_list',
  USER_SEARCH = 'user_search',
  USER_DETAIL = 'user_detail'
}

export enum REDIS_STATUS {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
  CLOSE = 'close'
}

export enum RedisTTL {
  USER_LIST = 180,
  USER_SEARCH = 120,
  USER_DETAIL = 300
}
