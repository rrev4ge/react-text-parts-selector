import React, { CSSProperties } from 'react';

export interface ISpanedStringCharacterProps {
  index: number;
  stringCharacter: string;
  onMouseEnterCallback?: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => void;
  onClickCallback?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  style?: CSSProperties;
}

const SpannedStringCharacter: React.FC<ISpanedStringCharacterProps> = (
  props,
): React.ReactElement => {
  const {
    index,
    stringCharacter,
    style,
    onMouseEnterCallback,
    onClickCallback,
  } = props;

  const onMouseEnterHandler = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    onMouseEnterCallback && onMouseEnterCallback(e);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onClickCallback && onClickCallback(e);
  };

  return (
    <span
      id={`${index}`}
      style={style}
      className={`char char${index}`}
      onMouseEnter={onMouseEnterHandler}
      ref={(el) => {
        el &&
          el.addEventListener('selectstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });
      }}
      onClick={onClickCallback}
    >
      {stringCharacter}
    </span>
  );
};

export default SpannedStringCharacter;
