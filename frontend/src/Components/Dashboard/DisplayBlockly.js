import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Prompt } from "react-router-dom";
import { BlocklyWorkspace } from "react-blockly";
import useStyles from '../../styles.js';
import Blockly from "blockly";
import Button from '@material-ui/core/Button';
import "./customBlocks/custom_Blocks";

const DisplayBlockly = ({onCompile}) => {

  const [xml, setXml] = useState("");
  //const [javascriptCode, setJavascriptCode] = useState("");

  const initialXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';
  
  const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Barebones Syntax",
        colour: "#c1ba31",
        contents: [

          {
            kind: "block",
            type: "paren",
          },
          {
            kind: "block",
            type: "atom",
          },
        ],
      },
      {
        kind: "category",
        name: "Spells",
        colour: "#00b3b3",
        contents: [

          {
            kind: "block",
            type: "paren",
          },
          {
            kind: "block",
            type: "atom",
          },
          {
            kind: "block",
            type: "color",
          },
          {
            kind: "block",
            type: "if_statement",
          },
          {
            kind: "block",
            type: "color_drop",
          },
          {
            kind: "block",
            type: "force",
          },
          {
            kind: "block",
            type: "anchor",
          },
          {
            kind: "block",
            type: "deanchor",
          },

        ],
      },
    ],
  };

  const classes = useStyles();
  let history = useHistory();
  const [spellText, setSpellText] = useState(undefined)

  function workspaceDidChange(workspace) {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    //setJavascriptCode(code);
    //setSpellText(code);
  }


    const [displayBlocks, setView] = useState(false);
    const [showBlockly, setShowBlockly] = useState(true)

    function toggleView(){
        setView(!displayBlocks)
        if(displayBlocks){
        setShowBlockly(true)
        }
        else {
        setShowBlockly(false)
        }
    }
    
    
    return(
        
        <div>
            <Button onClick={() => {toggleView()}} color="primary">
                Blockly: {showBlockly ? "ON" : "OFF"}
            </Button>
            
            <div style={{display: showBlockly ? "block" : "none"}}>
                <BlocklyWorkspace
                    toolboxConfiguration={toolboxCategories}
                    initialXml={initialXml}
                    className={classes.spellDetailsCodeMirror}
                    workspaceConfiguration={{
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: "#ccc",
                        snap: true,
                    },
                    }}
                    onWorkspaceChange={(workspace) => {   
                      const code = Blockly.JavaScript.workspaceToCode(workspace);
                      onCompile(code)
                    } }
                    onXmlChange={setXml}
                />
            </div>
        </div>
    )
}

export default DisplayBlockly;