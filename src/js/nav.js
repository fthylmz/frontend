import forEach from './utils/forEach';

class Navigation {
  constructor(elem, {onOpen = f => f, onClose = f => f}) {
    this.elem = elem;
    this.backButton = this.elem.querySelector('[data-nav-back]');
    // TODO: need to only get first level of items for this list and not any sub navs
    this.items = this.elem.querySelectorAll(
      '[data-nav-list] > li > [data-nav-link]'
    );

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);

    this.isOpen = false;

    this.onOpen = onOpen;
    this.onClose = onClose;

    this.navActiveClass = 'is-open';
    this.subnavActiveClass = 'is-active';

    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.items.forEach(item =>
      item.addEventListener('click', this.handleItemClick)
    );
    this.backButton.addEventListener('click', this.handleBackClick);
  }

  open(subnav) {
    this.isOpen = true;
    this.elem.classList.add(this.navActiveClass);

    subnav.classList.add(this.subnavActiveClass);

    this.onOpen(this.elem);
  }

  close() {
    this.elem.classList.remove(this.navActiveClass);
    this.elem.classList.remove(this.subnavActiveClass);
    this.isOpen = false;

    this.onClose(this.elem);
  }

  handleBackClick(e) {
    e.preventDefault();
    this.close();
  }

  handleItemClick(e) {
    const subnav = e.target.nextElementSibling;

    if (subnav && subnav.hasAttribute('data-nav')) {
      e.preventDefault();
      this.open(subnav);
    }
  }
}

const navs = document.querySelectorAll('[data-nav]');

const headerNav = document.querySelector('.site-header__nav');

forEach(
  navs,
  elem =>
    new Navigation(elem, {
      onClose: nav => {
        // headerNav.removeAttribute('style');
      },
      onOpen: nav => {
        const children = nav.querySelectorAll('.site-nav__content');

        let height = 0;

        forEach(children, elem => {
          const h = elem.clientHeight;
          if (h > height) {
            height = h;
          }
        });

        if (height > window.innerHeight) {
          headerNav.style.minHeight = height + 'px';
        }
        else {
          headerNav.style.minHeight = '100vh';
        }
      }
    })
);

module.exports = Navigation;
