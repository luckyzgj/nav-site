'use client';

import React from 'react';
import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 创建一个自定义 hook，方便在组件中使用
export const useAdminApp = App.useApp;

// 自定义主题配置
const customTheme = {
  token: {
    // 品牌色
    colorPrimary: '#ff734e',
    // 成功色
    colorSuccess: '#52c41a',
    // 警告色
    colorWarning: '#faad14',
    // 错误色
    colorError: '#ff734e',
    // 信息色
    colorInfo: '#1677ff',

    // 中性色
    colorTextBase: '#000000',
    colorBgBase: '#ffffff',

    // 字体
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,

    // 线条
    lineWidth: 1,
    lineType: 'solid',

    // 圆角
    borderRadius: 4,

    // 尺寸
    sizeUnit: 4,
    sizeStep: 4,

    // 动画
    motionUnit: 0.1,
    motionBase: 0,

    // 不透明度
    opacityImage: 1,

    // 线框风格
    wireframe: false,
  },
  components: {
    Menu: {
      itemBg: 'transparent',
      itemColor: 'rgba(0, 0, 0, 0.75)',
      itemSelectedColor: '#fe3911',
      itemSelectedBg: '#fff3ed',
      itemHoverColor: '#ff734e',
      activeBarWidth: 3,
      activeBarHeight: 40,
      colorActiveBarBorderSize: 0,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f0f2f5',
      triggerBg: '#ffffff',
      colorTextTrigger: 'rgba(0, 0, 0, 0.65)',
    },
    Button: {
      colorPrimary: '#ff734e',
      colorPrimaryHover: '#ff734e',
      colorPrimaryActive: '#ff734e',
      fontSize: 14,
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#f0f0f0',
      headerBg: '#f8f8f8',
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    },
    Table: {
      colorBgContainer: '#ffffff',
      colorText: 'rgba(0, 0, 0, 0.85)',
      colorTextHeading: 'rgba(0, 0, 0, 0.85)',
      colorBorderSecondary: '#f0f0f0',
      fontSize: 14,
    },
    Form: {
      colorText: 'rgba(0, 0, 0, 0.85)',
      colorTextHeading: 'rgba(0, 0, 0, 0.85)',
      colorTextLabel: 'rgba(0, 0, 0, 0.85)',
      colorTextDescription: 'rgba(0, 0, 0, 0.45)',
      colorBorder: '#d9d9d9',
      colorErrorOutline: '#ff4d4f',
      colorWarningOutline: '#faad14',
    },
  },
  algorithm: theme.defaultAlgorithm, // 使用默认算法
};

interface AdminAppProviderProps {
  children: React.ReactNode;
}

/**
 * 管理后台专用的 App Provider
 * 用于解决 Ant Design 与 React 19 的兼容性问题
 * 提供消息上下文，使静态消息方法能够正确消费 React 上下文
 */
export default function AdminAppProvider({ children }: AdminAppProviderProps) {
  return (
    <ConfigProvider theme={customTheme} locale={zhCN}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
