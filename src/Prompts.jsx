import { useAtom } from 'jotai';
import PromptPanel from './Prompt Panel';
import { a_alert, a_my_player, a_opp_alert, a_opp_ready, a_reset_stats, a_resize, a_restart, a_size, a_skill, a_solo, a_spectator, a_state_key, a_stats } from './atoms';
import { SIZES, X } from './const';
import useGameState from './useGameState';
import useLang, { S_NEW_GAME, S_PLAY_AGAIN, S_PLAYER_RESTARTED, S_RESET_STATS, S_START_OVER, S_SURRENDER } from './useLang';
import usePersistedData from './usePersistedData';
import usePlaySound from './usePlaySound';
import { defer } from './utils';

const Prompts = () => {
    const [solo] = useAtom(a_solo);
    const [restart, setRestart] = useAtom(a_restart);
    const [resize, setResize] = useAtom(a_resize);
    const [size, setSize] = useAtom(a_size);
    const [skill] = useAtom(a_skill);
    const [resetStats, setResetStats] = useAtom(a_reset_stats);
    const [alert] = useAtom(a_alert);
    const [oppAlert] = useAtom(a_opp_alert);
    const [stats] = useAtom(a_stats);
    const { updateStats } = usePersistedData();
    const [oppReady] = useAtom(a_opp_ready);
    const [myPlayer] = useAtom(a_my_player);
    const [spectator] = useAtom(a_spectator);
    const [stateKey] = useAtom(a_state_key);
    const playSound = usePlaySound();
    const { startOver, onSizeOrSkillSelected } = useGameState();
    const { str } = useLang();

    const over = false; // TODO

    const dismiss = (cancel) => {
        setRestart(false);
        setResetStats(false);
    };

    const onResponse = (op) => {
        playSound('tap');

        if (op === 1) {
            if (resetStats) {
                setResetStats(false);
                updateStats(stateKey, null);
            } else if (restart || over) {
                setRestart(false);

                defer(() => {
                    if (restart) {
                        startOver(size, skill, S_PLAYER_RESTARTED);

                        if (solo) {
                            updateStats(stateKey, { ...stats, plays: stats.plays + 1 });
                        }
                    } else {
                        startOver(size, skill, S_NEW_GAME);
                    }
                });
            }
        } else {
            dismiss(true);
        }
    };

    const onResize = (op) => {
        playSound('tap');
        setResize(false);

        if (op !== size) {
            setSize(op);
            const startedOver = onSizeOrSkillSelected(op);

            if (startedOver) {
                playSound('dice');
            }
        }
    };

    const overPrompt = S_PLAY_AGAIN;
    const alertPanelStyle = { marginTop: 0 };
    const alertButtonStyle = { color: 'white', pointerEvents: 'none', height: '36px', padding: '20px' };
    const resizeStyle = { fontSize: '28px', width: 50, height: 50, borderRadius: '50%' };
    const showOver = over && !oppAlert && !resetStats && !resize;
    const pointerEvents = myPlayer ? 'all' : 'none';

    return <>
        <PromptPanel id='pp-over' labels={[overPrompt]} delay={showOver ? 0.5 : 0} onClick={onResponse} show={showOver}
            buttonStyle={{ pointerEvents }} />
        <PromptPanel id='pp-restart' labels={[str(solo ? S_START_OVER : S_SURRENDER), X]} onClick={onResponse}
            show={restart && !resetStats && !oppAlert} />
        <PromptPanel id='pp-reset-stats' labels={[str(S_RESET_STATS), X]} onClick={onResponse} show={resetStats} />
        <PromptPanel id='pp-opp-not-ready' labels={[str(`${spectator ? `Player${solo ? '' : 's'}` : 'Opponent'} not ready.`)]}
            show={!oppReady && !oppAlert && !restart && !resize && (!over || spectator)} />
        <PromptPanel id='pp-alert' labels={[str(alert)]} show={!!alert} style={alertPanelStyle} buttonStyle={alertButtonStyle} />
        <PromptPanel id='pp-sizes' labels={SIZES} onClick={onResize} show={resize && !oppAlert} buttonStyle={resizeStyle} />
    </>;
};

export default Prompts;