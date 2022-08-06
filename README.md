# TEXT PARTS SELECTOR COMPONENT (this is alpha version, do not recomended for production use)

## <a href="https://rrev4ge.github.io/react-text-parts-selector" target="_blank">DEMO on GitHub Pages</a>

![demo_screenshot](<./react-text-parts-selector-(demo).png>)

### Call Preview

```jsx
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
  setTargetContent={setTargetContent}
  // isTriggered={!selectedQuote}
  multiple={true}
  // {...(!selectedQuote ? { hoverQuote } : {})}
/>
```

### TERMS OF REFERENCE FOR THE COMPONENT FOR SELECTING TEXT PARTS FROM <a href="https://gist.github.com/mjr27/477972795a0e8c08e2d45dd9771e8c78" target="_blank">Cyril mjr27</a>:

### Examples

I have not seen components with such functionality (logically, otherwise I would
there was no such task). The closest thing I've found on jQuery:

- https://codepen.io/mattsich/pen/MKvmxQ

### Task:

...TODO...
