import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_overlay } from './atoms';
import Prompts from './Prompts';
import Toolbar from './Toolbar';
import Scoreboard from './Scoreboard';
import Board from './Board';
import StatsPanel from './Stats Panel';

const GamePage = () => {
    const [overlay] = useAtom(a_overlay);
    const opacity = overlay ? 0 : 1;

    return <motion.div className='game-page' animate={{ opacity }} transition={{ duration: opacity ? 0.3 : 0 }}>
        <StatsPanel/>
        <Scoreboard />
        <Board />
        <Prompts />
        <Toolbar />
    </motion.div>;
};

export default GamePage;