'use client';

import { useEffect } from 'react';

export default function SmoothScrollScript() {
  useEffect(() => {
    // 为所有锚点链接添加平滑滚动效果
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    const handleClick = (e: Event) => {
      e.preventDefault();
      const anchor = e.currentTarget as HTMLAnchorElement;
      const targetId = anchor.getAttribute('href');
      
      // 如果是返回顶部的链接 (#)，直接滚动到顶部
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // 处理其他锚点链接
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });
    
    // 监听滚动事件，高亮当前可见的分类
    const handleScroll = () => {
      // 获取所有分类区块和导航链接
      const sections = Array.from(document.querySelectorAll('section[id^="category-"]'));
      const navLinks = document.querySelectorAll('.category-nav-link');
      
      // 移除所有导航链接的活动状态
      navLinks.forEach(link => {
        link.classList.remove('active-category');
        link.classList.remove('border-brand-400');
        link.classList.add('border-transparent');
      });
      
      // 找到当前在视口中的分类
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        
        // 如果区块在视口中或接近视口顶部
        if (rect.top <= 100 && rect.bottom >= 0) {
          // 找到对应的导航链接
          const sectionId = section.id;
          const activeLink = document.querySelector(`.category-nav-link[href="#${sectionId}"]`);
          
          if (activeLink) {
            activeLink.classList.add('active-category');
            activeLink.classList.add('border-brand-400');
            activeLink.classList.remove('border-transparent');
          }
          
          // 找到第一个可见的区块后就退出循环
          break;
        }
      }
    };
    
    // 初始执行一次，设置初始状态
    setTimeout(handleScroll, 500); // 延迟执行，确保DOM已完全加载
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 清理事件监听器
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
} 