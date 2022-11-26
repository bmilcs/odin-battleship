import containerize from './utility/containerize';
import makeElement from './utility/make-element';
import '../scss/index.scss';

const renderLayout = () => {
  containerize(
    document.querySelector('body'),
    prepHeader()
    // prepMain(),
    // prepFooter()
  );
};

const prepHeader = () => {
  return containerize(
    'header-container',
    makeElement('h1', 'page-title', 'Battleship')
  );
};

export { renderLayout };
