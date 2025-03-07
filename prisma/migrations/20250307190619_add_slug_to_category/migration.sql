-- 添加slug字段，允许为空
ALTER TABLE `Category` ADD COLUMN `slug` VARCHAR(191) NULL;

-- 为现有记录生成默认slug值（基于name字段的拼音或英文）
UPDATE `Category` SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '（', ''), '）', ''));

-- 设置slug字段为非空
ALTER TABLE `Category` MODIFY `slug` VARCHAR(191) NOT NULL;

-- 添加唯一索引
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`); 