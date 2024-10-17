import { useAtom } from 'jotai';
import _ from 'lodash';
import { a_app_state, a_rune_game, a_restart, a_size, a_skill, a_solo, a_spectator } from './atoms';
import { FORCE } from './const';
import { S_NEW_GAME } from './useLang';
import { raBoardUpdate } from './utils';

const useGameState = () => {
    const [rg] = useAtom(a_rune_game);
    const [appState, setAppState] = useAtom(a_app_state);
    const [spectator] = useAtom(a_spectator);
    const [solo] = useAtom(a_solo);
    const [, setSkill] = useAtom(a_skill);
    const [, setRestart] = useAtom(a_restart);
    const [, setSize] = useAtom(a_size);

    const { states } = appState;

    const getStateKey = (size, skill) => `${size}${skill || 0}`;

    const getState = (size, skill) => {
        const key = getStateKey(size, skill);
        return states[key] || {};
    };

    const setState = (size, skill, sob) => {
        const key = getStateKey(size, skill);
        _.set(appState.states, key, sob);
        setAppState({ ...appState });
    };

    const startOver = (size, skill, force_event = null) => {
        setRestart(false);

        const { turn = 1 } = getState(size, skill) || {};
        const sob = { turn, scores: [0, 0] };

        setState(size, skill, { ...sob });

        if (!spectator) {
            raBoardUpdate({ size, skill, ...sob, force_event });
        }

        return sob;
    };

    const maybeStartOver = (size, skill) => {
        let sob = getState(size, skill);
        const over = true;

        if (over) {
            sob = startOver(size, skill, over ? S_NEW_GAME : FORCE);
            return true;
        } else if (!spectator) {
            raBoardUpdate({ size, skill, ...sob, force_event: FORCE });
            return false;
        }
    };

    const onSizeOrSkillSelected = (size, skill = 0) => {
        if (spectator) {
            const { board_update } = rg;
            const { size: sz, skill: sk, boards } = board_update;

            if (sz === undefined) {
                return;
            }

            setSize(sz);
            setSkill(sk);
            const board = boards[getStateKey(sz, sk)];
            const { turn, scores } = board;
            const sob = getState(sz, sk);
            setState(sz, sk, { ...sob, turn, scores });
        } else {
            return maybeStartOver(size, size ? 0 : skill);
        }
    };

    return { getStateKey, getState, setState, startOver, onSizeOrSkillSelected };
};

export default useGameState;