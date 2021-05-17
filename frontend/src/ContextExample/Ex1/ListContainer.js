import React, { useContext } from 'react'
import ThingsContext from './thingsContext'
import ListItem from '../components/ListItem'
const ListDisplay = props => {   
  const things = useContext(ThingsContext)   
  const renderThings = things => {
    return things.map( thing => {
        return <ListItem key={thing.id} thing={thing}/>
    })
  } 
  return(
      <ul>
          {renderThings(things)}
      </ul>
  )
}
export default ListDisplay