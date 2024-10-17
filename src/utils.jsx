import _ from 'lodash';
import { RA_BOARD_UPDATE } from './logic';

export const windowSize = () => {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { x, y };
};

export const isOnMobile = () => typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;

export const scrollClass = () => `root-scroll ${isOnMobile() ? 'root-scroll-mobile' : ''}`;

const inView = ob => {
    if (!ob) {
        return;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return;
    }

    const r1 = { x1: e.offsetLeft, y1: e.offsetTop };
    r1.x2 = r1.x1 + e.offsetWidth;
    r1.y2 = r1.y1 + e.offsetHeight;

    const s = document.getElementById('surface');
    const r2 = { x1: s.offsetLeft + s.scrollLeft, y1: s.offsetTop + s.scrollTop };
    r2.x2 = r2.x1 + s.offsetWidth;
    r2.y2 = r2.y1 + s.offsetHeight;

    return r1.x1 >= r2.x1 && r1.x2 <= r2.x2 && r1.y1 >= r2.y1 && r1.y2 <= r2.y2;
};

export const scrollTo = ob => {
    if (!ob) {
        return;
    }

    if (inView(ob)) {
        return false;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return false;
    }

    e.scrollIntoView({ behavior: 'smooth' });

    return true;
};

export const clientRect = obid => {
    const ob = document.getElementById(obid);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const defer = (fn, ms = 1) => _.delay(fn, ms);

export const runeAction = (action, arg) => {
    // console.log({ action, arg });
    // eslint-disable-next-line no-undef
    Rune.actions[action](arg);
};

export const raBoardUpdate = props => {
    let { size, skill, turn, scores, force_event } = props;

    defer(() => runeAction(RA_BOARD_UPDATE, {
        size, skill, turn, scores, force_event
    }));
};
