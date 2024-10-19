import { atom } from 'jotai';
import _ from 'lodash';
import { GAME_PAGE, START_PAGE } from './const';
import { RA_PLAYER_PAGE } from './logic';
import { S_OPP_JOINED, S_OPP_LEFT } from './useLang';
import { defer, runeAction } from './utils';

export const a_app_state = atom({ states: {} });
export const a_rune_game = atom({});
export const a_pids = atom([]);
export const a_solo = atom(get => get(a_pids).length === 1);
export const a_my_player = atom(1);
export const a_spectator = atom(get => get(a_my_player) === 0);
export const a_size = atom(0);
export const a_skill = atom(0);
export const a_my_turn = atom(get => get(a_turn) === get(a_my_player));
export const a_lang = atom(null);

const a_page_base = atom(START_PAGE);
const a_restart_base = atom(null);
const a_resize_base = atom(false);
const a_reset_stats_base = atom(false);
const a_alert_base = atom(null);
const a_overlay_base = atom(null);

export const a_state_key = atom(get => {
    const key = `${get(a_size)}${get(a_skill)}`;
    return key;
});

export const a_state = atom(
    get => {
        const appState = get(a_app_state);
        const key = get(a_state_key);
        const state = _.get(appState.states, key, {});
        return state;
    },

    (get, set, state) => {
        const appState = get(a_app_state);
        const key = get(a_state_key);
        _.set(appState.states, key, state);
        set(a_app_state, { ...appState });
    }
);

export const a_alert = atom(
    get => get(a_alert_base),
    (get, set, { alert, duration = 2000 }) => {
        set(a_alert_base, alert);
        set(a_overlay, null);
        set(a_restart, false);
            set(a_resize, false);
            set(a_reset_stats, false);

        if (alert && duration) {
            defer(() => set(a_alert_base, null), duration);
        }
    }
);

export const a_opp_alert = atom(get => {
    const alert = get(a_alert);
    return alert === S_OPP_LEFT || alert === S_OPP_JOINED ? alert : null;
});

export const a_page = atom(
    get => get(a_page_base),
    (get, set, page) => {
        set(a_page_base, page);

        const player = get(a_my_player);

        if (player) {
            runeAction(RA_PLAYER_PAGE, { player, page });
        }
    }
);
export const a_restart = atom(
    get => get(a_restart_base),
    (get, set, on) => {
        set(a_restart_base, on);

        if (on) {
            set(a_resize, false);
            set(a_reset_stats, false);
        }
    }
);

export const a_resize = atom(
    get => get(a_resize_base),
    (get, set, on) => {
        set(a_resize_base, on);

        if (on) {
            set(a_restart, false);
            set(a_reset_stats, false);
        }
    }
);
export const a_reset_stats = atom(
    get => get(a_reset_stats_base),
    (get, set, on) => {
        set(a_reset_stats_base, on);

        if (on) {
            set(a_restart, false);
            set(a_resize, false);
        }
    }
);

export const a_overlay = atom(
    get => get(a_overlay_base),
    (get, set, page) => {
        set(a_overlay_base, page);

        if (page) {
            set(a_restart, false);
            set(a_resize, false);
            set(a_reset_stats, false);
        }
    }
);

export const a_my_pid = atom(
    get => {
        const p = get(a_my_player);
        return p ? get(a_pids)[p - 1] : null;
    }
);

export const a_turn = atom(
    get => get(a_state).turn || 1,
    (get, set, turn) => set(a_state, { ...get(a_state), turn })
);

export const a_scores = atom(
    get => get(a_state).scores || [0, 0],
    (get, set, scores) => set(a_state, { ...get(a_state), scores })
);

export const a_winner = atom(
    get => get(a_state).winner,
    (get, set, winner) => set(a_state, { ...get(a_state), winner })
);

export const a_over = atom(
    get => get(a_state).over || false,
    (get, set, over) => set(a_state, { ...get(a_state), over })
);

export const a_opp_ready = atom(get => {
    const myPlayer = get(a_my_player);
    const rg = get(a_rune_game);
    const solo = get(a_solo);

    if (!myPlayer) {
        return rg.players[0].page === GAME_PAGE && (solo || rg.players[1].page === GAME_PAGE);
    }

    return solo || rg.players[2 - myPlayer].page === GAME_PAGE;
});

export const a_stats = atom(
    get => {
        if (!get(a_solo)) {
            return null;
        }

        let stats = null;
        let pid = get(a_my_pid);

        if (!pid) {
            pid = get(a_pids)[0];
        }

        if (pid) {
            const data = get(a_rune_game).persisted[pid];
            stats = data.stats;
        }

        return _.get(stats, get(a_state_key), { plays: 0, best: 0 });
    }
);

export const a_best_solo_score = atom(get => {
    if (!get(a_solo)) {
        return false;
    }

    const { plays, best } = get(a_stats);
    return plays > 1 && get(a_scores)[0] === best;
});
