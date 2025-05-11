# React Libary- 说明文档

## 简介

本组件库包含一系列使用 React 和 TypeScript 构建的 UI 组件，旨在提供[您的组件库的主要目标，例如：高效、易用、美观的界面元素]。

每个组件都作为独立的包进行管理，使用 Vite 进行构建和开发。

## 组件列表及简介

以下是当前组件库中包含的组件：

1. **`mini-calendar` (日历组件 - `calendar-cpn`)**

   * **描述**：一个迷你的日历组件，基于 React, TypeScript 和 Vite 构建。可能用于日期选择或展示。
   * **主要依赖**：`dayjs`, `classnames`, `ahooks`
   * **特点**：[待补充，例如：支持国际化、自定义渲染等]
   * **使用示例**：[待补充]
2. **`message` (消息提示组件)**

   * **描述**：用于显示全局消息提示，例如成功、警告或错误信息。基于 React, TypeScript, Vite 和 SASS 构建，使用 `react-transition-group` 实现动画效果。
   * **主要依赖**：`react-transition-group`, `sass`
   * **特点**：[待补充，例如：多种提示类型、自动关闭等]
   * **使用示例**：[待补充]
3. **`form-component` (表单组件)**

   * **描述**：一个功能完善的表单组件，支持数据收集、校验和提交。其 `README.md` 中有详细的设计和实现说明，包括 `FormContext`, `Form` 主组件和 `Form.Item` 表单项。
   * **主要依赖**：`antd` (部分UI或类型), `async-validator`, `classnames`
   * **特点**：[待补充，例如：强大的校验功能、灵活的布局等]
   * **使用示例**：[待补充]
4. **`upload-component` (文件上传组件)**

   * **描述**：用于实现文件上传功能。包含一个简单的 Express 后端用于处理上传请求。
   * **主要依赖**：`@ant-design/icons`, `antd`, `axios`, `express`, `multer`
   * **特点**：[待补充，例如：支持多文件上传、进度显示、拖拽上传等]
   * **使用示例**：[待补充]
5. **`popover` (弹出框/气泡提示组件)**

   * **描述**：一个弹出框或气泡提示组件，使用 `@floating-ui/react` 库实现灵活的定位和交互。
   * **主要依赖**：`@floating-ui/react`
   * **特点**：[待补充，例如：多种触发方式、自定义内容、精确定位等]
   * **使用示例**：[待补充]
6. **`on-boarding` (引导组件)**

   * **描述**：可能是一个用于新用户引导或产品功能介绍的组件，使用 SCSS 进行样式化。
   * **主要依赖**：`scss`
   * **特点**：[待补充，例如：分步引导、高亮特定区域等]
   * **使用示例**：[待补充]
7. **`locate-cpn` (定位/辅助组件)**

   * **描述**：可能是一个开发辅助组件，或与元素定位、页面导航相关的功能组件。依赖了 `click-to-react-component`，表明它可能与快速定位到组件源码相关。
   * **主要依赖**：`antd`, `click-to-react-component`
   * **特点**：[待补充]
   * **使用示例**：[待补充]
8. **`color-picker-component` (颜色选择器组件)**

   * **描述**：一个颜色选择器组件，用于让用户选择颜色。
   * **主要依赖**：`@ctrl/tinycolor`, `ahooks`, `classnames`, `sass`
   * **特点**：[待补充，例如：支持多种颜色格式、预设颜色、透明度选择等]
   * **使用示例**：[待补充]

## 如何使用

由于每个组件都是独立的项目，具体的使用方法请参考各个组件目录下的 `README.md` (如果其中包含具体用法) 和源代码。

[未来可以补充统一的安装和使用指南，如果这些组件会被打包成一个库发布的话]

## 开发

每个组件都可以在其各自的目录中独立运行和开发：

```bash
cd <component-directory>
pnpm install # 或 npm install / yarn install
pnpm dev     # 或 npm run dev / yarn dev
```
