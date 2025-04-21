import { CSSProperties } from "react";
import cs from "classnames";
import './index.scss'
import { ColorType } from "./interface";
import { Color } from "./color";
import { useState } from "react";
import Palette from "./Palette";
import { useControllableValue } from "ahooks";


export interface ColorPickerProps {
  className?: string;
  style?: CSSProperties
  value?: ColorType
  defaultValue?: ColorType
  onChange?: (value: ColorType) => void
}

function ColorPickerPanel(props: ColorPickerProps) {
  const { className, style, value, onChange } = props
  const [colorValue, setColorValue] = useControllableValue<Color>(props)
  const classNames = cs('color-picker-panel', className)
  function onPaletteChange(color: Color) {
    setColorValue(color)
    onChange?.(color.toHsvString())
  }
  return <div className={classNames} style={style}>
    <Palette color={colorValue} onChange={onPaletteChange} />

  </div>
}

export default ColorPickerPanel