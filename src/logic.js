import { START_PAGE } from './const';

export const runeInit = (rg) => {
    if (!rg) {
        rg = {};
    }

    rg.mode = null;
    rg.players = [{ page: START_PAGE }, { page: START_PAGE }];
    dg.board_update = {
        boards: { '00': {}, '01': {}, '10': {}, '20': {}, '30': {} }
    };

    return rg;
};

// eslint-disable-next-line no-undef
Rune.initLogic({
    minPlayers: 1,
    maxPlayers: 2,
    persistPlayerData: true,
    reactive: false,
    setup: (allPlayerIds) => runeInit(),
    events: {
        playerJoined: (pid, { game: rg }) => { },
        playerLeft: (pid, { game: rg }) => { runeInit(rg); },
    },
    actions: {
        boardUpdate: ({ size, skill, over, turn, scores, force_event }, { game: rg }) => {
            rg.board_update.size = size;
            rg.board_update.skill = skill;
            rg.board_update.boards[`${size}${skill}`] = { cells, assigned, cleared, extended_by, color_pick, turn, scores, winner, force_event };
        },
        init: (_, { game: rg }) => runeInit(rg),
        persist: (data, { game: ra, playerId: pid }) => {
            const pdata = ra.persisted[pid];
            pdata.version = 1;
            pdata.switch_tip = data.switch_tip;
            pdata.stats = data.stats;
        },
        playerPage: ({ player, page }, { game: ra }) => (ra.players[player - 1].page = page),
        switchPlayer: (player, { game: rg }) => (rg.switchPlayer = player),
    },
});

export const RA_BOARD_UPDATE = 'boardUpdate';
export const RA_INIT = 'init';
export const RA_PERSIST = 'persist';
export const RA_PLAYER_PAGE = 'playerPage';
export const DA_SWITCH_PLAYER = 'switchPlayer';
