import React, { useState, useEffect, useRef } from 'react';
import { 
  BoardState, 
  Color, 
  PieceType, 
  Position, 
  GameState,
  Move
} from './types';
import { 
  INITIAL_BOARD, 
  getValidMoves, 
  isCheck, 
  hasAnyValidMoves, 
  cloneBoard,
  toSquareName
} from './services/chessLogic';
import { PieceIcons } from './constants';
import { RefreshCcw, Trophy, AlertTriangle, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [game, setGame] = useState<GameState>({
    board: INITIAL_BOARD,
    turn: Color.WHITE,
    selectedPos: null,
    possibleMoves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    winner: null,
    capturedWhite: [],
    capturedBlack: [],
    history: []
  });

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll history to bottom when it updates
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [game.history]);

  const resetGame = () => {
    setGame({
      board: INITIAL_BOARD,
      turn: Color.WHITE,
      selectedPos: null,
      possibleMoves: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      winner: null,
      capturedWhite: [],
      capturedBlack: [],
      history: []
    });
  };

  const handleSquareClick = (row: number, col: number) => {
    if (game.winner || game.isCheckmate || game.isStalemate) return;

    const clickedPiece = game.board[row][col];
    const isSameColor = clickedPiece && clickedPiece.color === game.turn;

    // Selection Logic
    if (isSameColor) {
      const moves = getValidMoves(game.board, { row, col });
      setGame(prev => ({
        ...prev,
        selectedPos: { row, col },
        possibleMoves: moves
      }));
      return;
    }

    // Move Logic
    if (game.selectedPos) {
      const isMoveValid = game.possibleMoves.some(
        m => m.row === row && m.col === col
      );

      if (isMoveValid) {
        executeMove(game.selectedPos, { row, col });
      } else {
        // Clicked empty square or enemy that isn't a valid move -> deselect
        setGame(prev => ({ ...prev, selectedPos: null, possibleMoves: [] }));
      }
    }
  };

  const executeMove = (from: Position, to: Position) => {
    const newBoard = cloneBoard(game.board);
    const movingPiece = newBoard[from.row][from.col];
    const targetPiece = newBoard[to.row][to.col];

    if (!movingPiece) return;

    // Capture Logic
    let newCapturedWhite = [...game.capturedWhite];
    let newCapturedBlack = [...game.capturedBlack];
    if (targetPiece) {
      if (targetPiece.color === Color.WHITE) newCapturedWhite.push(targetPiece.type);
      else newCapturedBlack.push(targetPiece.type);
    }

    // Move
    newBoard[to.row][to.col] = movingPiece;
    newBoard[from.row][from.col] = null;

    // Pawn Promotion (Auto-Queen for simplicity)
    let promoted = false;
    if (movingPiece.type === PieceType.PAWN) {
      if ((movingPiece.color === Color.WHITE && to.row === 0) || 
          (movingPiece.color === Color.BLACK && to.row === 7)) {
        newBoard[to.row][to.col] = { ...movingPiece, type: PieceType.QUEEN };
        promoted = true;
      }
    }

    // Next Turn Calculations
    const nextTurn = game.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
    const nextTurnInCheck = isCheck(newBoard, nextTurn);
    const hasMoves = hasAnyValidMoves(newBoard, nextTurn);

    let winner = null;
    let isMate = false;
    let isStale = false;

    if (!hasMoves) {
      if (nextTurnInCheck) {
        isMate = true;
        winner = game.turn; // Current player wins
      } else {
        isStale = true;
      }
    }

    // Record History
    const fromNotation = toSquareName(from);
    const toNotation = toSquareName(to);
    const moveNotation = `${fromNotation} → ${toNotation}`;

    const newMove: Move = {
      piece: movingPiece,
      from,
      to,
      captured: targetPiece?.type,
      isCheck: nextTurnInCheck,
      isCheckmate: isMate,
      notation: moveNotation
    };

    setGame(prev => ({
      ...prev,
      board: newBoard,
      turn: nextTurn,
      selectedPos: null,
      possibleMoves: [],
      isCheck: nextTurnInCheck,
      isCheckmate: isMate,
      isStalemate: isStale,
      winner: winner,
      capturedWhite: newCapturedWhite,
      capturedBlack: newCapturedBlack,
      history: [...prev.history, newMove]
    }));
  };

  // Helper to render pieces
  const renderPiece = (piece: { type: PieceType, color: Color } | null, row: number, col: number) => {
    if (!piece) return null;
    const Icon = PieceIcons[`${piece.color}${piece.type}`];
    return <Icon className="w-full h-full p-1 transition-transform hover:scale-105" color={piece.color} />;
  };

  const renderHistoryItem = (move: Move, index: number) => {
    const PieceIcon = PieceIcons[`${move.piece.color}${move.piece.type}`];
    return (
      <div key={index} className="flex items-center gap-2 text-sm md:text-base text-gray-300">
        <span className="w-6 text-gray-500 font-mono text-xs">{Math.floor(index / 2) + 1}.</span>
        <div className="w-5 h-5 md:w-6 md:h-6">
           <PieceIcon color={move.piece.color} />
        </div>
        <span className="font-mono">{move.notation}</span>
        {move.isCheckmate && <span className="text-red-500 font-bold">#</span>}
        {move.isCheck && !move.isCheckmate && <span className="text-yellow-500 font-bold">+</span>}
      </div>
    );
  };

  // Determine square styling
  const getSquareClass = (row: number, col: number) => {
    const isBlack = (row + col) % 2 === 1;
    const isSelected = game.selectedPos?.row === row && game.selectedPos?.col === col;
    
    // Highlight previous move
    const lastMove = game.history[game.history.length - 1];
    const isLastMoveSrc = lastMove && lastMove.from.row === row && lastMove.from.col === col;
    const isLastMoveDst = lastMove && lastMove.to.row === row && lastMove.to.col === col;

    // Check highlighting (Red background if King is in check)
    const piece = game.board[row][col];
    const isKingInCheck = game.isCheck && piece?.type === PieceType.KING && piece?.color === game.turn;
    
    let baseClass = isBlack ? "bg-slate-600" : "bg-slate-300";

    if (isSelected) baseClass = "bg-yellow-400 ring-inset ring-4 ring-yellow-600";
    else if (isKingInCheck) baseClass = "bg-red-500 animate-pulse";
    else if (isLastMoveSrc || isLastMoveDst) baseClass = isBlack ? "bg-slate-500 ring-inset ring-4 ring-slate-400" : "bg-slate-200 ring-inset ring-4 ring-slate-300";
    
    return `${baseClass} relative flex items-center justify-center cursor-pointer select-none h-full w-full`;
  };

  // Group history into pairs for display
  const historyPairs = [];
  for (let i = 0; i < game.history.length; i += 2) {
    historyPairs.push({
      white: game.history[i],
      black: game.history[i + 1]
    });
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center p-4 md:p-8">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-6 flex justify-between items-center bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-700">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                React Master Chess
            </h1>
            <p className="text-neutral-400 text-sm">PvP Local • React + Tailwind</p>
        </div>
        <button 
            onClick={resetGame}
            className="bg-neutral-700 hover:bg-neutral-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
        >
            <RefreshCcw size={16} /> Reiniciar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Left Column: Board & Status */}
        <div className="flex flex-col gap-4 w-full lg:max-w-[600px]">
             
            {/* Game Status Bar */}
            <div className="w-full flex justify-between items-center text-white bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                {/* Black Player Info */}
                <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all border ${game.turn === Color.BLACK ? 'bg-neutral-800 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-transparent opacity-60'}`}>
                    <div className="w-8 h-8 rounded bg-black border border-neutral-600 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-slate-800"></div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="block font-bold text-sm">Pretas</span>
                        {game.turn === Color.BLACK && <span className="text-xs text-yellow-500 animate-pulse">Sua vez</span>}
                    </div>
                </div>

                {/* Game State Message */}
                <div className="flex flex-col items-center">
                    {game.winner && (
                        <div className="flex flex-col items-center text-yellow-400 animate-bounce">
                            <Trophy size={24} />
                            <span className="font-bold">Vitória {game.winner === Color.WHITE ? 'Brancas' : 'Pretas'}!</span>
                        </div>
                    )}
                    {game.isStalemate && <span className="text-slate-400 font-bold">Empate (Afogamento)</span>}
                    {game.isCheck && !game.isCheckmate && (
                        <div className="flex items-center gap-1 text-red-500 bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
                            <AlertTriangle size={16} />
                            <span className="font-bold text-sm">XEQUE!</span>
                        </div>
                    )}
                </div>

                {/* White Player Info */}
                <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all border ${game.turn === Color.WHITE ? 'bg-neutral-800 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-transparent opacity-60'}`}>
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <span className="block font-bold text-sm">Brancas</span>
                        {game.turn === Color.WHITE && <span className="text-xs text-yellow-500 animate-pulse">Sua vez</span>}
                    </div>
                </div>
            </div>

            {/* Chess Board */}
            <div className="w-full aspect-square bg-neutral-800 p-1 md:p-2 rounded-lg shadow-2xl border border-neutral-700">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full border-4 border-slate-700 rounded overflow-hidden">
                {game.board.map((row, rIndex) => (
                    row.map((piece, cIndex) => {
                    const isPossibleMove = game.possibleMoves.some(m => m.row === rIndex && m.col === cIndex);
                    const isCapture = isPossibleMove && piece !== null;
                    
                    return (
                        <div
                        key={`${rIndex}-${cIndex}`}
                        className={getSquareClass(rIndex, cIndex)}
                        onClick={() => handleSquareClick(rIndex, cIndex)}
                        >
                            {/* Rank/File Indicators */}
                            {cIndex === 0 && (
                                <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${((rIndex + cIndex) % 2 === 1) ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {8 - rIndex}
                                </span>
                            )}
                            {rIndex === 7 && (
                                <span className={`absolute bottom-0 right-1 text-[10px] font-bold ${((rIndex + cIndex) % 2 === 1) ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {String.fromCharCode(97 + cIndex)}
                                </span>
                            )}

                            {/* Move Indicators */}
                            {isPossibleMove && !isCapture && (
                                <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-green-500/50 rounded-full pointer-events-none z-10"></div>
                            )}
                            {isPossibleMove && isCapture && (
                                <div className="absolute w-full h-full border-[6px] border-red-500/40 rounded-full pointer-events-none z-10"></div>
                            )}

                            {/* Piece */}
                            <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
                                {renderPiece(piece, rIndex, cIndex)}
                            </div>
                        </div>
                    );
                    })
                ))}
                </div>
            </div>

        </div>

        {/* Right Column: Info Panel */}
        <div className="flex flex-col gap-4 w-full lg:w-[350px] h-full">
            
            {/* Captured Pieces */}
            <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 shadow-lg">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Capturadas</h3>
                <div className="space-y-3">
                     <div className="flex flex-wrap gap-1 min-h-[32px] bg-neutral-900/50 p-2 rounded-lg border border-neutral-700/50">
                        {game.capturedWhite.length === 0 && <span className="text-neutral-600 text-xs italic p-1">Nenhuma peça branca capturada</span>}
                        {game.capturedWhite.map((p, i) => {
                            const Icon = PieceIcons[`${Color.WHITE}${p}`];
                            return <Icon key={i} color={Color.WHITE} className="w-6 h-6 opacity-80" />;
                        })}
                    </div>
                    <div className="flex flex-wrap gap-1 min-h-[32px] bg-neutral-900/50 p-2 rounded-lg border border-neutral-700/50">
                        {game.capturedBlack.length === 0 && <span className="text-neutral-600 text-xs italic p-1">Nenhuma peça preta capturada</span>}
                        {game.capturedBlack.map((p, i) => {
                            const Icon = PieceIcons[`${Color.BLACK}${p}`];
                            return <Icon key={i} color={Color.BLACK} className="w-6 h-6 opacity-80" />;
                        })}
                    </div>
                </div>
            </div>

             {/* Move History */}
             <div className="bg-neutral-800 rounded-xl border border-neutral-700 shadow-lg flex-1 flex flex-col overflow-hidden h-[400px] lg:h-[500px]">
                <div className="p-3 border-b border-neutral-700 bg-neutral-800 flex items-center gap-2">
                    <ScrollText size={16} className="text-neutral-400" />
                    <h3 className="text-gray-200 font-bold text-sm uppercase tracking-wider">Histórico de Movimentos</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {historyPairs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
                             <div className="w-12 h-12 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                             </div>
                             <span className="text-sm">O jogo ainda não começou</span>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="grid grid-cols-[30px_1fr_1fr] gap-2 px-2 py-1 text-xs text-neutral-500 font-bold uppercase border-b border-neutral-700 mb-2">
                                <div>#</div>
                                <div>Brancas</div>
                                <div>Pretas</div>
                            </div>
                            {historyPairs.map((pair, i) => (
                                <div key={i} className={`grid grid-cols-[30px_1fr_1fr] gap-2 px-2 py-1.5 rounded text-sm ${i % 2 === 0 ? 'bg-neutral-800' : 'bg-neutral-700/30'}`}>
                                    <div className="text-neutral-500 font-mono text-xs pt-1">{i + 1}.</div>
                                    
                                    {/* White Move */}
                                    <div className="flex items-center gap-2 text-gray-200">
                                        <div className="w-5 h-5 flex-shrink-0">
                                            {React.createElement(PieceIcons[`${pair.white.piece.color}${pair.white.piece.type}`], { color: pair.white.piece.color })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-xs opacity-70">{pair.white.notation}</span>
                                            {pair.white.isCheckmate && <span className="text-red-500 font-bold">#</span>}
                                            {pair.white.isCheck && !pair.white.isCheckmate && <span className="text-yellow-500 font-bold">+</span>}
                                        </div>
                                    </div>

                                    {/* Black Move */}
                                    {pair.black ? (
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <div className="w-5 h-5 flex-shrink-0">
                                                 {React.createElement(PieceIcons[`${pair.black.piece.color}${pair.black.piece.type}`], { color: pair.black.piece.color })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono text-xs opacity-70">{pair.black.notation}</span>
                                                {pair.black.isCheckmate && <span className="text-red-500 font-bold">#</span>}
                                                {pair.black.isCheck && !pair.black.isCheckmate && <span className="text-yellow-500 font-bold">+</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-neutral-600 text-xs italic self-center">...</div>
                                    )}
                                </div>
                            ))}
                            <div ref={historyEndRef} />
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;