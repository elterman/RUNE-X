import { useAtom } from 'jotai';
import { a_my_player, a_solo, a_turn } from './atoms';
import { RA_SWITCH_PLAYER } from './logic';
import usePersistedData from './usePersistedData';
import usePlaySound from './usePlaySound';
import { defer, runeAction } from './utils';

export const useSwitchPlayer = () => {
    const [solo] = useAtom(a_solo);
    const playSound = usePlaySound();
    const [myPlayer] = useAtom(a_my_player);
    const [turn, setTurn] = useAtom(a_turn);
    const { hideSwitchTip } = usePersistedData();

    const canSwitchPlayer = () => {
        if (!myPlayer || myPlayer !== turn) {
            return false;
        }

        return true;
    };

    const switchPlayer = () => {
        playSound('oops', { rate: 2 });

        const player = 3 - turn;
        setTurn(player);

        if (!solo && myPlayer) {
            runeAction(RA_SWITCH_PLAYER, player);
        };

        defer(hideSwitchTip, 100);
    };

    return { canSwitchPlayer, switchPlayer };
};
