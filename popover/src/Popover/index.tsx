import { CSSProperties, PropsWithChildren, ReactNode, useMemo } from "react";
import {
  useInteractions,
  useFloating,
  useClick,
  useDismiss,
  offset,
  arrow,
  FloatingArrow,
  flip,
  useHover,
  AlignedPlacement,
  Side,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import "./index.css";
import { createPortal } from "react-dom";

interface PopoverProps extends PropsWithChildren {
  content: ReactNode;
  trigger?: "hover" | "click";
  placement?: Side | AlignedPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}
export default function Popover(props: PopoverProps) {
  const {
    open,
    onOpenChange,
    content,
    children,
    placement = "bottom",
    trigger = "hover",
    className,
    style,
  } = props;

  const arrowRef = useRef(null);

  const [isOpen, setIsOpen] = useState(open);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: open => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    placement,
    middleware: [offset(10), arrow({ element: arrowRef }), flip()],
  });

  const interaction =
    trigger === "hover" ? useHover(context) : useClick(context);

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    interaction,
    dismiss,
  ]);
  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = `wrapper`;

    document.body.appendChild(el);
    return el;
  }, []);
  const floating = isOpen && (
    <div
      className="popover-floating"
      ref={refs.setFloating}
      {...getFloatingProps()}
      style={floatingStyles}>
      {content}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
      />
    </div>
  );
  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className}
        style={style}>
        {children}
      </span>
      {createPortal(floating, el)}
    </>
  );
}
