import {
  CSSProperties,
  FC,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useMemo,
} from "react";
import useStore from "./hooks/useStore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./index.scss";
import { createPortal } from "react-dom";
import { useTimer } from "./hooks/useTimer";

export type Position = "top" | "bottom";

export interface MessageProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string | string[];
  content?: ReactNode | string;
  duration?: number;
  onClose?: (id: number) => void;
  id?: number;
  position?: Position;
}
const MessageItem: FC<MessageProps> = item => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });

  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {item.content}
    </div>
  );
};

export interface MessageRef {
  add: (messageProps: MessageProps) => void;
  update: (id: number, messageProps: Partial<MessageProps>) => void;
  remove: (id: number) => void;
  clearAll: () => void;
}
export const MessageProvider = forwardRef<MessageRef, MessageProps>(
  (props, ref) => {
    const { position = "top", children } = props;
    const { messageList, add, update, remove, clearAll } = useStore(position);
    if ("current" in ref!) {
      ref.current = {
        add,
        update,
        remove,
        clearAll,
      };
    }
    /*     useImperativeHandle(
      ref,
      () => {
        return { add, update, remove, clearAll };
      },
      []
    );
 */
    const positions = Object.keys(messageList) as Position[];

    const messageWrapper = (
      <div className="message-wrapper">
        {positions.map(direction => {
          return (
            <TransitionGroup
              className={`message-wrapper-${direction}`}
              key={direction}>
              {messageList[direction].map(item => {
                return (
                  <CSSTransition
                    key={item.id}
                    timeout={300}
                    classNames="message">
                    <MessageItem {...item} onClose={remove} />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          );
        })}
      </div>
    );

    const el = useMemo(() => {
      const el = document.createElement("div");
      el.className = "wrapper";
      document.body.appendChild(el);
      return el;
    }, []);

    return (
      <>
        {createPortal(messageWrapper, el)}
        {children}
      </>
    );
  }
);
