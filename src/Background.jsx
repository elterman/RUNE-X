import Pattern from './Images/Pattern.webp';

export const appBackground = (props) => {
    const {colorFrom = '#0000', colorTo = '#000', radius = 150} = props;
    return `radial-gradient(${colorFrom}, ${colorTo || colorFrom} ${radius}%), url(${Pattern})`;
};
