import React, { CSSProperties, useEffect, useState } from "react";
import { getMaskStyle } from "./hooks/getMaskStyle";

/**
 * element: 必需的 HTMLElement，表示需要被遮罩的元素。
 * container: 可选的 HTMLElement，表示遮罩的容器。
 * renderMaskContent: 可选的函数，用于渲染遮罩层的内容。
 */
interface MaskProps {
  element: HTMLElement;

  container?: HTMLElement;

  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
  // 动画开始和结束的回调，为了确保Mask组件完成动画后再渲染，防止闪烁
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export const Mask: React.FC<MaskProps> = props => {
  const {
    element,
    container,
    renderMaskContent,
    onAnimationStart,
    onAnimationEnd,
  } = props;
  // 使用 useState 钩子来管理遮罩层的样式状态，初始值为空对象 {}。
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    onAnimationStart?.();
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [element]);
  
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const style = getMaskStyle(
        element,
        container || document.documentElement
      );

      setStyle(style);
    });
    observer.observe(container || document.documentElement);
    return () => {
      observer.disconnect();
    };
  }, [element, container]);

  useEffect(() => {
    if (!element) {
      return;
    }

    // 调用 element.scrollIntoView 方法将元素滚动到视图中间。
    element.scrollIntoView({
      block: "center",
      inline: "center",
    });

    // 调用 getMaskStyle 函数计算遮罩层的样式，并更新状态。
    const style = getMaskStyle(element, container || document.documentElement);

    setStyle(style);
  }, [element, container]);

  // getContent 函数用于渲染遮罩层的内容：
  // 如果 renderMaskContent 函数不存在，返回 null。
  // 否则，调用 renderMaskContent 函数，并传入一个 div 元素作为参数。
  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }

    return renderMaskContent(
      <div
        className={"mask-content"}
        style={{ width: "100%", height: "100%" }}></div>
    );
  };

  return (
    // 返回计算得到的样式和类型
    <div style={style} className="mask">
      {getContent()}
    </div>
  );
};
