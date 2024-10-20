import { motion } from 'framer-motion';
import Help from './Images/Help.webp';
import Play from './Images/Play.webp';
import Title from './Images/Title.webp';
import { useState } from 'react';
import usePlaySound from './usePlaySound';
import { useAtom } from 'jotai';
import { a_page } from './atoms';
import { GAME_PAGE, HELP_PAGE } from './const';

const StartPage = () => {
    const [, setPage] = useAtom(a_page);

    const onHelp = () => {
        setPage(HELP_PAGE);
    };

    const onPlay = () => {
        setPage(GAME_PAGE);
    };

    return <motion.div className='start-page' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <img src={Title} alt='' width='90%' />
        <div className='start-options'>
            <AnimatedButton img={Play} width={120} onClick={onPlay} />
            <AnimatedButton img={Help} width={150} onClick={onHelp} />
        </div>
    </motion.div>;
};

export default StartPage;

const AnimatedButton = (props) => {
    const { width, img, onClick } = props;
    const [scale, setScale] = useState(1);
    const playSound = usePlaySound();

    const onAnimationComplete = () => {
        if (scale < 1) {
            setScale(1);
            onClick && onClick();
        }
    };

    const onClicked = () => {
        playSound('tap');
        setScale(0.7);
    };

    const animate = { transform: `scale(${scale})` };
    const transition = { duration: 0.1 };

    return <motion.div animate={animate} transition={transition} onAnimationComplete={onAnimationComplete}>
        <img src={img} alt='' width={width} onClick={onClicked} />
    </motion.div>;
};