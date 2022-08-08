import { CSSProperties } from 'react';

export interface ISelectedDataMapItem {
  id: number | string;
  content: string;
  start: number;
  end: number;
  color?: string;
}

export type CallbackTargetContentFunction = (
  data: ISelectedDataMapItem[],
) => any;

export type CallbackActiveTargetFunction = (item: string | number) => any;

export interface IDragState {
  isDragging: boolean;
  draggedHandle: Element | null;
}

export interface TextSelectionHandlerProps {
  affectedContent: string;
  targetContent?: ISelectedDataMapItem[];
  multiple?: boolean | number;
  isTriggered?: boolean;
  onTargetContentChange?: CallbackTargetContentFunction;
  activeTarget?: number | string;
  onActiveTargetChange?: CallbackActiveTargetFunction;
}
