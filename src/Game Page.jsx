import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_overlay } from './atoms';
import Prompts from './Prompts';
import Toolbar from './Toolbar';
import Scoreboard from './Scoreboard';

const GamePage = () => {
    const [overlay] = useAtom(a_overlay);
    const opacity = overlay ? 0 : 1;

    return <motion.div className='game-page' animate={{ opacity }} transition={{ duration: opacity ? 0.3 : 0 }}>
        <div></div>
        <Scoreboard />
        <div></div>
        <Prompts />
        <Toolbar />
    </motion.div>;
};

export default GamePage;