import React, { CSSProperties, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CONSTANTS from '../../CONSTANTS';
import SpannedStringCharacter from './SpannedStringCharacter';
import TargetTrigger from './TargetTrigger/TargetTrigger';

export interface ITriggerProps {
  id: string | number;
  position: 'start' | 'end';
}

const TargetStringCharacter = (props): React.ReactElement => {
  const {
    index,
    targetData,
    stringCharacter,
    setTargetData,
    selectionData,
    setSelectionData,
    isTriggered,
  } = props;

  const [hoverQuote, setHoverQuote] = useState<any>({
    id: targetData?.[0]?.id,
    isHover: true,
  });

  const getTriggeredProps = (): ITriggerProps | null => {
    let triggerProps: ITriggerProps | null = null;
    if (isTriggered) {
      targetData?.forEach((item) => {
        if (item.start === index) {
          triggerProps = { id: item.id, position: 'start' };
          return;
        }
        if (item.end === index) {
          triggerProps = { id: item.id, position: 'end' };
        }
      });
    }
    return triggerProps;
  };

  const [triggerProps, setTriggerProps] = useState<ITriggerProps | null>(
    getTriggeredProps(),
  );

  const setStyle = (
    index: number,
    targetTextNode: any[] | undefined,
  ): CSSProperties | undefined => {
    let style: { [key: string]: string | number } = {};
    targetTextNode?.forEach((item, i) => {
      if (index >= item.start && index <= item.end) {
        style = {
          ...style,
          backgroundColor:
            hoverQuote &&
            hoverQuote?.id !== null &&
            item.id !== hoverQuote?.id &&
            !hoverQuote?.isHover
              ? item?.color
                ? `${item?.color}50`
                : `${CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length]}50`
              : item?.color ??
                CONSTANTS.COLOR_LIST[i % CONSTANTS.COLOR_LIST.length],
          color: 'white',
        };
      }
    });
    return style;
  };

  const onMouseDownHandler = (e) => {
    setSelectionData({
      ...selectionData,
      isDragging: true,
      draggingHandle: e.target,
    });
  };

  const resizeHandler = (e): void => {
    if (
      selectionData.isDragging &&
      targetData &&
      !['sel-handle-start', 'sel-handle-end'].includes(e.relatedTarget.id)
    ) {
      const direction =
        selectionData?.draggingHandle?.className === 'sel-handle sel-start'
          ? 'sel-start'
          : 'sel-end';

      if (direction === 'sel-start') {
        const newTargetData = targetData.map((item) => {
          if (selectionData?.draggingHandle?.id.includes(item.id)) {
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
          if (selectionData?.draggingHandle?.id.includes(item.id)) {
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

  const span = (
    <SpannedStringCharacter
      index={index}
      stringCharacter={stringCharacter}
      style={setStyle(index, targetData)}
      onMouseEnterCallback={isTriggered ? resizeHandler : () => undefined}
      onClickCallback={(e) => {
        setTargetData([
          ...targetData,
          {
            id: uuid(),
            content: 'string',
            start: index,
            end: index + 1,
          },
        ]);
      }}
    />
  );

  return triggerProps ? (
    <React.Fragment key={index}>
      {triggerProps.position === 'start' && span}
      <TargetTrigger
        position={triggerProps.position}
        id={triggerProps.id}
        onClickCallback={(e) => {
          setHoverQuote({
            id: triggerProps.id,
            isHover: true,
          });
        }}
        onMouseDownCallback={onMouseDownHandler}
      />
      {triggerProps?.position === 'end' && span}
    </React.Fragment>
  ) : (
    span
  );
};

export default TargetStringCharacter;
