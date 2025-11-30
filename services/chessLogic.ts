import { BoardState, Color, Piece, PieceType, Position } from '../types';

export const INITIAL_BOARD: BoardState = [
  [
    { type: PieceType.ROOK, color: Color.BLACK },
    { type: PieceType.KNIGHT, color: Color.BLACK },
    { type: PieceType.BISHOP, color: Color.BLACK },
    { type: PieceType.QUEEN, color: Color.BLACK },
    { type: PieceType.KING, color: Color.BLACK },
    { type: PieceType.BISHOP, color: Color.BLACK },
    { type: PieceType.KNIGHT, color: Color.BLACK },
    { type: PieceType.ROOK, color: Color.BLACK },
  ],
  Array(8).fill({ type: PieceType.PAWN, color: Color.BLACK }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: PieceType.PAWN, color: Color.WHITE }),
  [
    { type: PieceType.ROOK, color: Color.WHITE },
    { type: PieceType.KNIGHT, color: Color.WHITE },
    { type: PieceType.BISHOP, color: Color.WHITE },
    { type: PieceType.QUEEN, color: Color.WHITE },
    { type: PieceType.KING, color: Color.WHITE },
    { type: PieceType.BISHOP, color: Color.WHITE },
    { type: PieceType.KNIGHT, color: Color.WHITE },
    { type: PieceType.ROOK, color: Color.WHITE },
  ],
];

export const cloneBoard = (board: BoardState): BoardState => {
  return board.map(row => row.map(piece => (piece ? { ...piece } : null)));
};

export const isValidPos = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const toSquareName = (pos: Position): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rank = 8 - pos.row;
  return `${files[pos.col]}${rank}`;
};

const isOpponent = (p1: Piece, p2: Piece): boolean => {
  return p1.color !== p2.color;
};

// Generates pseudo-legal moves (ignoring check)
const getPseudoLegalMoves = (board: BoardState, pos: Position): Position[] => {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { type, color } = piece;
  const direction = color === Color.WHITE ? -1 : 1;

  const addIfValid = (r: number, c: number) => {
    if (isValidPos({ row: r, col: c })) {
      const target = board[r][c];
      if (!target) {
        moves.push({ row: r, col: c });
        return true; // Continue sliding
      } else if (isOpponent(piece, target)) {
        moves.push({ row: r, col: c });
        return false; // Stop sliding (capture)
      } else {
        return false; // Blocked by own piece
      }
    }
    return false; // Out of bounds
  };

  if (type === PieceType.PAWN) {
    // Move forward 1
    if (isValidPos({ row: pos.row + direction, col: pos.col }) && !board[pos.row + direction][pos.col]) {
      moves.push({ row: pos.row + direction, col: pos.col });
      // Move forward 2 (first move)
      const startRow = color === Color.WHITE ? 6 : 1;
      if (pos.row === startRow && !board[pos.row + direction * 2][pos.col]) {
        moves.push({ row: pos.row + direction * 2, col: pos.col });
      }
    }
    // Captures
    const captureOffsets = [-1, 1];
    captureOffsets.forEach(offset => {
      const r = pos.row + direction;
      const c = pos.col + offset;
      if (isValidPos({ row: r, col: c })) {
        const target = board[r][c];
        if (target && isOpponent(piece, target)) {
          moves.push({ row: r, col: c });
        }
      }
    });
  } else if (type === PieceType.KNIGHT) {
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    offsets.forEach(([dr, dc]) => addIfValid(pos.row + dr, pos.col + dc));
  } else if (type === PieceType.KING) {
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    offsets.forEach(([dr, dc]) => addIfValid(pos.row + dr, pos.col + dc));
  } else {
    // Sliding pieces (Rook, Bishop, Queen)
    const directions = [];
    if (type === PieceType.ROOK || type === PieceType.QUEEN) {
      directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    }
    if (type === PieceType.BISHOP || type === PieceType.QUEEN) {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    directions.forEach(([dr, dc]) => {
      let r = pos.row + dr;
      let c = pos.col + dc;
      while (addIfValid(r, c)) {
        r += dr;
        c += dc;
      }
    });
  }

  return moves;
};

// Check if a color is in check
export const isCheck = (board: BoardState, color: Color): boolean => {
  // Find King
  let kingPos: Position | null = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === PieceType.KING && p.color === color) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return true; // Should not happen, but assume check if king is missing

  // Check if any opponent piece can attack kingPos
  const opponentColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === opponentColor) {
        // Optimization: Don't check for full legality (self-check), just attack capability
        const moves = getPseudoLegalMoves(board, { row: r, col: c });
        if (moves.some(m => m.row === kingPos!.row && m.col === kingPos!.col)) {
          return true;
        }
      }
    }
  }

  return false;
};

// Get strictly legal moves (must not leave king in check)
export const getValidMoves = (board: BoardState, pos: Position): Position[] => {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const pseudoMoves = getPseudoLegalMoves(board, pos);
  
  return pseudoMoves.filter(move => {
    // Simulate move
    const newBoard = cloneBoard(board);
    newBoard[move.row][move.col] = newBoard[pos.row][pos.col];
    newBoard[pos.row][pos.col] = null;
    
    // Check if the move leaves own king in check
    return !isCheck(newBoard, piece.color);
  });
};

export const hasAnyValidMoves = (board: BoardState, color: Color): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        if (getValidMoves(board, { row: r, col: c }).length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};