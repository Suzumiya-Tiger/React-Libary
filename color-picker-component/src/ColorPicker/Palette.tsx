import type { FC } from 'react';
import { useRef } from 'react';
import { Color } from './color';
import Handler from './Handler';
import Transform from './Transform';
import useColorDrag from './useColorDrag';
import { calculateColor, calculateOffset } from './utils';

const Palette: FC<{
  color: Color,
  onChange?: (color: Color) => void
}> = ({ color, onChange }) => {
  const transformRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [offset, dragStartHandle] = useColorDrag({
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    targetRef: transformRef as React.RefObject<HTMLDivElement>,
    color,
    onDragChange: offsetValue => {
      const newColor = calculateColor({
        offset: offsetValue,
        containerRef: containerRef as React.RefObject<HTMLDivElement>,
        targetRef: transformRef as React.RefObject<HTMLDivElement>,
        color
      })
      onChange?.(newColor)
    },
    calculate: () => {
      // 确保 ref.current 存在再进行计算
      if (containerRef.current && transformRef.current) {
        return calculateOffset(containerRef as React.RefObject<HTMLDivElement>, transformRef as React.RefObject<HTMLDivElement>, color);
      }
      // 如果 ref 未就绪，返回一个默认值或初始值
      return { x: 0, y: 0 };
    }
  })
  return (
    <div ref={containerRef} onMouseDown={dragStartHandle} className="color-picker-panel-palette">
      <Transform ref={transformRef} offset={{ x: offset.x, y: offset.y }}>
        <Handler color={color.toRgbString()} />
      </Transform>
      <div
        className="color-picker-panel-palette-main"
        style={{
          backgroundColor: `hsl(${color.toHsl().h},100%,50%)`,
          backgroundImage: 'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))',
        }}
      ></div>
    </div>
  )
}

export default Palette