import React, { useEffect, useMemo, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

export function ArchitecturalDiagram (props){
  let nodeStyles = props.highlightedNodes.map(e=>{return {
    selector: "#" + e.id,
    style: {
      backgroundColor: e.color
    }
  }})

  let edgeStyles = props.highlightedEdges.map(e=>{return {
    selector: '#' + e.id,
      style: {
        'line-color': e.color,
        'target-arrow-color': e.color
      }
  }})

  let moreStyles = nodeStyles.concat(edgeStyles)

  return <CytoscapeComponent
    cy={(_cy) => { }}
    wheelSensitivity={0.1}
    elements={[
      { 
        data: {
          id: "Racket",
          label: "Racket",
        } 
      },
      { 
        data: {
          id: "React",
          label: "React"
        } 
      },
      { 
        data: {
          id: "Unreal",
          label: "Unreal"
        } 
      },
      { 
        data: {
          id:"React-Racket",
          source: "React",
          target: "Racket"
        } 
      },
      { 
        data: {
          id:"Racket-React",
          source: "Racket",
          target: "React"
        } 
      },
      { 
        data: {
          id:"Racket-Unreal",
          source: "Racket",
          target: "Unreal"
        } 
      },
      { 
        data: {
          id:"Unreal-Racket",
          source: "Unreal",
          target: "Racket"
        } 
      },
    ]}
    stylesheet={[
          {
            selector: 'node',
            style: {
              content: "data(label)",
              shape: 'rectangle',
              fontSize: 20,
              color: "white",
              width: 50,
              height: 50,
            }
          },
          {
            selector: 'edge',
              style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
              }
          },
          {
            selector: 'node.highlight',
            style: {
              color: "rgb(245, 0, 87)",
              backgroundColor: "rgb(245, 0, 87)",
            }
          }
    ].concat(moreStyles)}
    style={{ width: '100%', height: '300px' }}
    layout={{ name: "preset", 
      positions: {
        "Racket": {x:0, y:0},
        "React": {x:-200, y:-100},
        "Unreal": {x:200, y:-100}
      }}} 
    />
}