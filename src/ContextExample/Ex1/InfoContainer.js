import React from 'react'
import ListContainer from '../ListContainer'
import GraphContainer from './GraphContainer'
import { ThingsProvider } from '../thingsContext'

const InfoContainer = props => {    
  // pretend we are fetching these 'things'
  const things = [
      {id: 1, name: 'thing 1', length: 5},
      {id: 2, name: 'thing 2', length: 2},
      {id: 3, name: 'thing 3', length: 6},
      {id: 4, name: 'thing 4', length: 10},
      {id: 5, name: 'thing 5', length: 1}
    ]
  return(
    <div>
        <ThingsProvider value={things}>
            <ListContainer/>
            <GraphContainer/>
        </ThingsProvider>
    </div>
  )
}
export default InfoContainer