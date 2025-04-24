import { FC, useState, DragEvent, PropsWithChildren } from 'react'
import classNames from 'classnames'

// 定义 Dragger 组件的属性接口，继承自 PropsWithChildren
interface DraggerProps extends PropsWithChildren {
  // 当文件被拖放时调用的回调函数
  onFile: (files: FileList) => void;
}

// 定义 Dragger 组件
export const Dragger: FC<DraggerProps> = (props) => {

  const { onFile, children } = props

  // 定义 dragOver 状态，用于指示拖放区域是否处于"拖放中"状态
  const [dragOver, setDragover] = useState(false)

  // 使用 classNames 库动态设置 CSS 类
  const cs = classNames('upload-dragger', {
    'is-dragover': dragOver // 如果 dragOver 为 true，则添加 'is-dragover' 类
  })

  // 处理文件拖放的函数
  /**
   * DragEvent 对象: 当用户在浏览器中进行拖放操作时，浏览器会生成一个 DragEvent 对象，并将其传递给事件处理函数。
   * dataTransfer 属性: 这是 DragEvent 对象的一个属性，包含了拖放操作中传递的数据。
   * dataTransfer.files: 这是一个 FileList 对象，包含了用户拖放的文件。每个文件都是一个 File 对象，包含文件的详细信息（如名称、大小、类型等）。
   */
  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault() // 阻止默认行为
    setDragover(false) // 拖放结束，更新状态
    onFile(e.dataTransfer.files) // 调用回调函数，传递文件列表
  }

  // 处理拖动进入和离开的函数
  const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
    e.preventDefault() // 阻止默认行为
    setDragover(over) // 根据拖动状态更新 dragOver
  }

  return (
    // 渲染拖放区域，绑定事件处理函数
    <div className={cs} onDragOver={e => { handleDrag(e, true) }} onDragLeave={e => { handleDrag(e, false) }} onDrop={handleDrop}>
      {children} {/* 渲染子组件 */}
    </div>
  )
}

export default Dragger