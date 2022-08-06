import { CSSProperties } from 'react';

export interface ITargetData {
  id: number | string;
  content: string;
  start: number;
  end: number;
  color?: string;
}

export type CallbackTargetContentFunction = (data: ITargetData[]) => any;

export interface IDragState {
  isDragging: boolean;
  draggedHandle: Element | null;
}

export interface TextSelectionHandlerProps {
  affectedContent: string;
  targetContent?: ITargetData[];
  multiple?: boolean;
  isTriggered?: boolean;
  style?: CSSProperties;
  className?: string;
  onTargetContentChange?: CallbackTargetContentFunction;
  hoverQuote?: { id: string | number | null; isHover: boolean };
}
