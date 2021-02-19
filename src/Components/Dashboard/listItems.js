import React from 'react';
import { useHistory } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CodeIcon from '@material-ui/icons/Code';
import Divider from '@material-ui/core/Divider';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AddIcon from '@material-ui/icons/Add';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import TokenService from '../../Services/token-service';

export default function MainListItems() {
  let history = useHistory();

  const handleClickButton = (path) => {
    history.push(path)
    if(path === '/login') TokenService.clearAuthToken();
  }

  return (
    <>
      <div>
        {/* <ListSubheader inset>Main header</ListSubheader> */}
        <ListItem button onClick={() => handleClickButton('/spells')}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="My Spells" />
        </ListItem>

        <ListItem button onClick={() => handleClickButton('/create')}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New Spell" />
        </ListItem>

        <ListItem button onClick={() => handleClickButton('/friends')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Friends" />
        </ListItem>

        <ListItem button onClick={() => handleClickButton('/gallery')}>
          <ListItemIcon>
            <PhotoAlbumIcon />
          </ListItemIcon>
          <ListItemText primary="All Spells" />
        </ListItem>
      </div>
      <Divider />
      <div>
        {/* <ListSubheader inset>Secondary header</ListSubheader> */}
        <ListItem button onClick={() => handleClickButton('/login')}>
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </>
  )
};

// export default function SecondaryListItems() {
//   let history = useHistory();

//   const handleClickSpells = () => {
//     history.push('/spells')
//   }
//   const handleClickFriends = () => {
//     history.push('/friends')
//   }

//   return (
//     <div>
//       <ListItem button onClick={() => handleClickSpells()}>
//         <ListItemIcon>
//           <CodeIcon />
//         </ListItemIcon>
//         <ListItemText primary="Spells" />
//       </ListItem>
//       <ListItem button onClick={handleClickFriends}>
//         <ListItemIcon>
//           <PeopleIcon />
//         </ListItemIcon>
//         <ListItemText primary="Friends" />
//       </ListItem>
//     </div>
//   )
// };

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// );