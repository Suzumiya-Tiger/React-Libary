import { useState } from "react";
import { MessageProps, Position } from "..";
let count = 1;
export function getId(messageProps: MessageProps) {
  if (messageProps.id) {
    return messageProps.id;
  }
  count += 1;
  return count;
}

export function getMessagePosition(messageList: MessageList, id: number) {
  for (const [position, list] of Object.entries(messageList)) {
    if (list.find(item => item.id === id)) {
      return position as Position;
    }
  }
}

export function findMessage(messageList: MessageList, id: number) {
  const position = getMessagePosition(messageList, id);

  const index = position
    ? messageList[position].findIndex(message => message.id === id)
    : -1;
  return {
    position,
    index,
  };
}
type MessageList = {
  top: MessageProps[];
  bottom: MessageProps[];
};

const initialState: MessageList = {
  top: [],
  bottom: [],
};
/**
 * 通过 useState 创建一个列表，然后返回这个 state 和 add、remove、update、clearAll 方法
 * 列表的top和bottom两种类型是因为Message可以出现在上面或者下面
 */
function useStore(defaultPosition: Position) {
  const [messageList, setMessageList] = useState<MessageList>({
    ...initialState,
  });

  return {
    messageList,
    add: (messageProps: MessageProps) => {
      const id = getId(messageProps);
      setMessageList(prevState => {
        if (messageProps?.id) {
          const position = getMessagePosition(prevState, id);
          if (position) {
            return prevState;
          }
        }
        const position = messageProps.position || defaultPosition;
        const isTop = position.includes("top");
        const messages = isTop
          ? [{ ...messageProps, id }, ...(prevState[position] ?? [])]
          : [...(prevState[position] ?? []), { ...messageProps, id }];
        // 下面采用的是对应position的数组覆盖更新的策略
        return {
          ...prevState,
          [position]: messages,
        };
      });
      return id;
    },
    // update是为了更新已经存在的全局提示的props
    update: (id: number, messageProps: Partial<MessageProps>) => {
      if (!id) return;
      setMessageList(preState => {
        const nextState = { ...preState };
        const { position, index } = findMessage(nextState, id);
        if (position && index !== -1) {
          nextState[position][index] = {
            ...nextState[position][index],
            ...messageProps,
          };
        }
        return nextState;
      });
    },
    // remove是为了删除已经存在的全局提示
    remove: (id: number) => {
      setMessageList(prevState => {
        const position = getMessagePosition(prevState, id);
        if (position) {
          return {
            ...prevState,
            [position]: prevState[position].filter(item => item.id !== id),
          };
        }
      });
    },
    // clearAll是为了删除所有全局提示
    clearAll: () => {
      setMessageList({ ...initialState });
    },
  };
}

export default useStore;
