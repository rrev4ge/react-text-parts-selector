import React from 'react';
import ReactDOM from 'react-dom';
import TextPartsSelector from './components/TextPartsSelector/TextPartsSelector';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <TextPartsSelector affectedContent="content" targetContent={[]} />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
