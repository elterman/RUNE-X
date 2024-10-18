import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { a_lang } from './atoms';
import Toolbar from './Toolbar';
import { useForceUpdate } from './useForceUpdate';
import { scrollClass } from './utils';

const HelpPage = () => {
    const [lang] = useAtom(a_lang);
    const forceUpdate = useForceUpdate(true);

    useEffect(() => {
        forceUpdate();

        window.addEventListener('resize', forceUpdate);
        return () => window.removeEventListener('resize', forceUpdate);
    }, [forceUpdate]);

    const content = {
        'en': <>
        <div>HELP PAGE</div>
        </>,
        'es': <>
        </>,
        'pt': <>
        </>,
        'ru': <>
        </>,
    };

    return <motion.div className='help-page' animate={{ opacity: 1 }}>
        <div className={scrollClass()}>
            <div className='help-content'>{content[lang]}</div>
        </div>
        <Toolbar />
    </motion.div>;
};

export default HelpPage;