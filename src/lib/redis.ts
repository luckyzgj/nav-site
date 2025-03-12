import Redis from 'ioredis';

// 创建Redis客户端单例
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  db: 0,
});

// 监听Redis连接事件
redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', error => {
  console.error('Redis connection error:', error);
});

// 扩展Redis方法，处理对象序列化
export const redisHelper = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },

  async set<T>(key: string, value: T, options?: { ex?: number }): Promise<'OK'> {
    const serializedValue = JSON.stringify(value);
    if (options?.ex) {
      return redis.set(key, serializedValue, 'EX', options.ex);
    }
    return redis.set(key, serializedValue);
  },

  async del(...keys: string[]): Promise<number> {
    return redis.del(keys);
  },

  async keys(pattern: string): Promise<string[]> {
    return redis.keys(pattern);
  },
};

export default redis;
