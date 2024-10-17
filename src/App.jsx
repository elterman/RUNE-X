import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import './App.css';
import { a_lang, a_page } from './atoms';
import { appBackground } from './Background';
import { GAME_PAGE, HELP_PAGE, START_PAGE } from './const.js';
import GamePage from './Game Page.jsx';
import HelpPage from './Help Page.jsx';
import BMG from './Images/BMG.webp';
import Preloader from './Preloader.jsx';
import StartPage from './Start Page.jsx';
import useRune from './useRune.js';
import { defer, windowSize } from './utils';
import { EN, ES, PT, RU } from './useLang.js';

const App = () => {
    const [starting, setStarting] = useState(true);
    const [splash, setSplash] = useState(true);
    const [page] = useAtom(a_page);
    const { onChange } = useRune();
    const [language, setLanguage] = useAtom(a_lang);

    useEffect(() => {
        if (language) {
            return;
        }

        const l = (navigator.language || navigator.languages[0]).split('-')[0];
        setLanguage(l === ES || l === PT || l === RU ? l : EN);

        // eslint-disable-next-line no-undef
        Rune.initClient({ onChange });
    }, [language, onChange, setLanguage]);

    const { x: wx, y: wy } = windowSize();

    if (starting) {
        defer(() => {
            setStarting(false);
            defer(() => setSplash(false), 300);
        }, 0);
    }

    const renderContent = () => {
        const bmgWidth = Math.min(300, Math.min(wx, wy) * 0.6);

        if (splash) {
            return <>
                <motion.div className="splash" animate={{ opacity: starting ? 1 : 0 }}>
                    <img src={BMG} alt="BMG" width={bmgWidth} />
                </motion.div>
            </>;
        }

        if (starting) {
            return null;
        }

        return <>
            {page === START_PAGE ? <StartPage /> : null}
            {page === GAME_PAGE ? <GamePage /> : null}
            {page === HELP_PAGE ? <HelpPage /> : null}
        </>;
    };

    const backgroundImage = appBackground();
    const sz = 520;

    return <div id='app' className="App" style={{ backgroundImage, backgroundSize: `${sz}px ${sz}px` }} >
        {renderContent()}
        {starting && <Preloader />}
    </div>;
};

export default App;
