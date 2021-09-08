import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const LevelTableOfContents = (props) => {

    function clearCurrentPuzzleData() {
        for (let key of Object.keys(localStorage)) {
            if (key.match(/^lvl\d+:currentPart/)) {
                localStorage.setItem(key, 0)
            }
            if (key.match(/sock-puppet-lesson-opened/)) {
                localStorage.setItem(key, false)
            }
        }
    }


    const PuzzleButton = (props) => {

        function updatePuzzleNumInStorage(levelNum, puzzleNum){
           localStorage.setItem("lvl"+levelNum+":currentPart", puzzleNum) 
        }

        return (
            <Button 
                onClick={() => {
                    clearCurrentPuzzleData()
                    console.log("Level Num: ", props.levelNum)
                    console.log("Puzzle Num: ", props.puzzleNum)
                    updatePuzzleNumInStorage(props.levelNum, props.puzzleNum)
                    props.setCurrentLevelNum(props.levelNum)
                }}>{props.puzzleName}
            </Button>
        )
    }


    //TODO: Change to 4 headers, each with a button group, one for each Level 1, 2, 3, and 4
    // each button group would have appropriate # of puzzles
    // onClick for puzzle would set current level num & the appropriate puzzle #
    // e.g. localStorage.setItem("lvl2:currentPart", 3)
    // HOW TO DYNAMICALLY GET THE # OF PARTS FOR EACH LEVEL? THIS DATA IS STORED IN
    // EACH PUZZLE'S INDEX.JS FILE RIGHT NOW... MOVE TO A MORE GLOBAL LOCATION?
    
    let toc = {
        levels: [
            {
                name: 1,
                puzzles: [
                   "Set Username",
                   "Light/Dark Mode",
                   "School of Magic",
                   "Meet Your Teacher",
                   "Hello World" 
                ]
            },
            {
                name: 2,
                puzzles: [
                   "Terminal Basics",
                   "Simulation Basics",
                   "Network Basics",
                   "Piano Magic",
                   "Diabolical" 
                ]
            },
            {
                name: 3,
                puzzles: [
                   "Build Sphere",
                ]
            },
        ]
    } 


    return (<>
        <Grid container direction="row">
            {toc.levels.map((level, i) => {
                return (<>
                    <Grid item xs={3}>
                        <h2>Level {level.name}</h2>
                        <ButtonGroup
                            orientation="vertical"
                            color="secondary"
                            aria-label="vertical button group"
                            variant="contained"
                        >{
                            level.puzzles.map((puzzle,j)=>{
                                return <PuzzleButton levelNum={level.name} puzzleName={puzzle} puzzleNum={j} setCurrentLevelNum={props.setCurrentLevelNum}></PuzzleButton>
                            })
                         }
                        </ButtonGroup>
                    </Grid>
                </>)
            })}
        </Grid>
    </>)
}

export default LevelTableOfContents;