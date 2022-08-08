import React, { CSSProperties, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDidMountEffect } from '../../hooks';
import {
  IDragState,
  ISelectedDataMapItem,
  TextSelectionHandlerProps,
} from '../../models';
import '../../assets/css/textPartsSelector.scss';
import CONSTANTS from '../../CONSTANTS';

export interface ITriggerProps {
  id: string | number;
  position: 'start' | 'end' | 'all';
}

export interface ISpanCharacterProps {
  style?: CSSProperties;
  triggerProps?: ITriggerProps;
}

const TextPartsSelector: React.FC<TextSelectionHandlerProps> = (
  props,
): React.ReactElement => {
  const {
    affectedContent,
    targetContent,
    activeTarget,
    onActiveTargetChange,
    multiple = targetContent && targetContent?.length > 1
      ? targetContent.length
      : false,
    isTriggered = true,
    onTargetContentChange,
  } = props;

  const [affectedData, setAffectedData] = useState<string>(affectedContent);
  const [selectedDataMap, setSelectedDataMap] = useState<
    ISelectedDataMapItem[]
  >(targetContent || []);

  const [triggeredSelectionId, setTriggeredSelectionId] = useState<
    string | number
  >(activeTarget || selectedDataMap?.[0]?.id || '');

  const [dragState, setDragState] = useState<IDragState>({
    isDragging: false,
    draggedHandle: null,
  });

  const [affectedTextNode, setAffectedTextNode] = useState<React.ReactNode>([]);

  useDidMountEffect(() => {
    setSelectedDataMap(targetContent || []);
  }, [targetContent]);

  useDidMountEffect(() => {
    setAffectedData(affectedContent);
  }, [affectedContent]);

  useEffect(() => {
    if (onTargetContentChange && !dragState.isDragging && isTriggered) {
      onTargetContentChange(selectedDataMap);
    }
  }, [dragState.isDragging]);

  useEffect(() => {
    if (isTriggered) {
      document.addEventListener('mouseup', mouseUpHandler);
    }
    if (!isTriggered) {
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    return () => document.removeEventListener('mouseup', mouseUpHandler);
  }, [isTriggered]);

  useEffect(() => {
    const charNode = Array.from(affectedData || '', (char, index) =>
      parsedStringCharacter(char, index),
    );
    setAffectedTextNode(charNode);
  }, [selectedDataMap, dragState, activeTarget]);

  // const setSelectedAreaStyle = (
  //   item: ISelectedDataMapItem,
  //   i: number,
  // ): CSSProperties | undefined => {
  //   const res = {
  //     backgroundColor:
  //       triggeredSelectionId &&
  //       !triggeredSelectionId.toString().includes(item.id.toString())
  //         ? item?.color
  //           ? `${item?.color}50`
  //           : `${CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length]}50`
  //         : item?.color ??
  //           CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length],
  //     color: 'white',
  //   };
  //   return res;

  // };

  const setSelectedAreaStyle = (
    index: number,
    targetArea: ISelectedDataMapItem[],
  ): CSSProperties | undefined => {
    let style: { [key: string]: string | number } = {};
    targetArea?.forEach((item, i) => {
      if (index >= item.start && index <= item.end) {
        console.log({ item });
        style = {
          ...style,
          backgroundColor:
            triggeredSelectionId &&
            !triggeredSelectionId.toString().includes(item.id.toString())
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

  const parsedStringCharacter = (
    char,
    index,
  ): React.ReactElement | React.ReactFragment => {
    let characterProps: ISpanCharacterProps | null = { style: {} };
    if (char === '|') {
      console.log('aa');
    }

    selectedDataMap?.forEach((item, i) => {
      if (item.start === index && item.end === index) {
        characterProps = {
          ...characterProps,
          triggerProps: { id: item.id, position: 'all' },
          // style: setSelectedAreaStyle(item, i) || {},
        };
        return;
      }
      if (item.start === index) {
        characterProps = {
          ...characterProps,
          triggerProps: { id: item.id, position: 'start' },
          // style: setSelectedAreaStyle(item, i) || {},
        };
        return;
      }
      if (item.end === index) {
        characterProps = {
          triggerProps: { id: item.id, position: 'end' },
          // style: setSelectedAreaStyle(item, i) || {},
        };
        // return;
      }
      // if (index > item.start && index < item.end) {
      //   characterProps = { style: setSelectedAreaStyle(item, i) || {} };
      // }
    });

    const span = (
      <span
        key={index}
        id={`${index}`}
        style={{
          cursor: 'inherit',
          ...setSelectedAreaStyle(index, selectedDataMap),
        }}
        className={`char char${index}`}
        onMouseEnter={isTriggered ? resizeHandler : () => undefined}
        onDoubleClick={
          multiple && (multiple === true || multiple > selectedDataMap.length)
            ? (e) => onCharacterDoubleClickHandler(e, index)
            : (e) => undefined
        }
      >
        {char}
      </span>
    );

    if (characterProps?.triggerProps) {
      const { position, id } = characterProps.triggerProps;
      return (
        <React.Fragment key={index}>
          {['all', 'start'].includes(position) && (
            <span
              id={`${id}-sel-handle-start`}
              className="sel-handle sel-start"
              onMouseDown={onTriggerMouseDownHandler}
              onMouseEnter={(e) => e.preventDefault()}
            >
              |
            </span>
          )}
          {span}
          {['all', 'end'].includes(position) && (
            <span
              id={`${id}-sel-handle-end`}
              className="sel-handle sel-end"
              onMouseDown={onTriggerMouseDownHandler}
              onMouseEnter={(e) => e.preventDefault()}
            >
              |
            </span>
          )}
        </React.Fragment>
      );
    }

    return span;
  };

  const resizeHandler = (e): void => {
    if (
      dragState.isDragging &&
      selectedDataMap &&
      !['sel-handle-start', 'sel-handle-end'].includes(e.relatedTarget.id)
    ) {
      const direction =
        dragState?.draggedHandle?.className === 'sel-handle sel-start'
          ? 'sel-start'
          : 'sel-end';

      if (direction === 'sel-start') {
        const newTargetData = selectedDataMap.map((item) => {
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
        setSelectedDataMap(newTargetData);
      }
      if (direction === 'sel-end') {
        const newTargetData = selectedDataMap.map((item) => {
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
        setSelectedDataMap(newTargetData);
      }
    }
  };

  const onTriggerMouseDownHandler = (e) => {
    setTriggeredSelectionId(e.target.id);
    onActiveTargetChange && onActiveTargetChange(e.target.id);
    setDragState({
      ...dragState,
      isDragging: true,
      draggedHandle: e.target,
    });
  };

  const onCharacterDoubleClickHandler = (e, index) => {
    setSelectedDataMap([
      ...selectedDataMap,
      {
        id: uuid(),
        content: 'string',
        start: index,
        end: index,
      },
    ]);
  };

  const mouseUpHandler = (): void => {
    if (isTriggered) {
      setDragState({
        ...dragState,
        isDragging: false,
      });
    }
  };

  return (
    <div
      className="componentContainer"
      style={{
        cursor: dragState.isDragging ? 'ew-resize' : 'auto',
      }}
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
