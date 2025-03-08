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
        // 清除所有高亮状态
        clearAllActiveStates();
        return;
      }
      
      // 处理其他锚点链接
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          
          // 立即更新活动状态，不等待滚动事件
          setTimeout(() => {
            updateActiveCategory(targetId.substring(1));
          }, 100);
        }
      }
    };
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });
    
    // 清除所有高亮状态
    const clearAllActiveStates = () => {
      const desktopNavLinks = document.querySelectorAll('.category-nav-link');
      const mobileNavLinks = document.querySelectorAll('.xl\\:hidden .category-nav-link');
      
      desktopNavLinks.forEach(link => {
        link.classList.remove('active-category');
        link.classList.remove('border-brand-400');
        link.classList.add('border-transparent');
        link.classList.remove('font-medium');
      });
      
      mobileNavLinks.forEach(link => {
        link.classList.remove('bg-brand-50');
        link.classList.remove('border-brand-300');
        link.classList.remove('font-medium');
      });
    };
    
    // 更新活动分类的函数
    const updateActiveCategory = (activeSectionId: string) => {
      // 移除所有导航链接的活动状态
      clearAllActiveStates();
      
      // 添加活动状态到对应的导航链接
      const activeDesktopLink = document.querySelector(`.hidden.xl\\:block .category-nav-link[href="#${activeSectionId}"]`);
      if (activeDesktopLink) {
        activeDesktopLink.classList.add('active-category');
        activeDesktopLink.classList.add('border-brand-400');
        activeDesktopLink.classList.remove('border-transparent');
        activeDesktopLink.classList.add('font-medium');
      }
      
      // 添加活动状态到移动端导航链接
      const activeMobileLink = document.querySelector(`.xl\\:hidden .category-nav-link[href="#${activeSectionId}"]`);
      if (activeMobileLink) {
        activeMobileLink.classList.add('bg-brand-50');
        activeMobileLink.classList.add('border-brand-300');
        activeMobileLink.classList.add('font-medium');
      }
    };
    
    // 监听滚动事件，高亮当前可见的分类
    const handleScroll = () => {
      // 获取所有分类区块
      const sections = Array.from(document.querySelectorAll('section[id^="category-"]'));
      
      // 如果没有分类区块，直接返回
      if (sections.length === 0) return;
      
      // 检查是否在页面顶部
      const isAtTop = window.scrollY < 100;
      
      // 如果在页面顶部，清除所有高亮状态
      if (isAtTop && sections[0].getBoundingClientRect().top > 100) {
        clearAllActiveStates();
        return;
      }
      
      // 找到当前在视口中的分类
      let foundVisibleSection = false;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        
        // 如果区块在视口中或接近视口顶部
        if (rect.top <= 100 && rect.bottom >= 0) {
          // 更新活动分类
          updateActiveCategory(section.id);
          foundVisibleSection = true;
          
          // 找到第一个可见的区块后就退出循环
          break;
        }
      }
      
      // 如果没有找到可见的分类，但不在页面顶部，高亮第一个分类
      if (!foundVisibleSection && !isAtTop && sections.length > 0) {
        updateActiveCategory(sections[0].id);
      }
    };
    
    // 初始执行一次，设置初始状态
    setTimeout(handleScroll, 500); // 延迟执行，确保DOM已完全加载
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 监听返回顶部按钮的点击事件
    const backToTopButtons = document.querySelectorAll('button[aria-label="返回顶部"]');
    backToTopButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 清除所有高亮状态
        clearAllActiveStates();
      });
    });
    
    // 清理事件监听器
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
      window.removeEventListener('scroll', handleScroll);
      backToTopButtons.forEach(button => {
        button.removeEventListener('click', clearAllActiveStates);
      });
    };
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
} 