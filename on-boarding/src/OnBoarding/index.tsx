import React, { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Popover } from "antd";
import { Mask } from "./Mask";
import { TooltipPlacement } from "antd/es/tooltip";
import "./index.scss";

export interface OnBoardingStepConfig {
  selector: () => HTMLElement | null;

  placement?: TooltipPlacement;

  renderContent?: (currentStep: number) => React.ReactNode;

  beforeForward?: (currentStep: number) => void;

  beforeBack?: (currentStep: number) => void;
}

export interface OnBoardingProps {
  step?: number; // 当前步骤
  steps: OnBoardingStepConfig[]; // 步骤配置数组
  getContainer?: () => HTMLElement; // 获取容器元素的方法
  onStepsEnd?: () => void; // 所有步骤结束后的回调
}

export const OnBoarding: FC<OnBoardingProps> = props => {
  const { step = 0, steps, onStepsEnd, getContainer } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);
  // 获取当前需要高亮的元素
  const currentSelectedElement = steps[currentStep]?.selector?.();
  // 获取容器元素（用于放置遮罩）
  const currentContainerElement = getContainer?.() || document.documentElement;

  const [done, setDone] = useState(false);

  const [isMaskMoving, setIsMaskMoving] = useState(false);

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    // 处理回到上一步的逻辑

    if (currentStep === 0) {
      return;
    }
    const { beforeBack } = getCurrentStep();
    await beforeBack?.(currentStep);
    setCurrentStep(currentStep - 1);
  };

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await onStepsEnd?.();
      setDone(true);
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    setCurrentStep(step!);
  }, [step]);

  const renderPopover = (wrapper: React.ReactNode) => {
    // 获取当前步骤的配置
    const config = getCurrentStep();
    // 如果当前步骤没有配置，直接返回wrapper
    if (!config) {
      return wrapper;
    }

    const { renderContent } = config;
    const content = renderContent ? renderContent(currentStep) : null;
    // 操作按钮部分

    const operation = (
      <div className="onboarding-operation">
        {currentStep !== 0 && (
          <Button className={"back"} onClick={() => back()}>
            上一步
          </Button>
        )}
        <Button className={"forward"} onClick={() => forward()}>
          {" "}
          {currentStep === steps.length - 1 ? "我知道了" : "下一步"}
        </Button>
      </div>
    );
    // 返回完整的 Popover 组件

    return isMaskMoving ? (
      wrapper
    ) : (
      <Popover
        content={
          <div>
            {content}
            {operation}
          </div>
        }
        open={true}
        placement={getCurrentStep().placement}>
        {wrapper}
      </Popover>
    );
  };
  const [, setRenderTick] = useState(0);

  useEffect(() => {
    setRenderTick(1);
  }, []);
  // 如果当前没有需要高亮的元素，则不渲染

  if (!currentSelectedElement || done) {
    return null;
  }
  // 创建遮罩和气泡提示

  const mask = (
    <Mask
      onAnimationStart={() => setIsMaskMoving(true)}
      onAnimationEnd={() => setIsMaskMoving(false)}
      element={currentSelectedElement}
      container={currentContainerElement}
      renderMaskContent={wrapper => renderPopover(wrapper)}
    />
  );

  // 使用 Portal 将内容渲染到指定容器
  /**
   * createPortal: 这是 React 的一个特性，
   * 它允许将子组件（这里是 mask）渲染到父组件 DOM 层次结构之外的 DOM 节点（这里是 currentContainerElement）。
   * 这样做的好处是，
   * 即使 OnBoarding 组件在 DOM 树的深层，引导层也能覆盖整个页面或指定容器，而不会被父元素的 overflow: hidden 或 z-index 等样式限制。
   */
  return createPortal(mask, currentContainerElement);
};
