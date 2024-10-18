import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_overlay } from './atoms';
import Prompts from './Prompts';
import Toolbar from './Toolbar';
import { _11 } from './const';

const GamePage = () => {
    const [overlay] = useAtom(a_overlay);
    const opacity = overlay ? 0 : 1;

    return <motion.div className='game-page' animate={{ opacity }} transition={{ duration: opacity ? 0.3 : 0 }}>
        <div style={{ gridArea: _11 }}>GAME PAGE</div>
        <Prompts />
        <Toolbar />
    </motion.div>;
};

export default GamePage;