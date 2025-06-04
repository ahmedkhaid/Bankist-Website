'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const btnScroll = document.querySelector('.btn--scroll-to');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//implement the scrolling
btnScroll.addEventListener('click', function () {
  const scrollDownTo = section1.getBoundingClientRect();
  console.log(scrollDownTo);
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); //the scroll posetion
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  // window.scrollTo({
  //   left: window.pageXOffset + scrollDownTo.left,
  //   top: window.pageYOffset + scrollDownTo.top,
  //   behavior: 'smooth',
  // });//the old way may used some time
  section1.scrollIntoView({ behavior: 'smooth' });
});
//implementing the tabed compunent
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard close
  if (!clicked) return;
  //removing the active tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //add the active TAPAclass
  clicked.classList.add('operations__tab--active');
  //add the active class to the content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//the intersaction observition api
//the callback will be called when the element intersect the root by the percentage which is the threshold
// const obseCallback = function (entries, observe) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obOptions = {
//   root: null,
//   threshold: 0,
// };
// const observer = new IntersectionObserver(obseCallback, obOptions);
// observer.observe(section1);
const headerSection = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const optionNav = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, optionNav);
headerObserver.observe(headerSection);

//revealing the section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//lazy loading images
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyLoading = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
      observer.unobserve(entry.target);
    });
  });
};
const imageObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImages.forEach(image => imageObserver.observe(image));
//implementing the slider

const slider = function () {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length;
  const dotsContainer = document.querySelector('.dots');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const gotoSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
      console.log('go to slide');
    });
  };
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;
    gotoSlide(currentSlide);
    activeDot(currentSlide);
  };
  const breviousSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;
    gotoSlide(currentSlide);
    activeDot(currentSlide);
  };
  const intialize = function () {
    createDots();
    gotoSlide(0);
    activeDot(0);
  };
  //slides events handler
  intialize();
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', breviousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') breviousSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      currentSlide = Number(slide);
      gotoSlide(slide);
      activeDot(slide);
    }
  });
};
slider();

//creating better version of the slider
// slides.forEach((s, i) => {
//   s.style.transform = `translateX(${100 * i}%)`;
// });
// btnRight.addEventListener('click', function () {
//   if (currentSlide === slideNumber - 1) currentSlide = 0;
//   else currentSlide++;
//   slides.forEach((s, i) => {
//     s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
//   });
// });

////////the old scoll of making the page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//the new way of implemeting the navigation
document.querySelector('.nav__links').addEventListener('click', function (el) {
  el.preventDefault();
  if (el.target.classList.contains('nav__link')) {
    const id = el.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//implementing the hover over the links
//1 add the not hover to all the nodes tha have class called not hoverd
//2 add the hover effect to the the target
//implementing the hover effevt in the bars link
//bad bractice way
// nav.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 0.5;
//       console.log(el.style.opacity);
//     });
//     logo.style.opacity = 0.5;
//   }
// });
// nav.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//       console.log(el.style.opacity);
//     });
//     logo.style.opacity = 1;
//   }
// });
const handler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      console.log(el.style.opacity);
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handler.bind(0.5));
nav.addEventListener('mouseout', handler.bind(1));

// Window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = 'message';
// });
//implementing the sticky position
////////////////////////////////
///////////////////////////////
//the end of the project
//get elementbytagname and the by classnam,e return html collection not as the queryselectorAll return node list
// console.log(document.getElementsByTagName('button'));
// //creating element and remove insert
// //creating element
// const message = document.createElement('div');
// const header = document.querySelector('.header');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'hello my name us ahmed and u an web dwvwelpwe<button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
// //deleat element
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     // message.parentElement.removeChild(message);
//     // message.remove();
//     message.parentElement.removeChild(message); //called node traveersale doesnot user anr more use instead .remove
//   });
//style and attribute
// message.style.background = 'orangered';
// console.log(getComputedStyle(message).height);
// message.style.height = parseFloat(getComputedStyle(message).height) + 30 + 'px';
// //custsemaize elements variable in the root and the root is the document in javasc(properrty)
// document.documentElement.style.setProperty('--color-primary', 'blue');
// //attribute in action
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// //non stsndard
// logo.setAttribute('developer', 'ahmed');
// console.log(logo.getAttribute('developer'));

// console.log(logo.getAttribute('src')); //get the realative path
// //data attribute
// console.log(logo.dataset.versionNumber);
// //classes
// logo.classList().add('any class');
// logo.classList().remove('any class');
// logo.classList().toggle('any class');
//(new) types of event and event handler
// document.querySelector('h1').addEventListener('mouseenter', function () {
//   document.querySelector('body').style.color = 'red';
//   ocument.querySelector('h1').r
// });
// const h1 = document.querySelector('h1');
// const alert = function (e) {
//   h1.style.color = 'red';
// };
// h1.addEventListener('mouseenter', alert);
// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alert);
// }, 3000);
// //implemetn the randome color
// const random = function (min, max) {
//   return Math.floor(Math.random() * max - min) + min;
// };
// console.log(random(10, 20));
// const randomColor = function () {
//   return `rgb(${(random(0, 255), random(0, 255), random(0, 255))})`;
// };
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.color = randomColor();
// });
//event propgation in practice
//

//event delegation
const h1 = document.querySelector('h1');

// Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log('child nodes', h1.childNodes);//
// console.log('childer', h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';
// Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';
