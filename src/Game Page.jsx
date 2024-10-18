import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_overlay } from './atoms';
import Toolbar from './Toolbar';

const GamePage = () => {
    const [overlay] = useAtom(a_overlay);
    const opacity = overlay ? 0 : 1;

    return <motion.div className='game-page' animate={{ opacity }} transition={{ duration: opacity ? 0.3 : 0 }}>
        <div>GAME PAGE</div>
        <Toolbar/>
    </motion.div>;
};

export default GamePage;