-- 检查sortOrder字段是否存在
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_schema = 'ai_nav_db' 
AND table_name = 'Category' 
AND column_name = 'sortOrder';

-- 更新现有记录的sortOrder字段
UPDATE `Category` SET `sortOrder` = id WHERE `sortOrder` = 0; 