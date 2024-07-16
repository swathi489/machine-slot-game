import React, { useState } from 'react';
import { FaRedo, FaSyncAlt } from 'react-icons/fa';

const MAX_BET = 100;
const MIN_BET = 1;

const ROWS = 3;
const COLS = 3;

const symbolCount = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
};

const symbolValue = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2
};

const getSlotMachineSpin = (rows, cols, symbols) => {
  let allSymbols = [];
  for (let [symbol, count] of Object.entries(symbols)) {
    allSymbols = [...allSymbols, ...Array(count).fill(symbol)];
  }

  const columns = [];
  for (let i = 0; i < cols; i++) {
    const column = [];
    let currentSymbols = [...allSymbols];
    for (let j = 0; j < rows; j++) {
      const randomIndex = Math.floor(Math.random() * currentSymbols.length);
      const selectedSymbol = currentSymbols[randomIndex];
      currentSymbols.splice(randomIndex, 1);
      column.push(selectedSymbol);
    }
    columns.push(column);
  }

  return columns;
};

function checkWinnings(columns, lines, bet, values) {
    let winnings = 0;
    let winningLines = [];
    for (let line = 0; line < lines; line++) {
        const symbols = columns.map(column => column[line]);
        const uniqueSymbols = [...new Set(symbols)];
        
        // Check for win if there are at least two matching symbols in the line
        if (uniqueSymbols.length === 2) {
            const winningSymbol = uniqueSymbols[0] === symbols[0] ? uniqueSymbols[0] : uniqueSymbols[1];
            const symbolCount = symbols.filter(symbol => symbol === winningSymbol).length;
            if (symbolCount === 2 || symbolCount === 3) {
                winnings += values[winningSymbol] * bet;
                winningLines.push(line + 1);
            }
        }
        
        // Add more win conditions here if needed
        
    }
    return { winnings, winningLines };
}


const SlotMachineGame = () => {
  const [balance, setBalance] = useState(0);
  const [lines, setLines] = useState(1);
  const [bet, setBet] = useState(1);
  const [columns, setColumns] = useState([]);
  const [winnings, setWinnings] = useState(0);
  const [winningLines, setWinningLines] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleDeposit = () => {
    const amount = parseInt(prompt("Enter deposit amount: "), 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number.");
    } else {
      setBalance(balance + amount);
    }
  };

  const handleSpin = () => {
    const totalBet = bet * lines;
    if (totalBet > balance) {
      alert(`You do not have enough balance to bet ${totalBet}. Current balance is ${balance}`);
      return;
    }

    const newColumns = getSlotMachineSpin(ROWS, COLS, symbolCount);
    setColumns(newColumns);

    const { winnings, winningLines } = checkWinnings(newColumns, lines, bet, symbolValue);
    setWinnings(winnings);
    setWinningLines(winningLines);

    setBalance(balance - totalBet + winnings);
    
    if (winnings > 0) {
      setDialogMessage(`Congratulations! You won $${winnings}!`);
    } else {
      setDialogMessage(`Sorry! You lost $${totalBet}.`);
    }
    setShowDialog(true);
  };

  const handleReload = () => {
    setBalance(0);
    setLines(1);
    setBet(1);
    setColumns([]);
    setWinnings(0);
    setWinningLines([]);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <header className="bg-teal-500 p-5 w-full text-center mb-5 mt-2 shadow-lg">
        <h1 className="text-3xl mt-2 my-2 font-times">Slot Machine Game</h1>
      </header>
      <div className="flex w-4/5 justify-between">
        <div className="flex flex-col items-start w-1/3">
          <div className="mb-5 mt-5">
            <span className="text-xl mr-2 font-times ">Balance: ${balance}</span>
            <button className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeposit}>Deposit</button>
          </div>
          <div className="mb-5 ">
            <label className="block mb-2 font-times text-xl ">
              Number of lines:
              <input
                type="number"
                min="1"
                max={MAX_BET}
                value={lines}
                onChange={(e) => setLines(parseInt(e.target.value, 10))}
                className="ml-2 p-2 rounded text-black"
              />
            </label>
            <label className="block mb-2 mr-20 font-times text-xl">
              Bet per line:   
              <input
                type="number"
                min={MIN_BET}
                max={MAX_BET}
                value={bet}
                onChange={(e) => setBet(parseInt(e.target.value, 10))}
                className="ml-2 p-2 rounded text-black mx-9"
              />
            </label>
          </div>
          <div className=''>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={handleSpin}>
  Spin <FaSyncAlt className="inline-block ml-2" />
</button>
<button className="bg-red-500 hover:bg-red-700 mx-2 text-white font-bold py-2 px-4 rounded" onClick={handleReload}>
  Reload <FaRedo className="inline-block ml-2" />
</button>
</div>

        </div>
        <div className="w-2/3">
          <div className="flex justify-center mb-5">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col mx-2">
                {column.map((symbol, rowIndex) => (
                  <div key={rowIndex} className="border-2 border-blue-500 bg-white text-black p-4 m-1 rounded">
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className=''>
<div className="text-xl flex justify-center">
            <span className='border my-5 py-3 px-3 mx-2 bg-cyan-200 border-green-600'>You won: ${winnings}</span>
            {winningLines.length > 0 && (
              <span className='border my-5 py-3 px-3 bg-cyan-200 border-green-600'> Winning lines: {winningLines.join(', ')}</span>
            )}
          </div>
        </div>
      </div>
          </div>
          
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-5 rounded text-center">
            <p className="mb-5">{dialogMessage}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachineGame;
