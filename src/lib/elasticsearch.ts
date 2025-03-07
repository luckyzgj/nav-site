import { Client } from '@elastic/elasticsearch';

// 创建Elasticsearch客户端实例
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
    ? {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
});

// 初始化Elasticsearch索引
export const initElasticsearch = async () => {
  try {
    // 检查服务索引是否存在
    const indexExists = await client.indices.exists({
      index: 'services',
    });

    // 如果索引不存在，则创建
    if (!indexExists) {
      await client.indices.create({
        index: 'services',
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text', analyzer: 'standard' },
              description: { type: 'text', analyzer: 'standard' },
              url: { type: 'keyword' },
              categoryId: { type: 'integer' },
              categoryName: { type: 'keyword' },
              clickCount: { type: 'integer' },
              icon: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      console.log('Elasticsearch索引"services"已创建');
    }
  } catch (error) {
    console.error('初始化Elasticsearch失败:', error);
  }
};

export default client; 