import containerize from './utility/containerize';
import makeElement from './utility/make-element';
import '../scss/index.scss';
import '../scss/footer.scss';
import '../scss/menu.scss';
import githubSVG from '../assets/github.svg';
import battleshipLogoSVG from '../assets/battleship.svg';
import battleshipIconSVG from '../assets/battleship-icon.svg';
import battleshipAction from '../assets/battleship-action.jpg';

//
// main layout
//

const renderLayout = () => {
  containerize(
    document.querySelector('body'),
    prepHeader(),
    main,
    prepFooter()
  );
};

const prepHeader = () => {
  return containerize(
    makeElement('header'),
    makeElement('h3', 'header-title', 'Battleship'),
    makeElement(
      'div',
      'header-logo',
      'battleship image',
      '',
      '',
      battleshipIconSVG
    )
  );
};

const prepMain = () => {
  return makeElement('main');
};

const main = prepMain();

const prepFooter = () => {
  return containerize(
    makeElement('footer'),
    containerize(
      makeElement('a', '', '', '', 'https://github.com/bmilcs/odin-battleship'),
      makeElement('div', 'github-svg', 'GitHub Logo', '', '', githubSVG),
      makeElement('p', 'footer-p', 'bmilcs')
    )
  );
};

//
// game play
//

const clearMain = () => {
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }
};

const renderMainMenu = () => {
  containerize(
    main,
    containerize(
      'main-menu-card',
      prepMainLogo(),
      makeElement(
        'p',
        'instructions',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum impedit necessitatibus distinctio corrupti porro fugiat, odit vitae soluta itaque consequuntur at sed eveniet pariatur explicabo consectetur incidunt! Maxime ullam ipsa, laudantium possimus perspiciatis omnis pariatur velit odio eveniet sint repellendus minus, tenetur expedita dolores delectus eos doloribus saepe illo impedit?'
      ),
      makeElement('button', 'start-btn', 'Start Game')
    )
  );
};

const prepMainLogo = () => {
  return containerize(
    'main-logo-container',
    makeElement('img', 'main-img', 'battleship image', '', battleshipAction),
    containerize(
      'logo-text-container',
      makeElement('h1', 'main-title', 'Battleship'),
      makeElement('p', 'main-subtitle', 'The Classic Naval Combat Game')
    )
  );
};

const renderBoard = (boardArr) => {
  //
};

export { renderLayout, renderMainMenu };
