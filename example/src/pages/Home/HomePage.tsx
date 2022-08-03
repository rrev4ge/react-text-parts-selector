import { Card, Col, Input, Row, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { TextSelectionHandler } from 'react-text-selection-handler';
import 'react-text-selection-handler/dist/index.css';
import './HomePage.css';
import { useDebounce, useWindowDimensions } from '../../hooks';

const defaultParagraphList = [
  {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque beatae delectus dignissimos dolores ipsum iusto libero neque nobis, saepe sapiente tempora tempore temporibus. Accusantium, cupiditate dolorem earum eum eveniet, ipsam magnam maiores officiis optio quaerat rem repudiandae vel voluptas voluptatibus,voluptatum? Aliquam, inventore labore nesciunt porro praesentium qui repellendus unde vel. Aliquam aliquid, autconsectetur culpa deleniti distinctio eveniet facere impedit iste minus molestias nisi officia omnis praesentiumquaerat quam quasi, quos ratione recusandae reiciendis reprehenderit saepe sint temporibus tenetur totam unde verovoluptates? Alias consequatur eos nesciunt, officia perferendis quisquam unde voluptate? Cum dicta doloremqudolores earum eveniet excepturi explicabo fuga fugit id illum labore nam, officiis omnis possimus quam quis quodrepellat rerum ullam velit vitae voluptatem voluptatibus voluptatum? Asperiores distinctio eos error fugiat optioprovident sed, sint sit suscipit. Ab adipisci alias blanditiis corporis culpa debitis distinctio doloribus, earumeum ex exercitationem expedita hic illo ipsa ipsam iure libero mollitia nemo nihil nisi numquam optio perspiciatisplaceat praesentium quasi, quo quos ratione rem, saepe soluta sunt tempore totam voluptate! Animi doloremqueducimus ex officiis provident quam quibusdam voluptatum. Accusamus beatae consectetur consequatur cupiditate,dignissimos error et eum eveniet ipsa laboriosam maxime minima.',
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
  const [paragraph, setParagraph] = useState<any>(
    defaultParagraphList[0].content,
  );
  const [selectedQuote, setSelectedQuote] = useState<IQuote | null>(null);

  const [hoverQuote, setHoverQuote] = useState<{
    id: string | number | null;
    isHover: boolean;
  }>({
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

  const collapsePanelHandler = (target: {
    id: string | number | null;
    isHover: boolean;
  }) => {
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

  const handleChange = useDebounce((value: string) => {
    setParagraph(value);
  }, 800);

  return (
    <Row gutter={[16, 16]}>
      <Col flex={`1 0 ${windowDimensions.width < 728 ? '100%' : '50%'}`}>
        <Card title="Input Arrea" style={{ width: '100%' }}>
          <Input.TextArea
            autoSize={{ minRows: 14, maxRows: 14 }}
            style={{ width: '100%' }}
            placeholder="maxLength is 1501"
            maxLength={1501}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          />
        </Card>
      </Col>
      <Col
        flex={`1 0 ${windowDimensions.width < 728 ? '100%' : '50%'}`}
      >
        <Card
          title="Selection Arrea"
          style={{ width: '100%'}}
        >
          <Card style={{ width: '100%' }}>
            <TextSelectionHandler
              style={{ width: '100%', overflowWrap: 'anywhere' }}
              affectedContent={paragraph}
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
              // disabled={!selectedQuote}
              multiple={true}
              {...(!selectedQuote ? { hoverQuote } : {})}
            />
          </Card>
        </Card>
      </Col>
    </Row>
  );
};

export default HomePage;
