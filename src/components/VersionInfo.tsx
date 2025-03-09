'use client';

import { useState, useEffect, useCallback } from 'react';

interface VersionInfoProps {
  className?: string;
}

interface BuildInfo {
  version: string;
  buildId: string;
  buildTime: string;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ className }) => {
  const [buildInfo, setBuildInfo] = useState<BuildInfo>({
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    buildId: '',
    buildTime: ''
  });

  // 使用useCallback包装获取版本信息的逻辑，避免在依赖数组中直接使用对象
  const fetchVersionInfo = useCallback(async () => {
    try {
      // 尝试从版本信息文件获取信息
      const res = await fetch('/static/version/info.json');
      if (!res.ok) {
        throw new Error('版本信息文件不存在');
      }
      const data = await res.json();
      setBuildInfo(prev => ({
        version: data.version || prev.version,
        buildId: data.buildId || prev.buildId,
        buildTime: data.buildTime || prev.buildTime
      }));
    } catch {
      try {
        // 如果版本信息文件不存在，尝试从构建ID获取信息
        const res = await fetch('/_next/build-id');
        const buildId = await res.text();
        // 将时间戳转换为可读格式
        const buildTime = new Date(parseInt(buildId) * 1000).toLocaleString();
        setBuildInfo(prev => ({ ...prev, buildId, buildTime }));
      } catch (err) {
        console.error('获取构建ID失败:', err);
      }
    }
  }, []);

  // 使用useEffect调用获取版本信息的函数
  useEffect(() => {
    fetchVersionInfo();
  }, [fetchVersionInfo]);

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <div>版本: {buildInfo.version}</div>
      <div>构建时间: {buildInfo.buildTime || '加载中...'}</div>
      {process.env.NODE_ENV === 'development' && (
        <div className="text-blue-500">开发模式</div>
      )}
    </div>
  );
};

export default VersionInfo; 