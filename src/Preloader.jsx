import Avatar from './Images/Avatar.webp';
import Back from './Images/Back.webp';
import Glasses from './Images/Glasses.webp';
import Pattern from './Images/Pattern.webp';
import SwitchTip from './Images/Switch Tip.webp';
import SwitchTipRU from './Images/Switch Tip RU.webp';
import SwitchTipES from './Images/Switch Tip ES.webp';
import SwitchTipPT from './Images/Switch Tip PT.webp';
import Title from './Images/Title.webp';
import YouTube from './Images/YouTube.webp';
import { START_PAGE } from './const';

const Preloader = (props) => {
    const { page: p = null } = props;

    return <div className='dummy' >
        {p === null && <img className='dummy' src={Pattern} alt='' />}
        {p === null && <img className='dummy' src={Title} alt='' />}

        {p === START_PAGE && <img className='dummy' src={25} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Avatar} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Back} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Glasses} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SwitchTip} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SwitchTipRU} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SwitchTipES} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SwitchTipPT} alt='' />}
        {p === START_PAGE && <img className='dummy' src={YouTube} alt='' />}
    </div>;
};

export default Preloader;