import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { a_alert, a_app_state, a_rune_game, a_my_pid, a_my_player, a_page, a_pids, a_size, a_skill, a_turn } from './atoms';
import { GAME_PAGE, PLAYER_JOINED, PLAYER_LEFT, START_PAGE } from './const';
import { RA_BOARD_UPDATE, RA_INIT, RA_PERSIST, RA_PLAYER_PAGE, RA_STARTED, RA_SWITCH_PLAYER } from './logic';
import useGameState from './useGameState';
import useLang, { S_NEW_GAME, S_OPP_JOINED, S_OPP_LEFT, S_PLAYER_RESTARTED } from './useLang';
import usePlaySound from './usePlaySound';
import { defer, runeAction } from './utils';

const useRune = () => {
    const [appState, setAppState] = useAtom(a_app_state);
    const [myPlayer, setMyPlayer] = useAtom(a_my_player);
    const [pids, setPlayerIds] = useAtom(a_pids);
    const [myPlayerId] = useAtom(a_my_pid);
    const [rg, setRuneGameState] = useAtom(a_rune_game);
    const [runeChange, setRuneChange] = useState(null);
    const [next, setNext] = useState(false);
    const [backToStart, setBackToStart] = useState(false);
    const [, setSize] = useAtom(a_size);
    const [, setSkill] = useAtom(a_skill);
    const [, setTurn] = useAtom(a_turn);
    const [page, setPage] = useAtom(a_page);
    const [, setAlert] = useAtom(a_alert);
    const { getState, getStateKey, setState } = useGameState();
    const playSound = usePlaySound();
    const { str, lang } = useLang();

    const l = useRef({ queue: [], delay: 0 }).current;
    l.page = page;

    useEffect(() => {
        if (backToStart) {
            setBackToStart(false);
            setPage(START_PAGE);

            if (backToStart === 'init') {
                setSize(0);
                setSkill(0);
                setAppState({ sounds: appState.sounds, states: {} });
            } else {
                const states = appState.states;
                setAppState({ states: { '00': states['00'], '01': states['01'] } });
            }
        }
    }, [appState.sounds, appState.states, backToStart, setAlert, setAppState, setPage, setSize, setSkill]);

    const onOppEvent = useCallback(() => {
        const de = runeChange?.name;
        const msg = de === PLAYER_JOINED ? S_OPP_JOINED : de === PLAYER_LEFT ? S_OPP_LEFT : null;

        if (!msg) {
            return false;
        }

        setAlert({ alert: msg });

        if (page !== START_PAGE) {
            if (myPlayerId) {
                defer(() => runeAction(RA_INIT));
            }

            setBackToStart(true);
        }

        return true;
    }, [runeChange?.name, myPlayerId, page, setAlert]);

    const getBoard = useCallback((gob) => {
        const { size, skill } = gob.board_update;
        const board = gob.board_update.boards[getStateKey(size, skill)];

        return board;
    }, [getStateKey]);

    const onBoardUpdate = useCallback((gob) => {
        const board = getBoard(gob);
        const { size, skill } = gob.board_update;
        const sob = getState(size, skill);
        const { turn, scores } = board;

        setState(size, skill, { ...sob, turn, scores });
        setSize(size);
        setSkill(skill);

        if (board.force_event === S_NEW_GAME || board.force_event === S_PLAYER_RESTARTED) {
            setAlert({ alert: board.force_event });
        }
    }, [getBoard, getState, setAlert, setSize, setSkill, setState]);

    const onSwitchPlayer = useCallback((gob) => {
        if (page === GAME_PAGE) {
            playSound('oops', { rate: 2 });
        }

        setTurn(gob.switchPlayer);
    }, [page, playSound, setTurn]);

    const doSetNext = useCallback(() => {
        if (l.delay) {
            defer(() => setNext(true), l.delay);
        } else {
            setNext(true);
        }
    }, [l.delay]);

    // process next •••••••••••••••••••••••••••••••••••••••••••••••••••••••
    useEffect(() => {
        if (!next) {
            return;
        }

        setNext(false);

        l.delay = 0;

        if (!l.queue.length) {
            return;
        }

        const { da, gob } = l.queue.shift();

        switch (da) {
            case RA_BOARD_UPDATE:
                onBoardUpdate(gob);
                break;
            default: break;
        }

        if (l.queue.length) {
            doSetNext();
        }
    }, [doSetNext, l, next, onBoardUpdate]);

    // process onChange •••••••••••••••••••••••••••••••••••••••••••••••••••••••
    useEffect(() => {
        if (!runeChange) {
            return;
        }

        setRuneChange(null);

        if (onOppEvent()) {
            return;
        }

        const action = runeChange;
        const da = action?.name;
        const gob = _.cloneDeep(rg);

        if (da === RA_STARTED || da === RA_PERSIST) {
            return;
        }

        if (da === RA_BOARD_UPDATE) {
            // console.log({ 'gob size': JSON.stringify(gob).length });

            if (l.page !== GAME_PAGE) {
                onBoardUpdate(gob);
                return;
            }

            const board = getBoard(rg);

            if (!board.force_event) {
                return;
            }
        }

        if (da === RA_SWITCH_PLAYER) {
            onSwitchPlayer(gob);
            return;
        }

        const len = l.queue.push({ da, gob, time: Date.now() });

        if (len === 1) {
            doSetNext();
        }
    }, [rg, doSetNext, runeChange, getBoard, l.page, l.queue, onBoardUpdate, onOppEvent, onSwitchPlayer]);

    const onChange = (props) => {
        const { game, allPlayerIds, yourPlayerId, action, event } = props;
        const rg = _.cloneDeep(game);

        if (!rg.started && yourPlayerId) {
            defer(() => runeAction(RA_STARTED));
        }

        if (allPlayerIds.length === 1) {
            rg.players[1] = { page: START_PAGE };
        }

        setRuneGameState(rg);

        if (yourPlayerId && action?.playerId === yourPlayerId) {
            return;
        }

        const ids = _.sortBy(allPlayerIds);
        setPlayerIds(ids);

        const player = _.findIndex(ids, id => id === yourPlayerId) + 1;
        setMyPlayer(player);

        if (action?.name === RA_PLAYER_PAGE) {
            return;
        }

        const de = event?.name;

        if (action || de === PLAYER_JOINED || de === PLAYER_LEFT) {
            defer(() => setRuneChange(action || event));
        } else if (de === 'stateSync' && !rg.started) {
            setBackToStart('init');
        }
    };

    const playerInfo = player => {
        if (!player) {
            return null;
        }
        const index = myPlayer ? (myPlayer === 1 ? player : 3 - player) : player;
        const pid = index && index <= pids.length ? pids[index - 1] : null;
        // eslint-disable-next-line no-undef
        const pi = Rune.getPlayerInfo(pid);
        return pi;
    };

    return { onChange, playerInfo, getBoard };
};

export default useRune;