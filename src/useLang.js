import { useAtom } from 'jotai';
import { a_lang } from './atoms';
import SwitchTip from './Images/Switch Tip.webp';
import SwitchTipES from './Images/Switch Tip ES.webp';
import SwitchTipPT from './Images/Switch Tip PT.webp';
import SwitchTipRU from './Images/Switch Tip RU.webp';

export const EN = 'en';
export const ES = 'es';
export const PT = 'pt';
export const RU = 'ru';

export const S_BEST = 'best';
export const S_BEST_SCORE = 'Best score!';
export const S_CONTINUE = 'CONTINUE';
export const S_ITS_DRAW = 'It\'s a draw!';
export const S_ITS_OVER = 'It\'s over!';
export const S_NEW_GAME = 'New game!';
export const S_OPP_GAVE_UP = 'Opponent gave up!';
export const S_OPP_JOINED = 'Player joined!';
export const S_OPP_LEFT = 'Opponent left!';
export const S_OPP_NOT_READY = 'Opponent not ready.';
export const S_PLAYER_NOT_READY = 'Player not ready.';
export const S_PLAYERS_NOT_READY = 'Players not ready.';
export const S_P1_GAVE_UP = 'Player 1 gave up!';
export const S_P1_WON = 'Player 1 won!';
export const S_P2_GAVE_UP = 'Player 2 gave up!';
export const S_P2_WON = 'Player 2 won!';
export const S_PLAYER_RESTARTED = 'Game restarted by opponent.';
export const S_PLAYS = 'plays';
export const S_PLAY_AGAIN = 'Play again?';
export const S_POINTS = 'points';
export const S_RESET_STATS = 'Reset stats?';
export const S_RESUME = 'RESUME';
export const S_START = 'START';
export const S_START_OVER = 'Start over?';
export const S_SURRENDER = 'Surrender?';
export const S_WAITING_FOR_START = 'Waiting for the start...';
export const S_YOU = 'YOU';
export const S_YOU_LOST = 'You lost.';
export const S_YOU_WON = 'You won!';

const useLang = () => {
    const [l] = useAtom(a_lang);

    const className = l === RU ? 'RC' : '';

    const switchTip = l === ES ? SwitchTipES : l === PT ? SwitchTipPT : l === RU ? SwitchTipRU : SwitchTip;

    const str = (s) => {
        if (l === EN) {
            return s;
        }

        switch (s) {
            case S_BEST:
                return l === ES ? 'mejor' : l === PT ? 'melhor' : l === RU ? 'рекорд' : s;
            case S_BEST_SCORE:
                return l === ES ? '¡Récord!' : l === PT ? 'Melhor pontuação!' : l === RU ? 'Личный рекорд!' : s;
            case S_CONTINUE:
                return l === ES ? 'CONTINUAR' : l === PT ? 'CONTINUAR' : l === RU ? 'Продолжить' : s;
            case S_ITS_DRAW:
                return l === ES ? '¡Es un empate!' : l === PT ? 'É um empate!' : l === RU ? 'Ничья!' : s;
            case S_ITS_OVER:
                return l === ES ? '¡Se acabó el juego!' : l === PT ? 'O jogo acabou!' : l === RU ? 'Конец игры!' : s;
            case S_NEW_GAME:
                return l === ES ? '¡Nuevo juego!' : l === PT ? 'Novo jogo!' : l === RU ? 'Новая игра!' : s;
            case S_OPP_GAVE_UP:
                return l === ES ? '¡Se rindió!' : l === PT ? 'O oponente desistiu!' : l === RU ? 'Соперник сдался!' : s;
            case S_OPP_JOINED:
                return l === ES ? '¡Jugador ha entrado!' : l === PT ? 'Jogador entrou!' : l === RU ? 'Игрок присоединился!' : s;
            case S_OPP_LEFT:
                return l === ES ? '¡El oponente se fue!' : l === PT ? 'Oponente saiu!' : l === RU ? 'Соперник ушел!' : s;
            case S_OPP_NOT_READY:
                return l === ES ? 'Oponente no está listo.' : l === PT ? 'Oponente não está pronto.' : l === RU ? 'Соперник не готов.' : s;
            case S_P1_WON:
                return l === ES ? '¡El jugador 1 ganó!' : l === PT ? 'O jogador 1 ganhou!' : l === RU ? 'Первый выиграл!' : s;
            case S_P1_GAVE_UP:
                return l === ES ? '¡El jugador 1 se rindió!' : l === PT ? 'O jogador 1 desistiu!' : l === RU ? 'Первый сдался!' : s;
            case S_P2_WON:
                return l === ES ? '¡El jugador 2 ganó!' : l === PT ? 'O jogador 2 ganhou!' : l === RU ? 'Второй выиграл!' : s;
            case S_P2_GAVE_UP:
                return l === ES ? '¡El jugador 2 se rindió!' : l === PT ? 'O jogador 2 desistiu!' : l === RU ? 'Второй сдался!' : s;
            case S_PLAYER_NOT_READY:
                return l === ES ? 'Jugador no está listo.' : l === PT ? 'Jogador não está pronto.' : l === RU ? 'Игрок не готов.' : s;
            case S_PLAYERS_NOT_READY:
                return l === ES ? 'Jugadores no están listos.' : l === PT ? 'Jogadores não estão prontos.' : l === RU ? 'Игроки не готовы.' : s;
            case S_PLAYER_RESTARTED:
                return l === ES ? 'Juego reiniciado.' : l === PT ? 'Jogo reiniciado.' : l === RU ? 'Игра перезапущена.' : s;
            case S_PLAYS:
                return l === ES ? 'juegos' : l === PT ? 'jogos' : l === RU ? 'игр' : s;
            case S_PLAY_AGAIN:
                return l === ES ? '¿Jugar de nuevo?' : l === PT ? 'Jogar de novo?' : l === RU ? 'Играть ещё?' : s;
            case S_POINTS:
                return l === ES ? 'puntos' : l === PT ? 'pontos' : l === RU ? 'заработано' : s;
            case S_RESET_STATS:
                return l === ES ? '¿Reiniciar estadisticas?' : l === PT ? 'Redefinir estatísticas?' : l === RU ? 'Cбросить статистику?' : s;
            case S_RESUME:
                return l === ES ? 'REANUDAR' : l === PT ? 'RETOMAR' : l === RU ? 'Продолжить' : s;
            case S_START:
                return l === ES ? 'INICIAR' : l === PT ? 'INICIAR' : l === RU ? 'СТАРТ' : s;
            case S_START_OVER:
                return l === ES ? '¿Empezar de nuevo?' : l === PT ? 'Começar de novo?' : l === RU ? 'Начать сначала?' : s;
            case S_SURRENDER:
                return l === ES ? '¿Rendirse?' : l === PT ? 'Desistir?' : l === RU ? 'Сдаёмся?' : s;
            case S_WAITING_FOR_START:
                return l === ES ? 'Esperando el inicio...' : l === PT ? 'Esperando el inicio...' : l === RU ? 'Ждём начала игры...' : s;
            case S_YOU:
                return l === ES ? 'TÚ' : l === PT ? 'TU' : l === RU ? 'ВЫ' : s;
            case S_YOU_LOST:
                return l === ES ? 'Perdiste.' : l === PT ? 'Você perdeu.' : l === RU ? 'Вы проиграли.' : s;
            case S_YOU_WON:
                return l === ES ? '¡Ganaste!' : l === PT ? 'Você ganhou!' : l === RU ? 'Победа!' : s;
            default: break;
        }

        return s;
    };

    return { str, className, lang: l, switchTip };
};

export default useLang;