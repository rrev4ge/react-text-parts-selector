import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDidMountEffect } from '../../hooks';
import {
  IDragState,
  ITargetData,
  TextSelectionHandlerProps,
} from '../../models';
import '../../assets/css/textPartsSelector.scss';
import TargetStringCharacter from '../TargetStringCharacter';
import CONSTANTS from '../../CONSTANTS';

const TextPartsSelector: React.FC<TextSelectionHandlerProps> = (
  props,
): React.ReactElement => {
  const {
    affectedContent,
    targetContent,
    multiple = false,
    isTriggered = true,
    style,
    className,
    onTargetContentChange,
  } = props;

  const [affectedData, setAffectedData] = useState<string>(affectedContent);
  const [targetData, setTargetData] = useState<ITargetData[]>(
    targetContent || [],
  );

  const [hoverQuote, setHoverQuote] = useState<any>({
    id: targetData?.[0]?.id,
    isHover: true,
  });

  const [dragState, setDragState] = useState<IDragState>({
    isDragging: false,
    draggedHandle: null,
  });

  const [affectedTextNode, setAffectedTextNode] = useState<React.ReactNode>([]);

  const setTargetAreaStyle = (
    index: number,
    targetArea: any[] | undefined,
  ): CSSProperties | undefined => {
    let style: { [key: string]: string | number } = {};
    targetArea?.forEach((item, i) => {
      if (index >= item.start && index <= item.end) {
        style = {
          ...style,
          backgroundColor:
            hoverQuote &&
            hoverQuote?.id !== null &&
            item.id !== hoverQuote?.id &&
            !hoverQuote?.isHover
              ? item?.color
                ? `${item?.color}20`
                : `${CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length]}20`
              : item?.color ??
                CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length],
          color: 'white',
        };
      }
    });
    return style;
  };

  const onMouseDownHandler = (e) => {
    setHoverQuote({
      id: e.target.id,
      isHover: true,
    });
    setDragState({
      ...dragState,
      isDragging: true,
      draggedHandle: e.target,
    });
  };

  const targetArea = (
    index,
    targetList,
    target,
  ): React.ReactElement | React.ReactFragment => {
    let res = (
      <span
        key={index}
        id={`${index}`}
        style={setTargetAreaStyle(index, targetData)}
        className={`char char${index}`}
        onMouseEnter={isTriggered ? resizeHandler : () => undefined}
      >
        {target}
      </span>
    );
    targetList?.forEach((item) => {
      const id = `${item.id}-sel-handle-start`;
      // const id = `${item.id}`;
      if (item.start === index) {
        res = (
          <React.Fragment key={index}>
            {isTriggered && (
              <span
                id={id}
                className="sel-handle sel-start"
                onMouseDown={onMouseDownHandler}
                onMouseEnter={(e) => e.preventDefault()}
              >
                |
              </span>
            )}
            {res}
          </React.Fragment>
        );
        return;
      }
      if (item.end === index) {
        res = (
          <React.Fragment key={index}>
            {res}
            {isTriggered && (
              <span
                id={id}
                className="sel-handle sel-end"
                onMouseDown={isTriggered ? onMouseDownHandler : () => undefined}
                onMouseEnter={
                  isTriggered ? (e) => e.preventDefault() : () => undefined
                }
              >
                |
              </span>
            )}
          </React.Fragment>
        );
      }
    });
    return res;
  };

  useDidMountEffect(() => {
    setTargetData(targetContent || []);
  }, [targetContent]);

  useDidMountEffect(() => {
    setAffectedData(affectedContent);
  }, [affectedContent]);

  useEffect(() => {
    console.log({ dragState });

    if (onTargetContentChange && !dragState.isDragging && isTriggered) {
      onTargetContentChange(targetData);
    }
  }, [dragState.isDragging]);

  const mouseUpHandler = (): void => {
    if (isTriggered) {
      setDragState({
        ...dragState,
        isDragging: false,
      });
    }
  };

  useEffect(() => {
    if (isTriggered) {
      document.addEventListener('mouseup', mouseUpHandler);
    }
    if (!isTriggered) {
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    return () => document.removeEventListener('mouseup', mouseUpHandler);
  }, [isTriggered]);

  const resizeHandler = (e): void => {
    console.log(
      dragState.isDragging,
      targetData,
      !['sel-handle-start', 'sel-handle-end'].includes(e.relatedTarget.id),
    );

    if (
      dragState.isDragging &&
      targetData &&
      !['sel-handle-start', 'sel-handle-end'].includes(e.relatedTarget.id)
    ) {
      const direction =
        dragState?.draggedHandle?.className === 'sel-handle sel-start'
          ? 'sel-start'
          : 'sel-end';
      console.log({ e2: e, direction });

      if (direction === 'sel-start') {
        const newTargetData = targetData.map((item) => {
          if (dragState?.draggedHandle?.id.includes(item.id.toString())) {
            return {
              ...item,
              start:
                parseInt(e.target.id, 10) < item.end
                  ? parseInt(e.target.id, 10)
                  : item.end,
            };
          }
          return item;
        });
        setTargetData(newTargetData);
      }
      if (direction === 'sel-end') {
        const newTargetData = targetData.map((item) => {
          if (dragState?.draggedHandle?.id.includes(item.id.toString())) {
            return {
              ...item,
              end:
                parseInt(e.target.id, 10) > item.start
                  ? parseInt(e.target.id, 10)
                  : item.start,
            };
          }
          return item;
        });
        setTargetData(newTargetData);
      }
    }
  };

  useEffect(() => {
    // const charNode = Array.from(affectedData || '').map((item, i) => (
    //   <TargetStringCharacter
    //     index={i}
    //     key={i}
    //     stringCharacter={item}
    //     targetData={targetData}
    //     setTargetData={setTargetData}
    //     isTriggered={isTriggered}
    //     onTargetContentChange={onTargetContentChange}
    //     dragState={dragState}
    //     setDragState={setDragState}
    //     resizeHandler={resizeHandler}
    //   />
    // ));
    const charNode = Array.from(affectedData || '', (target, i) =>
      targetArea(i, targetData, target),
    );
    setAffectedTextNode(charNode);
  }, [targetData, dragState]);

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
