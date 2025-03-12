-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2025-03-11 23:47:32
-- 服务器版本： 8.4.4
-- PHP 版本： 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `ai_nav_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `Admin`
--

CREATE TABLE `Admin` (
  `id` int NOT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `Admin`
--

INSERT INTO `Admin` (`id`, `username`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2b$10$w9BEKsAbNBR2FZAjHhDkjOtOFm3QPk6yTJCduqCBPvwNvOCLBXpPS', '2025-03-07 21:33:37.226', '2025-03-10 14:34:30.570');

-- --------------------------------------------------------

--
-- 表的结构 `Banner`
--

CREATE TABLE `Banner` (
  `id` int NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `Banner`
--

INSERT INTO `Banner` (`id`, `title`, `url`, `imageUrl`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`, `description`) VALUES
(3, 'Claude 3.7 Sonet 和 Claude Code 发布', 'https://www.anthropic.com/news/claude-3-7-sonnet', '/uploads/banners/banner_1741704897754.png', 1, 0, '2025-03-11 14:54:59.056', '2025-03-11 15:01:03.361', 'Anthropic 发布 Claude 3.7 Sonet 和 Claude Code，这是我们迄今为止最智能的模型，也是市场上第一个混合推理模型。');

-- --------------------------------------------------------

--
-- 表的结构 `Category`
--

CREATE TABLE `Category` (
  `id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `seoTitle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seoDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seoKeywords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `Category`
--

INSERT INTO `Category` (`id`, `name`, `createdAt`, `updatedAt`, `slug`, `description`, `icon`, `sortOrder`, `seoTitle`, `seoDescription`, `seoKeywords`) VALUES
(1, '对话', '2025-03-07 21:33:37.231', '2025-03-10 17:58:13.948', 'chat', '智能对话助手集合，帮助回答问题、创作内容和提供智能对话服务。', '/uploads/categories/category_1741629493286.svg', 1, NULL, NULL, NULL),
(2, '图片', '2025-03-07 21:33:37.231', '2025-03-10 18:46:08.964', 'image', '图片生成与处理工具，涵盖AI绘画、图片编辑和设计软件，让创意无限可能。', '/uploads/categories/category_1741629549987.svg', 4, NULL, NULL, NULL),
(3, '写作', '2025-03-07 21:33:37.231', '2025-03-10 17:58:25.278', 'write', '智能写作与内容创作工具，提供文案撰写、文本优化和语法检查，提升写作效率与质量。', '/uploads/categories/category_1741629505093.svg', 2, NULL, NULL, NULL),
(4, '音频', '2025-03-07 21:33:37.231', '2025-03-10 17:59:21.021', 'audio', '音频处理与生成工具，包括语音合成、音乐创作和音频编辑，满足各类音频需求。', '/uploads/categories/category_1741629560846.svg', 5, NULL, NULL, NULL),
(5, '视频', '2025-03-07 21:33:37.231', '2025-03-10 17:59:32.391', 'video', '视频制作与编辑工具，涵盖AI视频生成、剪辑软件和特效处理，让视频创作更简单高效。', '/uploads/categories/category_1741629572192.svg', 6, NULL, NULL, NULL),
(6, '开发', '2025-03-07 21:33:37.231', '2025-03-10 17:59:59.779', 'dev', '开发者工具与资源，包括代码编辑器、版本控制和云服务平台，助力软件开发全流程。', '/uploads/categories/category_1741629599597.svg', 9, NULL, NULL, NULL),
(7, '文档', '2025-03-07 21:33:37.231', '2025-03-10 17:58:37.796', 'doc', '文档管理与协作工具，提供文档编辑、知识管理和团队协作功能，提升信息组织效率。', '/uploads/categories/category_1741629517606.svg', 3, NULL, NULL, NULL),
(8, '设计', '2025-03-08 20:47:25.334', '2025-03-10 17:59:50.744', 'design', '设计工具与资源，涵盖UI/UX设计、平面设计和3D建模，满足各类设计创作需求。', '/uploads/categories/category_1741629590562.svg', 8, NULL, NULL, NULL),
(9, '学习', '2025-03-08 20:47:39.624', '2025-03-10 18:00:26.729', 'study', '学术研究与教育工具，包括论文写作、文献管理和学习辅助，支持学术研究与教育活动。', '/uploads/categories/category_1741629626540.svg', 10, NULL, NULL, NULL),
(10, '办公', '2025-03-08 20:47:50.876', '2025-03-10 17:59:42.161', 'work', '办公与生产力工具，提供项目管理、团队协作和效率提升应用，优化工作流程。', '/uploads/categories/category_1741629581977.svg', 7, NULL, NULL, NULL),
(11, '搜索', '2025-03-08 20:48:02.377', '2025-03-10 18:00:36.157', 'search', '搜索与信息获取工具，包括搜索引擎、数据分析和市场调研，帮助发现和整理信息。', '/uploads/categories/category_1741629635969.svg', 11, NULL, NULL, NULL),
(12, '翻译', '2025-03-08 20:48:15.579', '2025-03-10 18:01:58.808', 'translate', '翻译与语言工具，提供多语言翻译、语言学习和跨文化交流服务，打破语言障碍。', '/uploads/categories/category_1741629718618.svg', 12, NULL, NULL, NULL),
(13, '工具', '2025-03-08 20:48:26.092', '2025-03-10 18:02:08.726', 'tools', '实用工具集合，涵盖各类日常应用和专业工具，解决各种实际问题和需求。', '/uploads/categories/category_1741629728534.svg', 13, NULL, NULL, NULL),
(14, '其他', '2025-03-08 20:48:34.506', '2025-03-10 18:02:17.090', 'others', '其他实用资源，收录不属于以上分类的优质工具和服务，满足多样化需求。', '/uploads/categories/category_1741629736902.svg', 14, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `Service`
--

CREATE TABLE `Service` (
  `id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clickCount` int NOT NULL DEFAULT '0',
  `categoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `Service`
--

INSERT INTO `Service` (`id`, `name`, `url`, `description`, `icon`, `clickCount`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(1407, 'ChatGPT', 'https://chat.openai.com', '全球最广泛使用的生成式对话AI，支持GPT-3.5/4/4o多版本，集成插件系统与多模态交互。', '/uploads/icons/icon_1741631291600.svg', 2, 1, '2025-03-10 17:45:00.750', '2025-03-10 19:55:52.127'),
(1408, 'Google Gemini', 'https://gemini.google.com', '谷歌多模态对话AI，深度集成搜索数据，支持实时联网、代码生成与图像分析', '/uploads/icons/icon_1741631042877.svg', 2, 1, '2025-03-10 18:24:02.907', '2025-03-10 23:25:49.442'),
(1409, 'Claude', 'https://claude.ai', '专注安全性的对话AI，支持超长上下文（200K tokens），擅长逻辑推理与文档分析', '/uploads/icons/icon_1741631410204.svg', 2, 1, '2025-03-10 18:30:10.224', '2025-03-11 13:59:04.843'),
(1410, 'Kimi', 'https://kimi.moonshot.cn', '支持20万字超长文本理解的国产对话AI，擅长文献解读、数据分析与多轮复杂对话。', '/uploads/icons/icon_1741631554936.svg', 0, 1, '2025-03-10 18:32:34.957', '2025-03-10 18:32:34.957'),
(1411, '微软Copilot', 'https://copilot.microsoft.com', '基于GPT-4的AI助手，深度集成Bing搜索，提供联网问答、图像生成与Office办公场景优化。', '/uploads/icons/icon_1741631628117.svg', 0, 1, '2025-03-10 18:33:48.137', '2025-03-10 18:33:48.137'),
(1412, 'Meta AI', 'https://ai.meta.com', 'Facebook母公司Meta旗下的对话式AI', '/uploads/icons/icon_1741631762254.svg', 0, 1, '2025-03-10 18:36:02.277', '2025-03-10 18:36:02.277'),
(1413, 'Midjourney', 'https://www.midjourney.com/', '最强AI图片生成服务', '/uploads/icons/icon_1741632067725.svg', 0, 2, '2025-03-10 18:41:07.749', '2025-03-10 18:41:07.749'),
(1414, 'DeepSeek', 'https://chat.deepseek.com', '国产超强AI大模型，支持深度思考，联网搜索。', '/uploads/icons/icon_1741632317290.svg', 0, 1, '2025-03-10 18:45:17.311', '2025-03-10 18:45:17.311'),
(1415, '文心一言', 'https://yiyan.baidu.com', '百度推出的基于文心大模型的AI对话互动工具', '/uploads/icons/icon_1741634303274.svg', 0, 1, '2025-03-10 19:18:23.295', '2025-03-10 19:18:23.295'),
(1416, 'Bing必应', 'https://www.bing.com', '微软推出的新版结合了ChatGPT功能的必应', '/uploads/icons/icon_1741634430758.svg', 0, 11, '2025-03-10 19:20:30.785', '2025-03-10 19:20:30.785'),
(1417, 'Anthropic', 'https://www.anthropic.com', 'Claude的开发商Anthropic', '/uploads/icons/icon_1741634634632.svg', 0, 14, '2025-03-10 19:23:54.655', '2025-03-10 19:23:54.655'),
(1418, 'Perplexity', 'https://www.perplexity.ai', '智能总结并展示信息源，支持深度思考', '/uploads/icons/icon_1741634754997.svg', 0, 1, '2025-03-10 19:25:55.020', '2025-03-10 19:25:55.020'),
(1419, 'Jasper Chat', 'https://www.jasper.ai/chat', 'Jasper针对内容创作者出品的AI聊天工具', '/uploads/icons/icon_1741635059397.svg', 0, 1, '2025-03-10 19:30:59.417', '2025-03-10 19:30:59.417'),
(1420, 'Poe', 'https://poe.com', '问答社区Quora推出的AI问答，支持多种大模型', '/uploads/icons/icon_1741635176032.svg', 0, 1, '2025-03-10 19:32:56.054', '2025-03-10 19:32:56.054'),
(1421, 'Character.AI', 'https://character.ai', '创建虚拟角色并与其对话', '/uploads/icons/icon_1741635353285.svg', 0, 1, '2025-03-10 19:35:53.307', '2025-03-10 19:35:53.307'),
(1422, 'You.com', 'https://you.com', '老牌搜索引擎推出的智能对话式搜索工具', '/uploads/icons/icon_1741635614040.svg', 0, 1, '2025-03-10 19:40:14.063', '2025-03-10 19:40:14.063'),
(1423, 'WriteSonic', 'https://app.writesonic.com', 'SEO和内容创作AI助手', '/uploads/icons/icon_1741635957526.svg', 0, 3, '2025-03-10 19:45:57.551', '2025-03-10 19:45:57.551'),
(1424, 'IngestAI', 'https://ingestai.io', '帮助企业利用自有文档和数据打造自己的AI工具', '/uploads/icons/icon_1741636475974.svg', 0, 6, '2025-03-10 19:54:36.033', '2025-03-10 19:54:36.033'),
(1425, 'HuggingChat', 'https://huggingface.co/chat/', 'HuggingFace出品的AI对话工具，集成多模型。', '/uploads/icons/icon_1741652737350.svg', 0, 1, '2025-03-11 00:25:37.372', '2025-03-11 00:25:37.372'),
(1426, '可灵AI', 'https://klingai.kuaishou.com', '快手基于可灵大模型打造的AI视频生成工具', '/uploads/icons/icon_1741652877745.svg', 0, 5, '2025-03-11 00:27:57.765', '2025-03-11 00:27:57.765'),
(1427, 'Cursor', 'https://www.cursor.com/', '最强AI开发工具，基于VS Code', '/uploads/icons/icon_1741653083943.svg', 0, 6, '2025-03-11 00:31:23.963', '2025-03-11 00:31:23.963'),
(1428, 'Notion AI', 'https://www.notion.com/product/ai', '一站式全能工具。内容搜索、生成、分析到聊天', '/uploads/icons/icon_1741653210453.svg', 0, 7, '2025-03-11 00:33:30.472', '2025-03-11 00:33:30.472'),
(1429, 'ComfyUI', 'https://www.comfy.org', '最强AI工作流软件', '/uploads/icons/icon_1741653591466.svg', 0, 13, '2025-03-11 00:35:45.047', '2025-03-11 00:39:51.987'),
(1430, '智谱清言', 'https://chatglm.cn', '中国版对话语言模型，与GLM大模型进行对话。', '/uploads/icons/icon_1741653815964.svg', 0, 1, '2025-03-11 00:43:35.985', '2025-03-11 00:43:35.985'),
(1431, '豆包', 'https://www.doubao.com', '字节跳动旗下多功能AI对话助手', '/uploads/icons/icon_1741654178643.webp', 0, 1, '2025-03-11 00:49:38.663', '2025-03-11 00:49:38.663'),
(1432, 'Grok', 'https://grok.com/', '马斯克X旗下AI大模型', '/uploads/icons/icon_1741654352627.svg', 0, 1, '2025-03-11 00:52:32.646', '2025-03-11 00:52:32.646'),
(1433, 'Suno', 'https://suno.com', '专注于AI音乐生成的创新平台，利用深度学习技术，用户可通过自然语言描述（文本提示）快速生成完整的音乐作品，包括旋律、歌词、伴奏及人声演唱。', '/uploads/icons/icon_1741654590148.svg', 0, 4, '2025-03-11 00:56:30.168', '2025-03-11 00:56:30.168'),
(1434, '通义千问 Qwen', 'https://chat.qwen.ai', '阿里巴巴开源多模态大语言模型', '/uploads/icons/icon_1741654814524.svg', 0, 1, '2025-03-11 01:00:14.544', '2025-03-11 01:00:14.544'),
(1435, 'PremiumBeat', 'https://www.premiumbeat.com/', '借助 PremiumBeat 最新鲜的高品质音乐，为您的创作内容锦上添花', '/uploads/icons/icon_1741655325332.svg', 0, 4, '2025-03-11 01:08:45.351', '2025-03-11 01:08:45.351'),
(1436, '360智脑', 'https://chat.360.com', '360旗下智脑对话式AI助手', '/uploads/icons/icon_1741655514744.svg', 0, 1, '2025-03-11 01:11:54.764', '2025-03-11 01:11:54.764'),
(1437, '百度智能云', 'https://cloud.baidu.com', '百度旗下AI智能云平台', '/uploads/icons/icon_1741655652904.svg', 0, 14, '2025-03-11 01:14:12.925', '2025-03-11 01:14:12.925'),
(1438, 'Coze扣子', 'https://www.coze.com', '无需代码，轻松创建自己的AI应用', '/uploads/icons/icon_1741655872126.svg', 0, 13, '2025-03-11 01:17:52.146', '2025-03-11 01:18:14.412'),
(1439, 'DeepAI', 'https://deepai.org', '集AI对话、图片生成、视频生成、语音聊天于一体', '/uploads/icons/icon_1741656145977.svg', 0, 1, '2025-03-11 01:22:25.998', '2025-03-11 01:22:25.998'),
(1440, 'Azure', 'https://azure.microsoft.com/zh-cn/', '微软智能云平台', '/uploads/icons/icon_1741656263613.svg', 0, 14, '2025-03-11 01:24:23.633', '2025-03-11 01:24:23.633'),
(1441, 'Dify', 'https://cloud.dify.ai', '开放灵活的生成式AI应用开发框架', '/uploads/icons/icon_1741656577683.webp', 0, 13, '2025-03-11 01:29:37.703', '2025-03-11 01:29:37.703'),
(1442, 'Github Copilot', 'https://github.com/features/copilot', 'Github旗下AI代码助手', '/uploads/icons/icon_1741656681243.svg', 0, 6, '2025-03-11 01:31:21.263', '2025-03-11 01:31:21.263'),
(1443, '腾讯混元', 'https://hunyuan.tencent.com', '腾讯混元大模型', '/uploads/icons/icon_1741656851284.svg', 0, 14, '2025-03-11 01:34:11.304', '2025-03-11 01:34:57.442'),
(1444, '腾讯元宝', 'https://yuanbao.tencent.com', '腾讯旗下AI助手，集成腾讯混元和DeepSeek满血版', '/uploads/icons/icon_1741657154345.png', 0, 1, '2025-03-11 01:39:14.365', '2025-03-11 01:39:14.365'),
(1445, '讯飞开放平台', 'https://www.xfyun.cn', '讯飞AI智能开放平台', '/uploads/icons/icon_1741657261399.svg', 0, 14, '2025-03-11 01:41:01.417', '2025-03-11 01:41:01.417'),
(1446, '讯飞星火', 'https://xinghuo.xfyun.cn', '讯飞旗下星火AI助手', '/uploads/icons/icon_1741657368909.svg', 0, 1, '2025-03-11 01:42:48.928', '2025-03-11 01:42:48.928'),
(1447, 'Fish Speech', 'https://speech.fish.audio', '支持本地搭建的智能音频生成模型', '/uploads/icons/icon_1741657528423.svg', 0, 4, '2025-03-11 01:45:28.443', '2025-03-11 01:46:05.592'),
(1448, 'Jina AI', 'https://jina.ai', '深度搜索模型，你的搜索底座模型', '/uploads/icons/icon_1741657706188.svg', 1, 11, '2025-03-11 01:48:26.208', '2025-03-11 15:05:22.627'),
(1449, '腾讯云', 'https://cloud.tencent.com', '腾讯旗下云平台服务', '/uploads/icons/icon_1741657855463.svg', 0, 14, '2025-03-11 01:50:55.483', '2025-03-11 01:50:55.483'),
(1450, '零一万物 Yi', 'https://github.com/01-ai/Yi', '李开复的零一万物', '/uploads/icons/icon_1741658063216.svg', 0, 14, '2025-03-11 01:54:23.237', '2025-03-11 01:54:23.237'),
(1451, '度小满轩辕', 'https://github.com/Duxiaoman-DI/XuanYuan', '度小满中文金融对话大模型', '/uploads/icons/icon_1741658131772.svg', 0, 14, '2025-03-11 01:55:31.792', '2025-03-11 01:55:31.792'),
(1452, '火山引擎', 'https://www.volcengine.com', '字节跳动旗下的云服务平台', '/uploads/icons/icon_1741658197126.svg', 0, 14, '2025-03-11 01:56:37.147', '2025-03-11 01:56:37.147'),
(1453, 'v0.dev', 'https://v0.dev', 'Vercel开发的AI代码工具', '/uploads/icons/icon_1741658507089.svg', 0, 6, '2025-03-11 02:01:47.108', '2025-03-11 02:01:47.108'),
(1454, 'Tripo AI', 'https://www.tripo3d.ai', '一键在数秒内生成3D模型、角色、场景、动画', '/uploads/icons/icon_1741658719175.svg', 0, 8, '2025-03-11 02:05:19.198', '2025-03-11 02:05:19.198'),
(1455, 'LobeHub', 'https://lobehub.com/zh', '多模态交互AI助手', '/uploads/icons/icon_1741658878901.svg', 0, 1, '2025-03-11 02:07:58.921', '2025-03-11 02:07:58.921');

-- --------------------------------------------------------

--
-- 表的结构 `Setting`
--

CREATE TABLE `Setting` (
  `id` int NOT NULL,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `Setting`
--

INSERT INTO `Setting` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
(1, 'siteName', '123.SS', '2025-03-07 21:33:37.233', '2025-03-10 23:49:43.000'),
(2, 'siteDescription', '收录优质AI服务及应用，国内外AI工具大全', '2025-03-07 21:33:37.233', '2025-03-10 23:49:43.000'),
(3, 'seoTitle', '123.SS - 优质AI服务及应用，国内外AI工具大全', '2025-03-10 01:11:57.000', '2025-03-10 23:49:43.000'),
(4, 'seoKeywords', '123SS,123导航,AI导航,AI网址大全,AI工具大全', '2025-03-10 01:11:57.000', '2025-03-10 23:49:43.000'),
(5, 'seoDescription', '123.SS是一个AI网址导航，专注于收录和推荐优质AI服务和应用。我们的使命是帮助用户快速找到适合自己需求的AI工具，提高工作效率和创新能力，做最好用的国内外AI工具大全。', '2025-03-10 01:11:57.000', '2025-03-10 23:49:43.000'),
(6, 'statisticsCode', '<script>\nvar _hmt = _hmt || [];\n(function() {\n  var hm = document.createElement(\"script\");\n  hm.src = \"https://hm.baidu.com/hm.js?76b227bf97767cff3b91281845f20c1c\";\n  var s = document.getElementsByTagName(\"script\")[0]; \n  s.parentNode.insertBefore(hm, s);\n})();\n</script>', '2025-03-10 02:08:50.000', '2025-03-10 23:49:43.000');

-- --------------------------------------------------------

--
-- 表的结构 `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('4593f1ac-d106-475e-8412-ea810d47f989', '48542bc5a265b3fde1176f6393258e9d6708b8fdeb003a20d2a692a3f328ac14', NULL, '20250307205754_add_slug_to_category', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250307205754_add_slug_to_category\n\nDatabase error code: 1060\n\nDatabase error:\nDuplicate column name \'slug\'\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20250307205754_add_slug_to_category\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20250307205754_add_slug_to_category\"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226', NULL, '2025-03-07 21:29:53.698', 0),
('66b4237c-6a2a-40ae-8e71-9d9f0b894dd6', '7a173133401d9173fd66774879e3a50c54d31d7bdf3bf407527549920ea35127', '2025-03-07 21:29:53.684', '20250307190618_init', NULL, NULL, '2025-03-07 21:29:53.670', 1),
('b0495760-1c1a-4879-afb3-0bd5ba65da16', '151bf62a473a4cfa3dbedfb8753e54148be3efea0585aa79532f536b2c140ad2', '2025-03-07 21:29:53.698', '20250307190619_add_slug_to_category', NULL, NULL, '2025-03-07 21:29:53.684', 1),
('e9bf3282-4f9a-4bdd-998b-75c136969d16', '90ff49d801e31e11d19808845cf530f1f42bea0b62efefceb7ada9a1d95d1856', '2025-03-07 21:30:19.026', '20250307205755_add_settings_model', '', NULL, '2025-03-07 21:30:19.026', 0);

--
-- 转储表的索引
--

--
-- 表的索引 `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Admin_username_key` (`username`);

--
-- 表的索引 `Banner`
--
ALTER TABLE `Banner`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- 表的索引 `Service`
--
ALTER TABLE `Service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Service_categoryId_idx` (`categoryId`);

--
-- 表的索引 `Setting`
--
ALTER TABLE `Setting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Setting_key_key` (`key`);

--
-- 表的索引 `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `Admin`
--
ALTER TABLE `Admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `Banner`
--
ALTER TABLE `Banner`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- 使用表AUTO_INCREMENT `Service`
--
ALTER TABLE `Service`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1456;

--
-- 使用表AUTO_INCREMENT `Setting`
--
ALTER TABLE `Setting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 限制导出的表
--

--
-- 限制表 `Service`
--
ALTER TABLE `Service`
  ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
