import { useAtom } from 'jotai';
import Back from './Images/Back.webp';
import Help from './Images/Help.webp';
import YouTube from './Images/YouTube.webp';
import ToolButton from './Tool Button';
import { a_overlay, a_page } from './atoms';
import { GAME_PAGE, HELP_PAGE, START_PAGE } from './const';

const Toolbar = () => {
    const [page, setPage] = useAtom(a_page);
    const [overlay, setOverlay] = useAtom(a_overlay);

    const onBack = () => {
        if (overlay) {
            setOverlay(false);
            return;
        }

        if (page === HELP_PAGE) {
            setPage(START_PAGE);
        } else if (page === GAME_PAGE) {
            setPage(START_PAGE);
        }
    };

    const onHelp = () => {
        setOverlay(HELP_PAGE);
    };

    if (page === HELP_PAGE || overlay === HELP_PAGE) {
        return <div className="toolbar">
            <ToolButton img={Back} onClick={onBack} />
            <ToolButton img={YouTube} href="https://youtu.be/49zGPM_mFM8" />
        </div>;
    }

    if (page === GAME_PAGE) {
        return <div className="toolbar">
            <ToolButton img={Back} onClick={onBack} />
            <ToolButton img={Help} onClick={onHelp} />
        </div>;
    }

    return <div className="toolbar">
        <ToolButton img={Back} onClick={onBack} />
    </div>;
};

export default Toolbar;