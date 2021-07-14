import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { rawData } from './rawData'

const useStyles = makeStyles((theme) => ({
  root: {
		//maxWidth: `calc(100% - 240px)`,
		flexGrow: 1
	},
	card:{
		flexGrow: 1,
		marginLeft: '240px'
	},
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
	},
	toolbar: theme.mixins.toolbar,
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const rawCards = rawData

return (
	<main>
		<div className={classes.toolbar}/>
		{
			rawCards.map((x)=>(
				<div key={x.name}>
					<Card className={classes.card} id={x.name}>
						<CardHeader title={x.name} subheader={x.use}/>
						<CardContent>
							<Typography variant="body2" color="textSecondary" component="p">
							
							</Typography>
							<TableContainer>
								<Table>{/*className="{classes.root}"*/}
									<TableHead>
										<TableRow>
											<StyledTableCell align="center">parameter</StyledTableCell>
											<StyledTableCell align="center">type</StyledTableCell>
											<StyledTableCell align="center">optional</StyledTableCell>
											<StyledTableCell align="center">description</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
                   {
											x.parameter.map((param)=>(
                        <TableRow>
												<StyledTableCell align="center">{param}</StyledTableCell>
												<StyledTableCell align="center">{x.type[x.parameter.indexOf(param)]}</StyledTableCell>
												<StyledTableCell align="center">{x.optional[x.parameter.indexOf(param)]? <CheckIcon/>:<ClearIcon/>}</StyledTableCell>
												<StyledTableCell align="center">{x.desc[x.parameter.indexOf(param)]}</StyledTableCell>
                        </TableRow>
                      ))
                      }
									</TableBody>
								</Table>
							</TableContainer><br/>
              <Typography>Returns: {x.returns? x.returns: "void?"}</Typography>
						<CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={()=>handleExpandClick(x.name)}
              aria-expanded={expanded}
              aria-label="examples"
            >
          <ExpandMoreIcon/>
        </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography>Examples:</Typography>
              {x.example.map((codeExample)=>(
                <pre style={{background: "#f2f3f5", minWidth: "100%"}}>{codeExample}</pre>
                ))
              }
              </CardContent>
            </Collapse>
            </CardContent>
					</Card>
				<br/>
				</div>
			))
		}
	</main>
);

}
