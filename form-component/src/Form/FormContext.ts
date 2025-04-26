import { createContext } from "react";

export type FormValue = string | number | boolean | null | undefined;

export interface FormContextProps {
  values?: Record<string, FormValue>;
  setValues?: (values: Record<string, FormValue>) => void;
  onValueChange?: (key: string, value: FormValue) => void;
  validateRegister?: (name: string, cb: () => FormValue) => void;
}

export default createContext<FormContextProps>({});
