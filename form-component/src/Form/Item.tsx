import React, {
  ReactNode,
  CSSProperties,
  useState,
  useContext,
  ReactElement,
  useEffect,
  ChangeEvent,
} from "react";
import classNames from "classnames";
import Schema, { RuleItem } from "async-validator";

import FormContext, { FormValue } from "./FormContext";


export interface ItemProps {
  className?: string;
  style?: CSSProperties;
  label?: ReactNode;
  name?: string;
  valuePropName?: string;
  rules?: RuleItem[]; // 直接使用 async-validator 的 RuleItem 类型
  children?: ReactElement;
}
const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e
  if (target.type === 'checkbox') {
    return target.checked
  } else if (target.type === "radio") {
    return target.value;
  }
  return target.value;

};



const Item = (props: ItemProps) => {
  const { className, style, label, name, valuePropName, rules, children } =
    props;

  const [value, setValue] = useState<string | number | boolean | null | undefined>();
  const [error, setError] = useState("");

  // 表单项验证函数：验证当前表单项的值是否符合规则
  const handleValidate = (value: FormValue) => {
    if (!name) return null; // Add this check: Ensures 'name' is defined before use
    let errorMsg = null  // 初始化错误信息为null
    if (Array.isArray(rules) && rules.length) {  // 检查是否有验证规则
      // 创建验证器实例
      const validator = new Schema({
        [name]: rules.map(rule => { // 'name' is now guaranteed to be a string here
          return {
            type: "string",  // 设置默认类型为string
            ...rule  // 保留原规则中的其他属性
          }
        })
      })
      // 执行验证
      validator.validate({ [name]: value }, (errors) => {
        if (errors) {
          if (errors?.length) {  // 如果存在错误
            setError(errors[0].message!)  // 设置第一个错误信息到状态
            errorMsg = errors[0].message  // 保存错误信息到本地变量
          }
        } else {
          // Clear error if validation passes
          setError("");
          errorMsg = null;
        }
      })
    }
    return errorMsg  // 返回错误信息
  }
  const { onValueChange, values, validateRegister } = useContext(FormContext);

  useEffect(() => {
    if (name) {
      validateRegister?.(name, () => handleValidate(value));
    }
  }, [value]);


  useEffect(() => {
    if (values && name) {
      if (value !== values?.[name]) {
        setValue(values?.[name]);
      }
    }
  }, [values, name, value]);

  // 不设置name的简单元素直接返回就行了
  if (!name) {
    return children;
  }

  const propsName: Record<string, unknown> = {};

  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }

  const childEle = React.Children.toArray(children).length > 1 ? children : React.cloneElement(children!, {
    ...propsName,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = getValueFromEvent(e)
      setValue(value)
      onValueChange?.(name, value)

      handleValidate(value)
    }
  })

  const cls = classNames("ant-form-item", className);

  return (
    <div className={cls} style={style}>
      <div>
        {
          label && <label>{label}</label>
        }
      </div>
      <div>
        {childEle}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  )
};

export default Item;