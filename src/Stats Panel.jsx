import { useAtom } from 'jotai';
import { a_opp_alert, a_solo, a_stats } from './atoms';
import useLang from './useLang';

const StatsPanel = () => {
    const [solo] = useAtom(a_solo);
    const [stats] = useAtom(a_stats);
    const [oppAlert] = useAtom(a_opp_alert);
    const { str, className } = useLang();

    if (solo) {
        const { plays, best } = stats;
        const classes = `stats-panel-label ${className}`;
        const opacity = oppAlert ? 0 : 1;

        return <div className="stats-panel" style={{ opacity }} >
            <div className={classes}>{str('plays')}</div>
            <div className='stats-panel-value'>{plays}</div>
            <div className={classes}>{str('best')}</div>
            <div className='stats-panel-value'>{`${best}%`}</div>
        </div>;
    }

    return null;
};

export default StatsPanel;