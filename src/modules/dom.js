import containerize from './utility/containerize';
import makeElement from './utility/make-element';
import '../scss/index.scss';
import '../scss/footer.scss';
import githubSVG from '../assets/github.svg';
import battleshipImg from '../assets/battleship.svg';

const renderLayout = () => {
  containerize(
    document.querySelector('body'),
    prepHeader(),
    prepMain(),
    prepFooter()
  );
};

const prepHeader = () => {
  return containerize(
    makeElement('header'),
    makeElement('img', 'page-logo', 'battleship image', '', battleshipImg),
    makeElement('h1', 'page-title', 'Battleship'),
    makeElement('p', 'page-subtitle', 'The Classic Naval Combat Game')
  );
};

const prepMain = () => {
  return makeElement('main');
};

const prepFooter = () => {
  return containerize(
    makeElement('footer'),
    containerize(
      makeElement('a', '', '', '', 'https://github.com/bmilcs/odin-battleship'),
      makeElement('img', 'github-svg', 'GitHub Logo', '', githubSVG),
      makeElement('p', 'footer-p', 'bmilcs')
    )
  );
};

export { renderLayout };
