import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDidMountEffect } from '../../hooks';
import { ITargetData, TextSelectionHandlerProps } from '../../models';
import CONSTANTS from '../../CONSTANTS';
import '../../assets/css/textPartsSelector.scss';
import TargetStringCharacter from '../TargetStringCharacter';

const TextPartsSelector: React.FC<TextSelectionHandlerProps> = (
  props,
): React.ReactElement => {
  const {
    affectedContent,
    targetContent,
    multiple = false,
    disabled = false,
    style,
    className,
    setTargetContent,
  } = props;

  const [affectedData, setAffectedData] = useState<string>(affectedContent);
  const [targetData, setTargetData] = useState<ITargetData[]>(
    targetContent || [],
  );
  const [affectedTextNode, setAffectedTextNode] = useState<React.ReactNode>([]);
  const [selectionData, setSelectionData] = useState<{
    [key: string]: boolean | number | null | any;
  }>({
    isDragging: false,
    draggingHandle: null,
  });

  const [hoverQuote, setHoverQuote] = useState<any>({
    id: targetData?.[0]?.id,
    isHover: true,
  });

  const mouseUpHandler = (): void => {
    if (!disabled) {
      setSelectionData({
        ...selectionData,
        isDragging: false,
      });
    }
  };

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('mouseup', mouseUpHandler);
    }
    if (disabled) {
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    return () => document.removeEventListener('mouseup', mouseUpHandler);
  }, [disabled]);

  useEffect(() => {
    const charNode = Array.from(affectedData || '', (target, i) => (
      <TargetStringCharacter index={i} key={i} target={target} />
    ));
    setAffectedTextNode(charNode);
  }, [targetData, selectionData]);

  useDidMountEffect(() => {
    if (
      setTargetContent &&
      targetData &&
      !selectionData.isDragging &&
      !disabled
    ) {
      setTargetContent(targetData);
    }
  }, [selectionData.isDragging]);

  useDidMountEffect(() => {
    setTargetData(targetContent || []);
  }, [targetContent]);

  useDidMountEffect(() => {
    setAffectedData(affectedContent);
  }, [affectedContent]);

  return (
    <div
      className={className}
      style={style ?? { display: 'flex', overflow: 'break-word' }}
      ref={(el) => {
        el &&
          el.addEventListener('selectstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      {affectedTextNode}
    </div>
  );
};

export default TextPartsSelector;
