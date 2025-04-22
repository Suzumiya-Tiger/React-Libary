export const getMaskStyle = (element: HTMLElement, container: HTMLElement) => {
  if (!element) {
    return {};
  }
  /**
   * width 和 height: 元素的宽度和高度。
   * top: 元素的上边界相对于视口的垂直距离。
   * right: 元素的右边界相对于视口的水平距离。
   * bottom: 元素的下边界相对于视口的垂直距离。
   * left: 元素的左边界相对于视口的水平距离。
   */
  const { height, width, left, top } = element.getBoundingClientRect();

  const elementTopWithScroll = container.scrollTop + top;
  const elementLeftWithScroll = container.scrollLeft + left;

  return {
    // 设置遮罩的高度和宽度为容器的高度和宽度
    width: container.scrollWidth,
    height: container.scrollHeight,
    /* 计算遮罩的上边框宽度。elementTopWithScroll 是元素的顶部相对于容器顶部的距离。
      通过设置上边框宽度为这个值，遮罩的上边部分将覆盖到元素的顶部。 */
    borderTopWidth: Math.max(elementTopWithScroll, 0),
    /* 计算遮罩的左边框宽度。elementLeftWithScroll 是元素的左边相对于容器左边的距离。
    通过设置左边框宽度为这个值，遮罩的左边部分将覆盖到元素的左边。 */
    borderLeftWidth: Math.max(elementLeftWithScroll, 0),
    /* 计算遮罩的右边框宽度。它是容器的总宽度减去元素的左边位置和元素的宽度。这样，遮罩的右边部分将覆盖到元素的右边。 */
    borderRightWidth: Math.max(
      container.scrollWidth - elementLeftWithScroll - width,
      0
    ),
    borderBottomWidth: Math.max(
      container.scrollHeight - elementTopWithScroll - height,
      0
    ),
  };
};
