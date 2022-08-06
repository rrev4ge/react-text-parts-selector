import React, { CSSProperties, useEffect, useState } from 'react';
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
    isTriggered,
    dragState,
    setDragState,
    resizeHandler,
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

  useEffect(() => {
    setTriggerProps(() => getTriggeredProps());
  }, [targetData, dragState]);

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
    setDragState({
      ...dragState,
      isDragging: true,
      draggedHandle: e.target,
    });
  };

  const span = (
    <SpannedStringCharacter
      index={index}
      stringCharacter={stringCharacter}
      style={setStyle(index, targetData)}
      onMouseEnterCallback={
        isTriggered && dragState.isDragging ? resizeHandler : () => undefined
      }
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
      {triggerProps.position === 'end' && span}
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
      {triggerProps?.position === 'start' && span}
    </React.Fragment>
  ) : (
    span
  );
};

export default TargetStringCharacter;
