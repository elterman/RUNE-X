import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import './App.css';
import { a_lang, a_overlay, a_page } from './atoms';
import { appBackground } from './appBackground.jsx';
import { _11, GAME_PAGE, HELP_PAGE, START_PAGE } from './const.js';
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
    const [overlay] = useAtom(a_overlay);

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

    const gridArea = _11;

    const renderContent = () => {
        const bmgWidth = Math.min(300, Math.min(wx, wy) * 0.6);

        if (splash) {
            return <div style={{ gridArea }}>
                <motion.div className="splash" animate={{ opacity: starting ? 1 : 0 }}>
                    <img src={BMG} alt="BMG" width={bmgWidth} />
                </motion.div>
            </div>;
        }

        if (starting) {
            return null;
        }

        const renderOverlay = () => {
            switch (overlay) {
                case HELP_PAGE: return <HelpPage />;
                default: return null;
            }
        };

        return <div style={{ gridArea, display: 'grid' }}>
            {page === START_PAGE ? <StartPage /> : null}
            {page === HELP_PAGE ? <HelpPage /> : null}
            {page === GAME_PAGE ? <>
                <GamePage />
                {overlay && renderOverlay()}
            </> : null}
        </div>;
    };

    const { image: backgroundImage, size: backgroundSize, opacity, gradient } = appBackground();

    return <div id='app' className="App">
        <div id='app-bg' style={{ display: 'grid', gridArea, backgroundImage, backgroundSize, opacity }} />
        <div id='app-bg-gradient' style={{ display: 'grid', gridArea, backgroundImage: gradient }} />
        {renderContent()}
        {starting && <Preloader />}
    </div>;
};

export default App;
