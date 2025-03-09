# 测试数据脚本

本目录包含用于管理测试数据和生成图标的脚本。

## 脚本说明

### 1. 添加测试数据 (seed-test-data.ts)

此脚本为每个分类添加20条网站数据。它会检查每个分类下已有的服务数量，如果少于20个，则添加更多服务直到达到20个。

脚本会根据分类的类型选择合适的测试数据：
- 设计相关分类（design, image等）：使用设计工具数据
- 开发相关分类（dev等）：使用开发工具数据
- 生产力相关分类（work, doc, academic等）：使用生产力工具数据
- 营销相关分类（search, translate等）：使用营销工具数据
- 其他分类：使用AI工具数据

运行方式：
```bash
npm run seed-test-data
```

### 2. 清除服务数据 (clear-services.ts)

此脚本会删除数据库中的所有服务数据。

运行方式：
```bash
npm run clear-services
```

### 3. 生成图标 (generate-icons.ts)

此脚本为每个分类生成20个SVG图标，用于测试数据的显示。图标会保存在`public/icons/{分类名}/`目录下，文件名为0-19.svg。

图标特点：
- 使用简单的几何形状（圆形、方形、六边形等）
- 随机颜色
- 适合作为网站服务的占位图标

运行方式：
```bash
npm run generate-icons
```

### 4. 获取品牌图标 (fetch-brand-icons.ts)

此脚本从Simple Icons API获取流行品牌的SVG图标，并保存到`public/icons/{分类名}/`目录下。它会创建一个映射文件`public/icons/brand-icons-mapping.json`，将品牌名称映射到图标路径。

图标特点：
- 使用官方品牌图标
- 按分类组织
- 与测试数据中的品牌名称匹配

运行方式：
```bash
npm run fetch-brand-icons
```

### 5. 更新分类介绍 (update-category-descriptions.ts)

此脚本为每个分类添加简短的介绍文本，并更新到数据库的Category表中。这些介绍会显示在网站的分类页面上，帮助用户了解每个分类的内容和用途。

介绍特点：
- 简洁明了，概括分类特点
- 包含该分类下工具的主要功能
- 突出分类的实用价值

运行方式：
```bash
npm run update-category-descriptions
```

## 使用场景

1. **初始化测试环境**：
   ```bash
   # 生成基础图标
   npm run generate-icons
   
   # 获取品牌图标
   npm run fetch-brand-icons
   
   # 清除现有服务数据
   npm run clear-services
   
   # 添加带图标的测试数据
   npm run seed-test-data
   
   # 更新分类介绍
   npm run update-category-descriptions
   ```

2. **重置测试数据**：先运行`clear-services`，然后运行`seed-test-data`

3. **补充测试数据**：直接运行`seed-test-data`，它会自动检查并只添加缺少的数据

## 注意事项

- 这些脚本仅用于开发和测试环境，不建议在生产环境中使用
- 脚本会生成随机的图标URL和点击次数，以模拟真实数据
- 如果需要修改测试数据，可以直接编辑脚本中的数据数组
- 获取品牌图标可能受到API限制，如果遇到问题，可以使用生成的基础图标
- 分类介绍可以根据需要在`update-category-descriptions.ts`脚本中修改 