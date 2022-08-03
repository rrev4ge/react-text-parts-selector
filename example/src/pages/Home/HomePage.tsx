import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { TextSelectionHandler } from 'react-text-selection-handler';
import 'react-text-selection-handler/dist/index.css';
import './HomePage.css';
import { useWindowDimensions } from '../../hooks';


const defaultRegionList = [
  {
    x: 0.0,
    y: 0.0,
    width: 0.99,
    height: 0.11,
    id: 'First Crop title',
  },
  {
    x: 0.0,
    y: 0.38,
    width: 1.0,
    height: 0.17,
    id: 'Second Crop title',
    content: 'Second Crop title',
  },
  {
    x: 0.0,
    y: 0.88,
    width: 1.0,
    height: 0.12,
    id: 'Third Crop title',
    content: 'Third Crop title',
  },
];

export type TApprovalStatus = 'new' | 'approved' | 'rejected';


export interface IQuote {
  id: number;
  content: string;
  reference?: string;
  posBegin: number;
  posEnd: number;
  isExactly?: boolean;
  isPartial?: boolean;
  approvalStatus?: TApprovalStatus;
  comment?: string;
  paraId?: string;
  refcode?: string;
  context?: string;
  state?: string;
  color?: string;
}

export interface IQuoteSend {
  id: number;
  reference?: string;
  posBegin: number;
  posEnd: number;
  comment?: string;
  state?: string;
}

export interface IParagraph {
  paraId: string;
  refcode: string;
  content: string;
  quotes?: IQuote[];
}

const { Dragger } = Upload;

const HomePage = () => {
  const [uploadImg, setUploadImg] = useState<string>('');
  const windowDimensions = useWindowDimensions();
  const [paragraph, setParagraph] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<IQuote | null>(null);

  const [hoverQuote, setHoverQuote] = useState<{ id: string | number | null; isHover: boolean }>({
    id: null,
    isHover: false,
  });
  const [sortQuoteList, setSortQuoteList] = useState<IQuote[]>([]);

  // useEffect(() => {
  //   paragraphStore.fetch(history);
  // }, []);

  // useDidMountEffect(() => {
  //   const arr = [...sortQuoteList];
  //   setSortQuoteList(
  //       arr?.sort((x) => {
  //         return x.id === hoverQuote?.id ? +1 : -1;
  //       }),
  //   );
  // }, [hoverQuote.id]);
  //
  // useEffect(() => {
  //   setSortQuoteList(
  //       paragraphStore?.quotes.map((el, i) => {
  //         return { ...el, color: colorList[i % colorList.length] };
  //       }),
  //   );
  // }, [paragraphStore?.quotes]);

  const collapsePanelHandler = (target: { id: string | number | null; isHover: boolean }) => {
    setHoverQuote(target);
  };


  const setTargetContent = (newQuotes) => {
    const r = {
      ...selectedQuote,
      posBegin: newQuotes.find((q) => q?.id === selectedQuote?.id).start,
      posEnd: newQuotes.find((q) => q?.id === selectedQuote?.id).end,
    } as IQuote;
    setSelectedQuote(r);
  };

  return (
    <div
    className="flexPage"
    >
      {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
      <div
        style={{
          padding: 8,
          position: 'relative',
        }}
      >
        <TextSelectionHandler
            affectedContent={paragraph?.content}
            targetContent={
              selectedQuote
              ? [
                    {
                      id: selectedQuote.id,
                      content: selectedQuote.content,
                      start: selectedQuote.posBegin,
                      end: selectedQuote.posEnd,
                    },
                  ]
              : sortQuoteList.map((q) => ({
                id: q.id,
                content: q.content,
                start: q.posBegin,
                end: q.posEnd,
                color: q.color,
              }))
            }
            setTargetContent={setTargetContent}
            disabled={!selectedQuote}
            {...(!selectedQuote ? { hoverQuote } : {})}
        />
      </div>
    </div>
  );
};

export default HomePage;
