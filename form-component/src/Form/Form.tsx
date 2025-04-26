import React, {
  CSSProperties,
  useState,
  useRef,
  FormEvent,
  ReactNode,
} from "react";
import classNames from "classnames";
import FormContext, { FormContextProps } from "./FormContext";

// 推断出 FormValue 类型
type FormValue = Parameters<NonNullable<FormContextProps['onValueChange']>>[1];

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  style?: CSSProperties;
  onFinish?: (values: Record<string, FormValue>) => void;
  onFinishFailed?: (errors: Record<string, FormValue>) => void;
  initialValues?: Record<string, FormValue>;
  children?: ReactNode;
}

const Form: React.FC<FormProps> = ({
  className,
  style,
  onFinish,
  onFinishFailed,
  initialValues,
  children,
  ...others
}) => {
  const [values, setValues] = useState<Record<string, FormValue>>(
    initialValues || {}
  );
  const validatorMap = useRef(new Map<string, () => FormValue>());

  const errors = useRef<Record<string, FormValue>>({});

  const onValueChange = (key: string, value: FormValue) => {
    values[key] = value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    for (const [key, callbackFunc] of validatorMap.current) {
      if (typeof callbackFunc === "function") {
        errors.current[key] = callbackFunc();
      }
    }

    const errorResults = Object.values(errors.current);
    const actualErrors = errorResults.filter(result => result !== null);

    if (actualErrors.length > 0) {
      const errorFields = Object.entries(errors.current)
        .filter(([key, value]) => value !== null)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, FormValue>);
      onFinishFailed?.(errorFields);
      return;
    }

    onFinish?.(values);
  };

  const handleValidateRegister = (name: string, cb: () => FormValue) => {
    validatorMap.current.set(name, cb);
  };

  const cls = classNames("ant-form", className);

  return (
    <FormContext.Provider
      value={{
        onValueChange,
        values,
        setValues: v => setValues(v),
        validateRegister: handleValidateRegister,
      }}>
      <form {...others} className={cls} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;