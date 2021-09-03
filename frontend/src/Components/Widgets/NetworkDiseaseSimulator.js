import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Cytoscape from 'cytoscape';
import Typography from '@material-ui/core/Typography';
import CytoscapeComponent from 'react-cytoscapejs';
import fcose from 'cytoscape-fcose';

Cytoscape.use(fcose);

export default function NetworkDiseaseSimulator(props) {
  let [iteration, setIteration] = useState(0)
  let [explored, setExplored] = useState(new Set());
  let [prob, setProb] = useState(100);
  let isNonEmptyString = e => (typeof(e) == "string" && e.length > 0)

  let elements = props.nodes.filter(isNonEmptyString).map(n => {
    return {
      data: { id: n, label: n }
    }
  }).concat(props.edges.filter(e=> e && (isNonEmptyString(e[0]) && isNonEmptyString(e[1]) && props.nodes.indexOf(e[0]) >= 0 && props.nodes.indexOf(e[1]) >= 0)).map(e => {
    return { data: { source: e[0], target: e[1] } }
  }))
  
  let cy;
  return (
    <Card elevation={4}>
      <CardContent>
      <Typography
        color="textSecondary" gutterBottom>Play with the slider and "Infect" and "Cure" buttons...</Typography>

        <Grid container
          spacing={1}
        >
          <Grid item xs>
            <Slider value={prob} onChange={(e, v) => setProb(v)} aria-labelledby="continuous-slider" />
          </Grid>
          <Grid item xs>
            <Typography paragraph>Contagion factor: {prob}%</Typography>
          </Grid>
        </Grid>

        <ButtonGroup
          color="primary"
          aria-label="vertical outlined primary button group"
        >
          <Button onClick={() => {
            let nextExplored = new Set();

            if (explored.size == 0)
              setExplored(new Set([props.patientZero || "you"]))
            else {
              let exploredNodes = cy.filter(
                Array.from(explored).map((e) => `node[label = "${e}"]`).join(","))

              let nextNodes = exploredNodes.neighborhood().map((n) => {
                return n.data().label
              })

              nextExplored = new Set(explored)

              for (let n of nextNodes) {
                if (n && Math.random() < prob / 100) {
                  nextExplored.add(n)
                }
              }

              setExplored(nextExplored)
            }
            setIteration(iteration => 1 + iteration)

            props.onChange && props.onChange({explored: Array.from(nextExplored), iteration: iteration+1})
          }}>Infect</Button>

          <Button onClick={() => { setExplored(new Set()); setIteration(0) }}>Cure</Button>
        </ButtonGroup>
      <CytoscapeComponent
          cy={(_cy) => {
            cy = _cy

            cy.filter("node").map((n) => {
              n.removeClass("highlight")
            })

            for (let e of explored) {
              let n = cy.filter(`node[label = "${e}"]`)
              n.addClass("highlight")
            }
          }}
          wheelSensitivity={0.1}
        elements={elements}
        stylesheet={[
          {
            selector: 'node',
            style: {
              content: "data(label)",
              width: 20,
              height: 20,
              //shape: 'circle'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1
            }
          },
          {
            selector: 'node.highlight',
            style: {
              color: "rgb(245, 0, 87)",
              backgroundColor: "rgb(245, 0, 87)",
            }
          }
        ]}
        style={{ width: '100%', height: '300px' }}
        layout={{ name: "fcose", idealEdgeLength: 100 }} />
       <Typography paragraph>Day: {iteration}</Typography>
        <Typography paragraph>Sick: {explored.size}</Typography>
      </CardContent>
    </Card>
  )
}