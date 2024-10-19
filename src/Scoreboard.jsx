import { useAtom } from 'jotai';
import Player from './Player';
import { a_my_player, a_scores } from './atoms';
import { COLOR1, COLOR2 } from './const';

const Scoreboard = () => {
    const [myPlayer] = useAtom(a_my_player);
    const [scores] = useAtom(a_scores);
    const score1 = scores[0];
    const score2 = scores[1];

    const swap = myPlayer === 2;
    const s1 = swap ? score2 : score1;
    const s2 = swap ? score1 : score2;

    return <div className="scoreboard">
        <Player player={1} />
        <div className='score' style={{ color: COLOR1 }}>{s1}</div>
        <div></div>
        <div className='score' style={{ color: COLOR2 }}>{s2}</div>
        {<Player player={2} />}
    </div>;
};

export default Scoreboard;