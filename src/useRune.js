import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { a_alert, a_app_state, a_my_pid, a_my_player, a_page, a_pids, a_rune_game, a_size, a_skill, a_solo, a_turn } from './atoms';
import { GAME_PAGE, PLAYER_JOINED, PLAYER_LEFT, SIZES, SKILL_PAGE, START_PAGE } from './const';
import { RA_BOARD_UPDATE, RA_INIT, RA_PERSIST, RA_PLAYER_PAGE, RA_SKILL_SET, RA_STARTED, RA_SWITCH_PLAYER } from './logic';
import useGameState from './useGameState';
import { S_NEW_GAME, S_OPP_JOINED, S_OPP_LEFT, S_PLAYER_RESTARTED } from './useLang';
import usePlaySound from './usePlaySound';
import { defer, runeAction } from './utils';

const useRune = () => {
    const [appState, setAppState] = useAtom(a_app_state);
    const [myPlayer, setMyPlayer] = useAtom(a_my_player);
    const [pids, setPlayerIds] = useAtom(a_pids);
    const [myPlayerId] = useAtom(a_my_pid);
    const [, setRuneGameState] = useAtom(a_rune_game);
    const [next, setNext] = useState(false);
    const [backToStart, setBackToStart] = useState(false);
    const [size, setSize] = useAtom(a_size);
    const [skill, setSkill] = useAtom(a_skill);
    const [, setTurn] = useAtom(a_turn);
    const [page, setPage] = useAtom(a_page);
    const [solo] = useAtom(a_solo);
    const [, setAlert] = useAtom(a_alert);
    const playSound = usePlaySound();
    const { getState, setState } = useGameState();

    const l = useRef({ queue: [], delay: 0 }).current;
    l.page = page;

    useEffect(() => {
        if (backToStart) {
            setBackToStart(false);
            setPage(START_PAGE);
            setAlert({ alert: null });
            setSkill(0);
            setSize(1);

            if (backToStart === 'init') {
                setAppState({ sounds: appState.sounds, states: {} });
            } else {
                SIZES.forEach((_, i) => setState(0, i + 1, {}));
            }
        }
    }, [appState.sounds, backToStart, setAlert, setAppState, setPage, setSize, setSkill, setState, size, skill]);

    const onBoardUpdate = useCallback((gob) => {
        const board = getBoard(gob);

        if (!board) {
            return;
        };

        const doUpdate = () => {
            const { skill, size } = gob.board_update;
            const sob = getState(skill, size);
            const { turn } = board;

            setState(skill, size, { ...sob, turn });
            setSize(size);
            setSkill(skill);
        };

        doUpdate();

        if (board.force_event === S_NEW_GAME || board.force_event === S_PLAYER_RESTARTED) {
            setAlert({ alert: board.force_event });
        }
    }, [getState, setAlert, setSize, setSkill, setState]);

    const onPlayerPage = useCallback((gob) => {
        // TODO?
    }, []);

    const onSkillSet = useCallback((gob) => {
        setSkill(gob.skill);
    }, [setSkill]);

    const onSwitchPlayer = useCallback(() => {
        if (page === GAME_PAGE) {
            playSound('oops', { rate: 2 });
        }

        setTurn(myPlayer);
    }, [myPlayer, page, playSound, setTurn]);

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

        const { ra, gob } = l.queue.shift();

        switch (ra) {
            case RA_BOARD_UPDATE:
                onBoardUpdate(gob);
                break;
            case RA_PLAYER_PAGE:
                onPlayerPage(gob);
                break;
            case RA_SKILL_SET:
                onSkillSet(gob);
                break;
            case RA_SWITCH_PLAYER:
                onSwitchPlayer();
                break;
            default: break;
        }

        if (l.queue.length) {
            doSetNext();
        }
    }, [doSetNext, l, next, onBoardUpdate, onPlayerPage, onSkillSet, onSwitchPlayer]);

    const onOppEvent = (ae) => {
        if (l.page === START_PAGE) {
            return false;
        }

        const re = ae?.name;
        const msg = re === PLAYER_JOINED ? S_OPP_JOINED : re === PLAYER_LEFT ? S_OPP_LEFT : null;

        if (!msg) {
            return false;
        }

        setAlert({ alert: msg, duration: 0 });

        if (myPlayerId) {
            defer(() => runeAction(RA_INIT));
        }

        defer(() => setBackToStart(true), 2000);
        return true;
    };

    const processOnChange = (ae, rg) => {
        if (onOppEvent(ae)) {
            return;
        }

        const ra = ae?.name;

        if (ra === RA_STARTED || ra === RA_PERSIST) {
            return;
        }

        const gob = _.cloneDeep(rg);

        if (ra === RA_BOARD_UPDATE) {
            if (l.page !== GAME_PAGE) {
                onBoardUpdate(gob);
                return;
            }

            const board = getBoard(rg);

            if (!board.force_event) {
                return;
            }
        } else if (ra === RA_SWITCH_PLAYER) {
            onSwitchPlayer();
        }

        const len = l.queue.push({ ra, gob, time: Date.now() });

        if (len === 1) {
            doSetNext();
        }
    };

    const onChange = (props) => {
        const { game, allPlayerIds, yourPlayerId, action, event } = props;
        const rg = _.cloneDeep(game);

        if (!rg.started) {
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

        const re = event?.name;

        if (action || re === PLAYER_JOINED || re === PLAYER_LEFT) {
            processOnChange(action || event, rg);
        } else if (re === 'stateSync' && !rg.started) {
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

    return { onChange, playerInfo };
};

export default useRune;

export const getBoard = (gob) => {
    const { skill, size } = gob.board_update;
    const board = gob.board_update.boards[skill][size - 1];

    return _.isEmpty(board) ? null : board;
};