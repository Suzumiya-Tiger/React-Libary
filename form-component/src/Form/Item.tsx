import React, {
  ReactNode,
  CSSProperties,
  useState,
  useContext,
  ReactElement,
  useEffect,
  PropsWithChildren,
  ChangeEvent,
} from "react";
import classNames from "classnames";
import Schema, { Rules } from "async-validator";

import FormContext from "./FormContext";

export interface ItemProps {
  className?: string;
  style?: CSSProperties;
  label?: ReactNode;
  name?: string;
  valuePropName?: string;
  rules?: Array<Record<string, any>>;
  children?: ReactElement;
}

const Item = (props: ItemProps) => {
  const { className, style, label, name, valuePropName, rules, children } =
    props;

  const [value, setValue] = useState<string | number | boolean>();
  const [error, setError] = useState("");

  const { onValueChange, values, validateRegister } = useContext(FormContext);

  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name]);
    }
  }, [values, name, value]);

  // 不设置name的简单元素直接返回就行了
  if (!name) {
    return children;
  }

  const propsName: Record<string, any> = {};

  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }

  const childEle=React.Children.toArray(children).length>1?
};
