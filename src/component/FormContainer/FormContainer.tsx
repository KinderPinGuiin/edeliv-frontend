import { Stack } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createMixins";
import { ReactElement } from "react";

/**
 * Contains all the props of a FormContainer component.
 */
export type FormContainerProps = {
  /**
   * The elements to place inside the form container.
   */
  children: ReactElement[],

  /**
   * The form container style to apply.
   */
  style?: CSSProperties,

  /**
   * The stack spacing number.
   */
  stackSpacing?: number,

  /**
   * The form method.
   */
  method?: string,

  /**
   * The form action.
   */
  action: string,

  /**
   * On submit callback.
   */
  onSubmit?: (e: any) => void,
};

/**
 * A form container that stacks your elements inside of it. 
 */
export default function FormContainer({ children, style, stackSpacing, method, action, onSubmit }: FormContainerProps) {
  return (
    <form 
      method={ method ?? "GET" } 
      action={ action } 
      style={{ ...style }}
      onSubmit={onSubmit ?? (() => 0)}>
      <Stack spacing={ stackSpacing ?? 2 }>
        { children }
      </Stack>
    </form>
  )
}