// allows for use of built in React function - useState
import { useState } from "react";

// creates a reusable square prop that can be accessed in file
// { value } is passed from Board() and asigns each returned square with recieved value
function Square({ value, onSquareClick }) {
  return(
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// renders tic-tac-toe board
// handles all state managment
function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    // handles already clicked square
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // creates copy of array 'squares' to change data before replacing so you can access previous data
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    // if xIsNext = false
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  // if winner returns value
  if(winner) {
    // set status to winner text
    status = "Winner: " + winner;
  } else {
    // if no winner continue displaying the next player
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // returns three seperate rows with identical className
  return (
    <>
      <div className="status">{status}</div>
    {/* 'value' is passed down to each Square and assigned array index */}
      <div className="board-row">
        {/* when square is created it calls the Square function and passes an argument for a function call */}
        {/* () => handleClick stops React from having an infinite loop. On click the arrow function runs calling handClick and is then stopped */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

// Lifting state to new top-level component 
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // set xIsNext to True or False based on odd or even state and keeps it out of state
  const xIsNext = currentMove % 2 === 0;
  // reads the last turns array
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // variable for removing all array items after selected move
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // appends all versions of history with nextSquares
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // creates a reusable prop that creates a button with each move
  const moves = history.map((squares, move) => {
    let description;
    
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  // all possible win combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // iterates checking for winning value combination in array lines
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return value of squares[a] if all three values of lines[winningCombo] are the same (X or O)
      return squares[a];
    }
  }
  // if no winner found return null
  return null;
}
