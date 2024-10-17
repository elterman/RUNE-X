import { useAtom } from 'jotai';
import _ from 'lodash';
import { a_app_state, a_dusk_game, a_restart, a_size, a_skill, a_solo, a_spectator, a_total_to_clear } from './atoms';
import { COL_COUNT, FORCE, PALETTE, ROW_COUNT, SOLO_SEED } from './const';
import { S_NEW_GAME } from './useLang';
import { raBoardUpdate } from './utils';

const useGameState = () => {
    const [dg] = useAtom(a_dusk_game);
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

        const count = COL_COUNT * ROW_COUNT;
        const { turn = 1 } = getState(size, skill) || {};
        const sob = { turn, scores: [0, 0] };

        const indexes = _.map(_.sampleSize(_.range(0, count), solo ? SOLO_SEED : count - 6), i => +i);
        const keys = _.keys(PALETTE).slice(1);

        for (let i = 0; i < count; i++) {
            const key = indexes.includes(i) ? _.sample(keys) : 0;
            sob.cells.push({ index: i, key: +key });

            if (key) {
                sob.assigned += 1;
            }
        }

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
            const { board_update } = dg;
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