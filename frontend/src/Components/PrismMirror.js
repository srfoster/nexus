import React, { useRef, useEffect, useState, Fragment } from 'react';
import Editor from "react-simple-code-editor";
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import { Button } from '@material-ui/core';

const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`

export function PrismMirror(props) {
  let [code, setCode] = useState(exampleCode)

  let onValueChange = code => {
    setCode(code)
  }

  const styles = {
    root: {
      boxSizing: 'border-box',
      fontFamily: '"Dank Mono", "Fira Code", monospace',
      ...theme.plain
    }
  }

  let highlight = code => (
    <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => {
                console.log(token)
                if (token.content == "BUTTON") { return <Button>Button</Button> }
                return (<span {...getTokenProps({ token, key })} />)
              })}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  )

    return (
      <Editor
        value={code}
        onValueChange={onValueChange}
        highlight={highlight}
        padding={10}
        style={styles.root}
      />
    )
}