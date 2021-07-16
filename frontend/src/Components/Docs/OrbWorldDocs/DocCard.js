import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { rawData } from "./rawData";

const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
    marginRight: "0px"//240
  },
  toolbar: theme.mixins.toolbar
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

export default function DocCard() {
  const classes = useStyles();
  const rawCards = rawData;

  return (
    <main>
      {rawCards.map((x) => (
        <div key={x.name}>
          <Card className={classes.card} id={x.name} style={{borderRadius:"5px"}}>
            <CardHeader align="left" title={x.name} subheader={x.use} />
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
              ></Typography>
              <TableContainer style={{borderRadius:"5px"}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        parameter
                      </StyledTableCell>
                      <StyledTableCell align="center">type</StyledTableCell>
                      <StyledTableCell align="center">optional</StyledTableCell>
                      <StyledTableCell align="center">
                        description
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {x.parameter.map((param) => (
                      <TableRow>
                        <StyledTableCell align="center">
                          {param}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {x.type[x.parameter.indexOf(param)]}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {x.optional[x.parameter.indexOf(param)] ? (
                            <CheckIcon />
                          ) : (
                            <ClearIcon />
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {x.desc[x.parameter.indexOf(param)]}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <Typography align="left">
                Returns: {x.returns ? x.returns : "void?"}
              </Typography>
              <br />
			  
              <Typography align="left">Examples:</Typography>
              {x.example.map((codeExample) => (
                <pre align="left" style={{background: "#E0E0E0", minWidth: "100%" }}>
                  {codeExample}
                </pre>
              ))}
            </CardContent>
          </Card>
          <br />
        </div>
      ))}
    </main>
  );
}
