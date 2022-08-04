import { CSSProperties } from 'react';

export interface ITargetData {
  id: number | string;
  content: string;
  start: number;
  end: number;
  color?: string;
}

export type CallbackTargetContentFunction = (data: ITargetData[]) => any;

export interface TextSelectionHandlerProps {
  affectedContent: string;
  targetContent?: ITargetData[];
  multiple?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  setTargetContent?: CallbackTargetContentFunction;
  hoverQuote?: { id: string | number | null; isHover: boolean };
}
