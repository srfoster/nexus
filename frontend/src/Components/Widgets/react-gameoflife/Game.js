import React, {useState, useCallback, useEffect} from 'react';
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

/*
const CELL_SIZE = 20;
const WIDTH = 200;
const HEIGHT = 200;


function Cell(props) {
    const { x, y } = props;
    return (
        <div className="Cell" style={{
            left: `${CELL_SIZE * x + 1}px`,
            top: `${CELL_SIZE * y + 1}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`,
            backgroundColor: props.color || "red"
        }} />
    );
}


class Game extends React.Component {

    constructor() {
        super();
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;

        this.board = this.makeEmptyBoard();
    }

    state = {
        cells: [],
        isRunning: false,
        interval: 30,
    }

    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }

        return board;
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    handleClick = (event) => {
        const elemOffset = event.target.getBoundingClientRect() //this.getElementOffset();
        const offsetX = event.clientX - elemOffset.left;
        const offsetY = event.clientY - elemOffset.top;
        console.log(offsetX,offsetY)
        
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }

    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    }

    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    runIteration() {
        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
    }

    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
    }

    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = (Math.random() >= 0.5);
            }
        }

        this.setState({ cells: this.makeCells() });
    }

    render() {
        const { cells, interval, isRunning } = this.state;
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
                            >{ this.props.boardLabel || "Edit my squares..." }</Typography>
                            <div className="Board"
                                style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`, marginLeft: 0, }}
                                onClick={this.handleClick}
                                ref={(n) => { this.boardRef = n; }}>

                                {cells.map(cell => (
                                    <Cell x={cell.x}
                                        y={cell.y}
                                        key={`${cell.x},${cell.y}`}
                                        color={ this.props.color}
                                    />
                                ))}
                            </div>
                        </Grid>
                        <Grid item>
                            <Typography
                                color="textSecondary" gutterBottom
                            >{ this.props.buttonsLabel || "and/or click my buttons..." }</Typography>
                            {isRunning ?
                                <Button
                                    variant="outlined"
                                    onClick={this.stopGame}><StopIcon /> Stop</Button> :
                                <Button variant="outlined" onClick={this.runGame}><PlayArrowIcon /> Run</Button>}
                                <br/>
                            <Button variant="outlined" onClick={this.handleRandom}>
                                <CasinoIcon/> Random</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}
*/

const CELL_SIZE = 20;
const WIDTH = 200;
const HEIGHT = 200;

function Cell(props) {
    const { x, y } = props;
    return (
        <div className="Cell" style={{
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

    const [isRunning, setIsRunning] = useState(false)
    const [cells, setCells] = useState([{ x: 0, y: 0, color: props.color }])

    const handleClick = (event) => {
        const elemOffset = event.target.getBoundingClientRect()
        const offsetX = event.clientX - elemOffset.left;
        const offsetY = event.clientY - elemOffset.top;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        setCells([...cells, { x, y, color: props.color }])
    }
    const handleRandom = () => {
        //Could be more efficient (just generate the cells)?

        let board = makeEmptyBoard()

        for (let y = 0; y < WIDTH/CELL_SIZE; y++) {
            for (let x = 0; x < HEIGHT/CELL_SIZE; x++) {
                board[y][x] = (Math.random() >= 0.5);
            }
        }

        setCells(boardToCells(board)) 
    }

    let runInterval;
    const stopGame = useCallback(() => {
        if(runInterval)
            clearInterval(runInterval)

        setIsRunning(false)

    }, [])
    const runGame = useCallback(() => {
        runInterval = setInterval(handleNext, 100)
        setIsRunning(true)
    }, [])
    const handleNext = () => { 
        setCells((cells) => 
		{let newCells = runIteration(cells);
                 props.onIteration && props.onIteration(cells)

	         return newCells
		})
    }


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
                        {isRunning ?
                            <Button
                                variant="outlined"
                                onClick={stopGame}><StopIcon /> Stop</Button> :
                            <Button variant="outlined" onClick={runGame}><PlayArrowIcon /> Run</Button>}
                        <br />
                        <Button variant="outlined" onClick={handleRandom}>
                            <CasinoIcon /> Random</Button>
                        <Button variant="outlined" onClick={handleNext}>
                             Next</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}



export default Game;
