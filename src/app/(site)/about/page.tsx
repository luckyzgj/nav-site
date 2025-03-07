import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们 - AI导航',
  description: '了解AI导航网站的使命和目标',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">关于我们</h1>
          
          <div className="space-y-6 text-gray-600">
            <p>
              AI导航是一个专注于收录和推荐优质AI服务和应用的导航网站。我们的使命是帮助用户快速找到适合自己需求的AI工具，提高工作效率和创新能力。
            </p>
            
            <h2 className="text-xl font-semibold text-gray-700 mt-8">我们的目标</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>收录全面：覆盖各个领域的AI服务和应用</li>
              <li>精选优质：严格筛选，只推荐高质量的AI工具</li>
              <li>分类清晰：通过科学的分类，帮助用户快速定位</li>
              <li>搜索便捷：提供强大的搜索功能，满足精准查找需求</li>
              <li>持续更新：不断收录新的AI服务，保持内容的时效性</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-700 mt-8">联系我们</h2>
            <p>
              如果您有任何建议、反馈或合作意向，欢迎联系我们。我们非常重视用户的意见，并致力于不断改进我们的服务。
            </p>
            <p className="mt-2">
              邮箱：<a href="mailto:contact@ai-nav.com" className="text-blue-600 hover:underline">contact@ai-nav.com</a>
            </p>
            
            <div className="mt-8 text-center">
              <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 