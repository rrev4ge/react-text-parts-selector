import React, { CSSProperties, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CONSTANTS from '../../CONSTANTS';
import SpannedStringCharacter from './SpannedStringCharacter';
import TargetTrigger from './TargetTrigger/TargetTrigger';

const TargetStringCharacter = (props): JSX.Element => {
  const {
    index,
    targetData,
    target,
    setTargetData,
    selectionData,
    setSelectionData,
    disabled,
  } = props;

  const [hoverQuote, setHoverQuote] = useState<any>({
    id: targetData?.[0]?.id,
    isHover: true,
  });



  const [character, setCharacter] = useState();

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


  targetData?.forEach((item) => {
    if (item.start === index) {
      const id = `${item.id}-sel-handle-start`;
      setCharacter(
        <React.Fragment key={index}>
          {!disabled && (
            <TargetTrigger
              position="start"
              id={id}
              onClickCallback={(e) => {
                setHoverQuote({
                  id: item.id,
                  isHover: true,
                });
              }}
              onMouseDownCallback={
                !disabled ? onMouseDownHandler : () => undefined
              }
            />
          )}
          <SpannedStringCharacter
            index={index}
            stringCharacter={target}
            style={setStyle(index, targetData)}
            onMouseEnterCallback={!disabled ? resizeHandler : () => undefined}
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
        </React.Fragment>
      );
      return;
    }
    if (item.end === index) {
      const id = `${item.id}-sel-handle-end`;
      res = (
        <React.Fragment key={index}>
          <SpannedStringCharacter
            index={index}
            stringCharacter={target}
            style={setStyle(index, targetData)}
            onMouseEnterCallback={!disabled ? resizeHandler : () => undefined}
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
          {!disabled && (
            <TargetTrigger
              position="end"
              id={id}
              onClickCallback={(e) => {
                setHoverQuote({
                  id: item.id,
                  isHover: true,
                });
              }}
              onMouseDownCallback={
                !disabled ? onMouseDownHandler : () => undefined
              }
            />
          )}
        </React.Fragment>
      );
    }
  })



  return (<>{targetData?.forEach((item) => {
    if (item.start === index) {
      const id = `${item.id}-sel-handle-start`;
      res = (
        <React.Fragment key={index}>
          {!disabled && (
            <TargetTrigger
              position="start"
              id={id}
              onClickCallback={(e) => {
                setHoverQuote({
                  id: item.id,
                  isHover: true,
                });
              }}
              onMouseDownCallback={
                !disabled ? onMouseDownHandler : () => undefined
              }
            />
          )}
          <SpannedStringCharacter
            index={index}
            stringCharacter={target}
            style={setStyle(index, targetData)}
            onMouseEnterCallback={!disabled ? resizeHandler : () => undefined}
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
        </React.Fragment>
      );
      return;
    }
    if (item.end === index) {
      const id = `${item.id}-sel-handle-end`;
      res = (
        <React.Fragment key={index}>
          <SpannedStringCharacter
            index={index}
            stringCharacter={target}
            style={setStyle(index, targetData)}
            onMouseEnterCallback={!disabled ? resizeHandler : () => undefined}
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
          {!disabled && (
            <TargetTrigger
              position="end"
              id={id}
              onClickCallback={(e) => {
                setHoverQuote({
                  id: item.id,
                  isHover: true,
                });
              }}
              onMouseDownCallback={
                !disabled ? onMouseDownHandler : () => undefined
              }
            />
          )}
        </React.Fragment>
      );
    }
  });}</>);
};

export default TargetStringCharacter;
