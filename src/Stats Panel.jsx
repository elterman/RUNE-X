import { useAtom } from 'jotai';
import { a_solo, a_stats } from './atoms';
import useLang from './useLang';

const StatsPanel = () => {
    const [solo] = useAtom(a_solo);
    const [stats] = useAtom(a_stats);
    const { str, className } = useLang();

    if (solo) {
        const { plays, best } = stats;
        const classes = `stats-panel-label ${className}`;

        return <div className="stats-panel" >
            <div className={classes}>{str('plays')}</div>
            <div className='stats-panel-value'>{plays}</div>
            <div className={classes}>{str('best')}</div>
            <div className='stats-panel-value'>{`${best}%`}</div>
        </div>;
    }

    return <div style={{ height: '20px' }} />;
};

export default StatsPanel;