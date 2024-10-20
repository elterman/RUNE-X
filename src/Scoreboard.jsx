import { useAtom } from 'jotai';
import Player from './Player';
import { a_my_player, a_opp_alert, a_scores, a_solo } from './atoms';
import { COLOR1, COLOR2 } from './const';

const Scoreboard = () => {
    const [myPlayer] = useAtom(a_my_player);
    const [scores] = useAtom(a_scores);
    const [solo] = useAtom(a_solo);
    const [oppAlert] = useAtom(a_opp_alert);
    const score1 = scores[0];
    const score2 = scores[1];

    if (solo || oppAlert) {
        return <div className="scoreboard">
            <Player player={1} style={{ gridArea: '1/3' }} />
        </div>;
    }

    const swap = myPlayer === 2;
    const s1 = swap ? score2 : score1;
    const s2 = swap ? score1 : score2;

    return <div className="scoreboard">
        <Player player={1} style={{ gridArea: '1/1' }} />
        <div className='score' style={{ color: COLOR1, gridArea: '1/2' }}>{s1}</div>
        {/* <div></div> */}
        <div className='score' style={{ color: COLOR2, gridArea: '1/4' }}>{s2}</div>
        {<Player player={2} style={{ gridArea: '1/5' }} />}
    </div>;
};

export default Scoreboard;