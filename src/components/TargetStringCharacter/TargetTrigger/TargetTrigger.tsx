import React, { CSSProperties } from 'react';

export interface ITargetTriggerProps {
  id: string | number;
  position: 'start' | 'end';
  onMouseDownCallback?: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => void;
  onClickCallback?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const TargetTrigger: React.FC<ITargetTriggerProps> = (
  props,
): React.ReactElement => {
  const { id, position, onMouseDownCallback, onClickCallback } = props;

  const onMouseDownHandler = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    onMouseDownCallback && onMouseDownCallback(e);
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      e.target.onselectstart = () => {
        return false;
      };
    }
  };

  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onClickCallback && onClickCallback(e);
  };

  return (
    <span
      id={`${id}-sel-handle-${position}`}
      className={`sel-handle sel-${position}`}
      onMouseDown={onMouseDownHandler}
      onMouseEnter={(e) => e.preventDefault()}
      onClick={onClickHandler}
    >
      |
    </span>
  );
};

export default TargetTrigger;
