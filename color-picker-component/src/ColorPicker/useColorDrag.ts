import { useEffect, useRef, useState } from 'react';
import { TransformOffset } from './Transform';
import { Color } from './color';

type EventType = MouseEvent | React.MouseEvent<Element, MouseEvent>;
type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  offset?: TransformOffset;        // 初始偏移量
  color?: Color;
  containerRef: React.RefObject<HTMLDivElement>; // 容器元素引用
  targetRef: React.RefObject<HTMLDivElement>;    // 拖拽目标元素引用
  direction?: 'x' | 'y';           // 拖拽方向限制
  onDragChange?: (offset: TransformOffset) => void; // 拖拽变化时的回调
  calculate?: () => TransformOffset
}

/**
 * 这个 Hook 允许用户在一个容器内拖动目标元素（如颜色选择器的指示器），并计算拖动后的偏移位置
 * 返回元祖数据类型
 * TransformOffset：当前计算的偏移量
 * EventHandle：拖拽事件处理函数，用于启动拖拽操作
 * offsetValue用于存储当前的拖拽偏移量
 */
function useColorDrag(
  props: useColorDragProps
): [TransformOffset, EventHandle] {
  const {
    offset,
    color,
    targetRef,
    containerRef,
    direction,
    onDragChange,
    calculate
  } = props
  const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 })
  // 使用 ref 而不是 state 的原因是，拖拽状态的变化不需要触发组件重新渲染。
  const dragRef = useRef({
    flag: false
  })
  useEffect(() => {

    // 清理函数，在组件卸载或下次 effect 执行前运行
    return () => {
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragStop);
    };
  }, []); // 空依赖数组表示只在挂载和卸载时运行
  useEffect(() => {
    if (dragRef.current.flag === false) {
      const calcOffset = calculate?.()
      if (calcOffset) {
        setOffsetValue(calcOffset)
      }
    }
  }, [color])
  const updateOffset: EventHandle = e => {
    /* document.documentElement 通常代表 <html> 元素，document.body 代表 <body> 元素。
    不同浏览器或模式下，滚动条可能挂载在其中一个上，所以使用 || 来兼容处理。
 */

    // 获取当前页面的水平 (scrollXOffset) 和垂直 (scrollYOffset) 滚动距离。
    const scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft
    const scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop
    /**
         * e.pageX和e.pageY是距离页面顶部和左边的距离
         * 减去scrollXOffset和scrollYOffset以后，就是距离可视区域顶部和左边的距离了
         */
    const pageX = e.pageX - scrollXOffset
    const pageY = e.pageY - scrollYOffset
    /**
     * 获取拖拽 容器 元素的位置和尺寸信息。
     * containerRef.current 访问容器的 DOM 元素。使用 ! 断言 containerRef.current 不为 null。
     * getBoundingClientRect() 返回一个 DOMRect 对象，包含元素相对于视口的位置（x, y）和尺寸（width, height）。
     * 使用对象解构和重命名，将 x 赋值给 rectX，y 赋值给 rectY。
    
     */
    const {
      x: rectX,
      y: rectY,
      width,
      height
    } = containerRef.current!.getBoundingClientRect()

    const {
      width: targetWidth,
      height: targetHeight
    } = targetRef.current!.getBoundingClientRect()

    // 计算目标元素中心点相对于其左上角的偏移量。这是为了让拖拽点（鼠标位置）对齐到目标元素的中心，而不是左上角。

    const centerOffsetX = targetWidth / 2
    const centerOffsetY = targetHeight / 2

    /**
     * 计算目标元素相对于容器左上角的新偏移量 (offsetX, offsetY)，并确保它保持在容器边界内。
     * pageX - rectX: 计算鼠标相对于容器左边缘的水平距离。
     * pageY - rectY: 计算鼠标相对于容器上边缘的垂直距离。
     * Math.min(..., width): 确保水平距离不超过容器宽度 width。
     * Math.min(..., height): 确保垂直距离不超过容器高度 height。
     * Math.max(0, ...): 确保水平和垂直距离不小于 0（即不超出容器左边和上边）。
     * 
     * - centerOffsetX: 从计算出的水平位置减去目标元素的半宽，使目标元素的中心对齐鼠标。
     * 这个是相对于那个小圆点指示器而言的，确保鼠标位置在指示器内
     * 但是，pageX - rectX 得到的，其实是鼠标点的位置在容器里的坐标。
     * 如果你直接用这个坐标赋值给小圆点的 left，就相当于你把小圆点的左上角放在鼠标位置了。(重点)
     * 所以重点是：
     * 你要算出的是 “小圆点的左上角在哪儿”，才能让它的中心点正好对准鼠标。
     * 小圆点左上角 = 鼠标坐标 - 圆点中心偏移（半径）
     * 容器         鼠标点击位置
       |------------●----------------|
                   ▲
                   |
                pageX - rectX  ← 鼠标相对于容器的坐标
         
       要让圆点中心对齐鼠标，我们要往左推一点：
       offsetX = 鼠标在容器内的位置 - 小圆点一半宽度

      •	offsetX 并不是指「指示器相对于鼠标」的位置，而是「指示器左上角相对于容器」的位置。

     * - centerOffsetY: 从计算出的垂直位置减去目标元素的半高，使目标元素的中心对齐鼠标。
     */
    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX
    const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY

    const calcOffset = {
      x: offsetX,
      y: direction === 'x' ? offsetValue.y : offsetY
    }
    setOffsetValue(calcOffset)
    onDragChange?.(calcOffset)
  }

  const onDragStop: EventHandle = e => {
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragStop)
    dragRef.current.flag = false
  }

  const onDragMove: EventHandle = e => {
    e.preventDefault()
    updateOffset(e)
  }

  const onDragStart: EventHandle = e => {
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragStop)
    dragRef.current.flag = true
  }

  return [offsetValue, onDragStart]

}

export default useColorDrag