export enum Color {
  WHITE = 'w',
  BLACK = 'b',
}

export enum PieceType {
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k',
}

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Position {
  row: number;
  col: number;
}

export type BoardState = (Piece | null)[][];

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  captured?: PieceType;
  isCheck: boolean;
  isCheckmate: boolean;
  notation: string;
}

export interface GameState {
  board: BoardState;
  turn: Color;
  selectedPos: Position | null;
  possibleMoves: Position[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: Color | null;
  capturedWhite: PieceType[];
  capturedBlack: PieceType[];
  history: Move[];
}