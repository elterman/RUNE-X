import { useAtom } from 'jotai';
import { useState } from 'react';
import useSound from 'use-sound';
import sprite from './Sounds/sounds.mp3';

const SPRITE = {
    click: [0, 160],
    cluck: [230, 180],
    coin1: [430, 440],
    coin2: [930, 440],
    coins: [1400, 1054],
    dice: [3020, 910],
    draw: [3980, 1750],
    drop: [5750, 600],
    link1: [6400, 420],
    link2: [6900, 420],
    lost: [7370, 680],
    oops: [8130, 220],
    player1wins: [8430, 1540],
    player2wins: [10030, 1700],
    score1: [11780, 260],
    score2: [12080, 310],
    tap: [12430, 210],
    won: [12680, 2010],
};

const usePlaySound = () => {
    const [playbackRate, setPlaybackRate] = useState(1);
    const [play] = useSound(sprite, { sprite: SPRITE, playbackRate });

    const playSound = (id, options = {}) => {
        const { rate = 1 } = options;

        setPlaybackRate(rate);
        play({ id });
    };

    return playSound;
};

export default usePlaySound;
