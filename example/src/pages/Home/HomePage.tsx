import { Card, Col, Input, Row, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { TextPartsSelector } from 'react-text-parts-selector';
import 'react-text-parts-selector/dist/index.css';
import './HomePage.css';
import {
  useDebounce,
  useDidMountEffect,
  useWindowDimensions,
} from '../../hooks';

const defaultParagraphList = [
  {
    paraId: 'eda9177a-8ec8-4bea-a739-b9270a7e5062',
    refcode: '147.42.12',
    quotes: [
      {
        id: '575c47b2-bf0d-493b-a630-d9ee39cd1c87',
        posBegin: 1,
        posEnd: 3,
        content: 'string',
      },
      {
        id: 'd2b45162-2f51-454b-b8e7-d65c467e0298',
        posBegin: 7,
        posEnd: 9,
        content: 'string',
      },
      {
        id: '122850e6-f184-43e5-b97d-38e7397f6150',
        posBegin: 11,
        posEnd: 31,
        content: 'string',
      },
    ],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque beatae delectus dignissimos dolores ipsum iusto libero neque nobis, saepe sapiente tempora tempore temporibus. Accusantium, cupiditate dolorem earum eum eveniet, ipsam magnam maiores officiis optio quaerat rem repudiandae vel voluptas voluptatibus,voluptatum? Aliquam, inventore labore nesciunt porro praesentium qui repellendus unde vel. Aliquam aliquid, autconsectetur culpa deleniti distinctio eveniet facere impedit iste minus molestias nisi officia omnis praesentiumquaerat quam quasi, quos ratione recusandae reiciendis reprehenderit saepe sint temporibus tenetur totam unde verovoluptates? Alias consequatur eos nesciunt, officia perferendis quisquam unde voluptate? Cum dicta doloremqudolores earum eveniet excepturi explicabo fuga fugit id illum labore nam, officiis omnis possimus quam quis quodrepellat rerum ullam velit vitae voluptatem voluptatibus voluptatum? Asperiores distinctio eos error fugiat optioprovident sed, sint sit suscipit. Ab adipisci alias blanditiis corporis culpa debitis distinctio doloribus, earumeum ex exercitationem expedita hic illo ipsa ipsam iure libero mollitia nemo nihil nisi numquam optio perspiciatisplaceat praesentium quasi, quo quos ratione rem, saepe soluta sunt tempore totam voluptate! Animi doloremqueducimus ex officiis provident quam quibusdam voluptatum. Accusamus beatae consectetur consequatur cupiditate,dignissimos error et eum eveniet ipsa laboriosam maxime minima.',
  },
];

export type TApprovalStatus = 'new' | 'approved' | 'rejected';

export interface IQuote {
  id: number | string;
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
  const windowDimensions = useWindowDimensions();
  const [paragraph, setParagraph] = useState<string>(
    defaultParagraphList[0].content,
  );

  const [sortQuoteList, setSortQuoteList] = useState<IQuote[]>(
    defaultParagraphList[0].quotes || [],
  );

  // useEffect(() => {
  //   setSortQuoteList(
  //       paragraphStore?.quotes.map((el, i) => {
  //         return { ...el, color: colorList[i % colorList.length] };
  //       }),
  //   );
  // }, []);

  const setTargetContent = (newQuotes) => {
    const r = [
      ...sortQuoteList.map((q, i) => ({
        ...q,
        posBegin: newQuotes.find((e) => e?.id === q?.id).start,
        posEnd: newQuotes.find((e) => e?.id === q?.id).end,
      })),
    ] as IQuote[];

    console.log({ newQuotes, r });

    // setSortQuoteList(r);
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
      <Col flex={`1 0 ${windowDimensions.width < 728 ? '100%' : '50%'}`}>
        <Card title="Selection Arrea" style={{ width: '100%' }}>
          <Card style={{ width: '100%' }}>
            <TextPartsSelector
              style={{ width: '100%', overflowWrap: 'anywhere' }}
              affectedContent={paragraph}
              targetContent={sortQuoteList.map((q) => ({
                id: q.id,
                content: q.content,
                start: q.posBegin,
                end: q.posEnd,
                color: q.color,
              }))}
              onTargetContentChange={setTargetContent}
              // isTriggered={!selectedQuote}
              multiple={true}
              // {...(!selectedQuote ? { hoverQuote } : {})}
            />
          </Card>
        </Card>
      </Col>
    </Row>
  );
};

export default HomePage;
