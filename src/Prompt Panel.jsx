import { motion } from 'framer-motion';
import _ from 'lodash';
import SvgPromptX from './Svg Prompt X';
import { X } from './const';
import { isOnMobile } from './utils';
import useLang from './useLang';

const PromptPanel = (props) => {
    const { id, labels, onClick, show, style, buttonStyle, pulse, delay = 0 } = props;

    const Button = (props) => {
        const { label, index } = props;
        const { className } = useLang();

        const width = label === X || label === 'GO' ? '48px' : 'unset';
        const transition = { repeat: Infinity, repeatType: 'reverse', ease: 'linear', duration: 0.25 };
        const classes = `prompt-button${isOnMobile() ? '-mobile' : ''} ${className}`;
        const cursor = show ? 'pointer' : 'initial';
        const pointerEvents = show && onClick ? 'initial' : 'none';

        return <motion.div className={classes} onClick={() => onClick(index + 1)}
            style={{ cursor, pointerEvents, width, ...buttonStyle }} initial={{ transform: 'scale(1)' }}
            animate={{ transform: `scale(${pulse ? 0.8 : 1})` }} transition={pulse ? transition : false}>
            <div>{label === X ? <SvgPromptX width={56} /> : label}</div>
        </motion.div>;
    };

    return <motion.div id={id} className='prompt-panel' animate={{ opacity: show ? 1 : 0, transform: `scale(${show ? 1 : 0})` }}
        transition={{ type: 'spring', damping: 15, delay }} style={{ ...style }}>
        {_.map(labels, (label, i) => <Button key={i} label={label} index={i} />)}
    </motion.div>;
};

export default PromptPanel;