import { useAtom } from 'jotai';
import _ from 'lodash';
import { a_app_state, a_rune_game, a_pids, a_my_pid } from './atoms';
import { RA_PERSIST } from './logic';
import { runeAction } from './utils';

const usePersistedData = () => {
    const [rg, setRuneGame] = useAtom(a_rune_game);
    const [appState] = useAtom(a_app_state);
    const [pids] = useAtom(a_pids);
    const [pid] = useAtom(a_my_pid);

    const data = _.get(rg.persisted, pid || pids[0], null);
    const switchTip = data?.switch_tip !== false;

    const getStats = (key) => {
        let stats = _.get(data, 'stats', null);
        stats = _.get(stats, key, null);

        return stats || { plays: 0, best: 0 };
    };

    const hideTip = (tip) => {
        const game = _.cloneDeep(rg);
        const data = game.persisted[pid];
        data[tip] = false;
        setRuneGame(game);
        runeAction(RA_PERSIST, data);
    };

    const hideSwitchTip = () => data && hideTip('switch_tip');

    const updateStats = (key, stats) => runeAction(RA_PERSIST, { ...data, stats: { ...data.stats, [key]: stats } });

    const haveStats = () => {
        const stats = _.get(data, 'stats', null);
        const keys = _.keys(appState.states);

        const found = _.some(keys, (key) => {
            const sob = _.get(stats, key, null);
            return sob?.plays > 0;
        });

        return found;
    };

    return { persistedData: data, switchTip, hideSwitchTip, getStats, updateStats, haveStats };
};

export default usePersistedData;