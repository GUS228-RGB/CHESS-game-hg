import React from 'react';
import { Color, PieceType } from './types';

interface PieceIconProps {
  color: Color;
  className?: string;
}

// SVGs adapted for clean rendering
export const PieceIcons: Record<string, React.FC<PieceIconProps>> = {
  [`${Color.WHITE}${PieceType.KING}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <path d="M22.5 11.63V6M20 8h5" strokeLinecap="round" />
      <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-7.5 0 1.5 2.5 4.5 10 4.5 10z" fill="#fff" />
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 5.5-3.5 0-7.5-6-8.5-6-1 0-5 6-8.5 6-3 0-4-6.5-8-5.5-3 6 6 10.5 6 10.5v7z" fill="#fff" />
    </svg>
  ),
  [`${Color.WHITE}${PieceType.QUEEN}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#fff" stroke="none" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" fill="#fff" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 4.5 6 5 2.5.5 10 .5 10 .5s7.5 0 10-.5c3-.5 5-2.5 6-5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#fff" />
    </svg>
  ),
  [`${Color.WHITE}${PieceType.ROOK}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="round" />
      <path d="M12 14V9h4v2h5V9h5v2h5V9h4v5s0 7.5-6.5 11c0 3 1.5 6 1.5 6H17s1.5-3 1.5-6c-6-3-6-11-6-11z" fill="#fff" />
    </svg>
  ),
  [`${Color.WHITE}${PieceType.BISHOP}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <g fill="#fff" strokeLinecap="butt">
        <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V30H9v6z" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      </g>
      <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinecap="round" />
    </svg>
  ),
  [`${Color.WHITE}${PieceType.KNIGHT}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" />
      <path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-2.32 4.68-1.97 5 0z" fill="#000" stroke="none" />
    </svg>
  ),
  [`${Color.WHITE}${PieceType.PAWN}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="white" stroke="black" strokeWidth="1.5">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.KING}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
      <path d="M22.5 11.63V6M20 8h5" strokeLinecap="round" stroke="#fff" />
      <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-7.5 0 1.5 2.5 4.5 10 4.5 10z" fill="#000" />
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 5.5-3.5 0-7.5-6-8.5-6-1 0-5 6-8.5 6-3 0-4-6.5-8-5.5-3 6 6 10.5 6 10.5v7z" fill="#000" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.QUEEN}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#000" stroke="none" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" fill="#000" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 4.5 6 5 2.5.5 10 .5 10 .5s7.5 0 10-.5c3-.5 5-2.5 6-5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.ROOK}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
       <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="round" />
       <path d="M12 14V9h4v2h5V9h5v2h5V9h4v5s0 7.5-6.5 11c0 3 1.5 6 1.5 6H17s1.5-3 1.5-6c-6-3-6-11-6-11z" fill="#000" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.BISHOP}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
      <g fill="#000" strokeLinecap="butt">
        <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V30H9v6z" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      </g>
      <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinecap="round" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.KNIGHT}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
       <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000" />
      <path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-2.32 4.68-1.97 5 0z" fill="#fff" stroke="none" />
    </svg>
  ),
  [`${Color.BLACK}${PieceType.PAWN}`]: ({ className }) => (
    <svg viewBox="0 0 45 45" className={className} fill="black" stroke="white" strokeWidth="1.5">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" />
    </svg>
  ),
};