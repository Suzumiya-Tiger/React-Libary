import React, {
  CSSProperties,
  useState,
  useRef,
  FormEvent,
  ReactNode,
} from "react";
import classNames from "classnames";
import FormContext from "./FormContext";

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  style?: CSSProperties;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errors: Record<string, any>) => void;
  initialValues?: Record<string, any>;
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
  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );
  const validatorMap = useRef(new Map<string, () => void>());

  const errors = useRef<Record<string, any>>({});

  const onValueChange = (key: string, value: any) => {
    values[key] = value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    for (const [key, callbackFunc] of validatorMap.current) {
      if (typeof callbackFunc === "function") {
        errors.current[key] = callbackFunc();
      }
    }

    const errorList = Object.keys(errors.current).map(key => {
      return errors.current[key];
    });

    if (errorList.length > 0) {
      onFinishFailed?.(errors.current);
      return;
    }

    onFinish?.(values);
  };

  const handleValidateRegister = (name: string, cb: () => void) => {
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
