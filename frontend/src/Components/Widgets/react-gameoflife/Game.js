import React, {useState, useCallback, useEffect, useRef} from 'react';
import './Game.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import CasinoIcon from '@material-ui/icons/Casino';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const CELL_SIZE = 20;
const WIDTH = 200;
const HEIGHT = 200;

function Cell(props) {
    const { x, y } = props;
    return (
        <div className="Cell"
            key={ `${x},${y}`}
            style={{
            left: `${CELL_SIZE * x + 1}px`,
            top: `${CELL_SIZE * y + 1}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`,
            backgroundColor: props.color || "red"
        }} />
    );
}


function makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < HEIGHT/CELL_SIZE; y++) {
        board[y] = [];
        for (let x = 0; x < WIDTH/CELL_SIZE; x++) {
            board[y][x] = false;
        }
    }

    return board;
}

function boardToCells(board){
     let cells = []

    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board[0].length; x++) {
            if (board[y][x]) {
                cells.push({ color: "red", x: y, y: x })
            }

        }
    }

    return cells
}

function runIteration(cells) {
    let board = makeEmptyBoard();
    let newBoard = makeEmptyBoard();

    for(let cell of cells){
      board[cell.x][cell.y] = true
    }

    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {
            let neighbors = calculateNeighbors(board, x, y);
            if (board[y][x]) {
                if (neighbors === 2 || neighbors === 3) {
                    newBoard[y][x] = true;
                } else {
                    newBoard[y][x] = false;
                }
            } else {
                if (!board[y][x] && neighbors === 3) {
                    newBoard[y][x] = true;
                }
            }
        }
    }

    return boardToCells(newBoard)
}

function calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        let y1 = y + dir[0];
        let x1 = x + dir[1];

        if (x1 >= 0 && x1 < board[0].length && y1 >= 0 && y1 < board.length && board[y1][x1]) {
            neighbors++;
        }
    }

    return neighbors;
}

function Game(props) {

    const [isRunning, setIsRunning] = useState(props.isRunning || false)
    const [cells, setCells] = useState(props.cells || [])

    const handleClick = (event) => {
        const elemOffset = event.target.getBoundingClientRect()
        const offsetX = event.clientX - elemOffset.left;
        const offsetY = event.clientY - elemOffset.top;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        setCells([...cells, { x, y, color: props.color }])
    }

    const handleRandom = () => {
        let board = makeEmptyBoard()

        for (let y = 0; y < WIDTH/CELL_SIZE; y++) {
            for (let x = 0; x < HEIGHT/CELL_SIZE; x++) {
                board[y][x] = (Math.random() >= 0.5);
            }
        }

        let cells = boardToCells(board)
        setCells(cells) 
        props.onIteration && props.onIteration(cells)
    }

    const handleNext = useCallback(() => { 
        setCells((cells) => 
        {
            let newCells = runIteration(cells);
            props.onIteration && props.onIteration(cells)
            return newCells
		})
    }, [isRunning, cells])

    const stopGame = useCallback(() => {
        setIsRunning(false)

        props.onRunningChanged && props.onRunningChanged(false)
    }, [isRunning, cells])

    const runGame = useCallback(() => {
        setIsRunning(true)
        props.onRunningChanged && props.onRunningChanged(true)
    }, [isRunning, cells])


    let nextButtonRef = useRef(null)
    useEffect(() => {
        const interval = setInterval(() => {
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });

            if (nextButtonRef.current && isRunning)
                nextButtonRef.current.dispatchEvent(clickEvent)

        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardContent>
                <Grid container
                    spacing={1}
                    direction="row"
                    alignItems="start"
                >
                    <Grid item>
                        <Typography
                            color="textSecondary" gutterBottom
                        >{props.boardLabel || "Edit my squares..."}</Typography>
                        <div className="Board"
                            style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`, marginLeft: 0, }}
                            onClick={handleClick} >

                            {cells.map(cell => (
                                <Cell x={cell.x}
                                    y={cell.y}
                                    key={`${cell.x},${cell.y}`}
                                    color={cell.color}
                                />
                            ))}

                        </div>
                    </Grid>
                    <Grid item>
                        <Typography
                            color="textSecondary" gutterBottom
                        >{props.buttonsLabel || "and/or click my buttons..."}</Typography>

                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            aria-label="vertical outlined primary button group"
                        >
                            {isRunning ?
                                <Button
                                    variant="outlined"
                                    onClick={stopGame}><StopIcon /> Stop</Button> :
                                <Button variant="outlined" onClick={runGame}><PlayArrowIcon /> Run</Button>}
                            <Button ref={ nextButtonRef } variant="outlined" onClick={handleNext}>
                                Next</Button>
                            <Button variant="outlined" onClick={handleRandom}>
                                <CasinoIcon /> Random</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}



export default Game;
