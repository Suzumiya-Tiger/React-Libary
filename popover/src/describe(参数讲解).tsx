import {
  useInteractions,
  useFloating,
  useClick,
  useDismiss,
  offset,
  arrow,
  FloatingArrow,
  flip,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import "./App.css";
export default function App() {
  const arrowRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  /**
   * @floating-ui/react 提供了一系列 hooks 来处理浮动元素的定位和交互
   * useFloating: 核心 hook，用于处理浮动元素的定位
   * useHover: 处理悬浮事件
   * useInteractions: 统一管理各种交互行为
   *
   * useFloating 主要作用就是为了计算浮层位置的，它返回三个重要的对象：
   * refs: 包含设置参考元素和浮动元素的引用方法， 通过这个ref能够计算出浮层的样式
   * floatingStyles: 包含定位浮动元素所需的样式
   * context: 上下文对象，用于在不同的 hooks 之间共享状态
   */
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    // 决定浮层的弹出方向
    placement: "left-start",
    // 决定图层弹出的间距和箭头
    middleware: [offset(10), arrow({ element: arrowRef }), flip()],
  });

  /**
   * 使用 useHover hook 来处理悬浮事件，它需要 context 来保持状态的一致性。
   * useInteractions 统一管理各种交互行为，它接收一个包含多个 hooks 的数组，并返回一个包含所有交互行为的对象。
   * 一言蔽之，useFloating 是用来给浮层确定位置的，useInteractions 是用来绑定交互事件的
   * useInteractions 将所有交互行为（这里是悬浮）整合到一起，返回两个方法：
   * getReferenceProps: 用于触发元素（按钮）的属性
   * getFloatingProps: 用于浮动元素的属性
   */
  // const hover = useHover(context);
  // const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);
  return (
    <>
      {/*  触发元素（按钮）：
       * 使用 refs.setReference 设置参考点
       * 使用 getReferenceProps() 添加必要的事件处理器
       *
       * 浮动元素（div）：
       * 使用 refs.setFloating 设置浮动元素
       * 应用 floatingStyles 来正确定位
       * 使用 getFloatingProps() 添加必要的事件处理器
       * 只在 isOpen 为 true 时显示
       *
       */}
      <button ref={refs.setReference} {...getReferenceProps()}>
        Hover
      </button>
      {isOpen && (
        <div
          className="popover-floating"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}>
          <p>Floating</p>
          <FloatingArrow
            ref={arrowRef}
            context={context}
            fill="#fff"
            stroke="#000"
            strokeWidth={1}
          />
        </div>
      )}
    </>
  );
}
