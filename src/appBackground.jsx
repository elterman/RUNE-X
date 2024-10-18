import Pattern from './Images/Pattern.webp';

const appBackgroundGradient = (props = {}) => {
    const { colorFrom = '#0000', colorTo = '#000', radius = 100 } = props;
    return `radial-gradient(${colorFrom}, ${colorTo || colorFrom} ${radius}%)`;
};

export const appBackground = (props = {}) => {
    const { sz = 78 } = props;
    return { image: `url(${Pattern})`, size: `${sz}px ${sz}px`, opacity: 0.125, gradient: appBackgroundGradient() };
};