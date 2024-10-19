import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Avatar from './Images/Avatar.webp';
import Glasses from './Images/Glasses.webp';
import { a_alert, a_my_player, a_over, a_solo, a_turn } from './atoms';
import { _11 } from './const';
import useLang from './useLang';
import useRune from './useRune';
import { useSwitchPlayer } from './useSwitchPlayer';

const Player = ({ player, style }) => {
    const [turn] = useAtom(a_turn);
    const [solo] = useAtom(a_solo);
    const [alert] = useAtom(a_alert);
    const [over] = useAtom(a_over);
    const { playerInfo } = useRune();
    const [myPlayer] = useAtom(a_my_player);
    const { canSwitchPlayer, switchPlayer } = useSwitchPlayer();
    const { str } = useLang();

    const gridArea = _11;
    const pi = playerInfo(player);
    let src = Avatar;
    let name = 'Triangulator';

    if (solo) {
        if (player === 1) {
            src = pi.avatarUrl;
            name = pi.displayName;
        }
    } else if (pi && (player === 1 || !alert)) {
        src = pi.avatarUrl;
        name = pi.displayName;
    }

    const renderAvatar = () => {
        const winner = 0;
        const robotWon = solo && winner === 2;
        const cool = !robotWon && winner && (winner === (myPlayer === 2 ? 3 - player : player));
        const opacity = cool ? 1 : 0;
        const transform = `translateY(${cool ? 0 : -90}px)`;
        const width = 55;

        return <div className='avatar'>
            {pi && <img src={Avatar} alt='avatar placeholder' width={width} style={{ gridArea }} />}
            <img src={src} alt='avatar' width={width} style={{ gridArea, zIndex: 1 }} />
            {!!cool && <motion.img className='glasses' src={Glasses} alt='glasses' width={width} animate={{ opacity, transform }} transition={{ duration: cool ? 1 : 0 }} />}
        </div>;
    };

    const renderName = () => {
        const background = `linear-gradient(180deg, ${player === 1 ? '#56BF8B, #468235' : '#BD55BD, #703583'} 50%)`;
        return <div className='player-name' style={{ background }}><div className='ellipsis'>{name}</div></div>;
    };

    const animate = { transform: 'rotateY(90deg)' };
    const transition = { repeat: Infinity, repeatType: 'reverse', ease: 'linear', duration: 0.4 };
    const spin = !over && !alert && (myPlayer ? ((player === turn) === (myPlayer === 1)) : (player === turn));
    const canClick = canSwitchPlayer();
    const pointerEvents = canClick ? 'auto' : 'none';
    const cursor = canClick ? 'pointer' : 'initial';

    return <div className='player' style={{ pointerEvents, cursor, ...style }} onClick={switchPlayer}>
        {spin && <motion.div style={{ gridArea }} animate={animate} transition={transition}>{renderAvatar()}</motion.div>}
        {!spin && renderAvatar()}
        {renderName()}
        {!solo && !!myPlayer && player === 1 && <div className='you'>
            <div className='you-label'>{str('YOU')}</div>
        </div>}
    </div>;
};

export default Player;