document.addEventListener("DOMContentLoaded", () => {

    const burger = document?.querySelector('[data-burger]');
    const menu = document?.querySelector('[data-menu]');
    const menuLinks = document?.querySelectorAll('[data-menu-link]');
    const body = document.querySelector('.body');

    const checkClass = () => {
        if (burger?.classList.contains('burger--active')) {
            burger?.setAttribute('aria-expanded', 'true');
            burger?.setAttribute('aria-label', 'закрыть меню');
        } else {
            burger?.setAttribute('aria-expanded', 'false');
            burger?.setAttribute('aria-label', 'открыть меню');
        }
    }

    burger?.addEventListener('click', (e) => {
        burger?.classList.toggle('burger--active');
        menu?.classList.toggle('header__content--active');
        body?.classList.toggle('body--active');
        checkClass();
    });

    menuLinks?.forEach(el => {
        el.addEventListener('click', () => {
            burger?.classList.remove('burger--active');
            menu.classList.remove('header__content--active');
            body?.classList.remove('body--active');
        });
    });


    // * calc
    if (document.querySelector(".js-calc-form")) {
        const calcForm = document.querySelector(".js-calc-form");
        const cityDeparture = document.querySelector(".js-departure");
        const cityDestination = document.querySelector(".js-destination");
        const jsCalcResultbody = document.querySelector('.js-calc-result-body');
        const costForm = document.querySelector('.js-cost');
        const toggle = document.querySelector('.js-toggle');
        const formatter = new Intl.NumberFormat("ru", { minimumFractionDigits: 0 });

        const price = 70;
        const volumes = {
            '90': 1,
            '115': 1.2,
        };

        const distances = {
            "Москва": {
                "Санкт-Петербург": 706,
                "Новосибирск": 3356,
                "Екатеринбург": 1797,
                "Казань": 810,
                "Нижний Новгород": 421,
                "Челябинск": 1776,
                "Красноярск": 4173,
                "Самара": 1054,
                "Уфа": 1345,
                "Ростов-на-Дону": 1074,
                "Омск": 2703,
                "Краснодар": 1342,
                "Воронеж": 515,
                "Пермь": 1442,
                "Волгоград": 970
            },
            "Санкт-Петербург": {
                "Москва": 706,
                "Новосибирск": 3937,
                "Екатеринбург": 2339,
                "Казань": 1513,
                "Нижний Новгород": 1126,
                "Челябинск": 2481,
                "Красноярск": 4722,
                "Самара": 1767,
                "Уфа": 2050,
                "Ростов-на-Дону": 1784,
                "Омск": 3285,
                "Краснодар": 2054,
                "Воронеж": 1227,
                "Пермь": 1984,
                "Волгоград": 1682
            },
            "Новосибирск": {
                "Москва": 3356,
                "Санкт-Петербург": 3937,
                "Екатеринбург": 1598,
                "Казань": 2538,
                "Нижний Новгород": 2942,
                "Челябинск": 1603,
                "Красноярск": 790,
                "Самара": 2482,
                "Уфа": 2032,
                "Ростов-на-Дону": 3745,
                "Омск": 651,
                "Краснодар": 3982,
                "Воронеж": 3316,
                "Пермь": 1958,
                "Волгоград": 3244
            },
            "Екатеринбург": {
                "Москва": 1797,
                "Санкт-Петербург": 2339,
                "Новосибирск": 1598,
                "Казань": 1068,
                "Нижний Новгород": 1336,
                "Челябинск": 206,
                "Красноярск": 2383,
                "Самара": 993,
                "Уфа": 543,
                "Ростов-на-Дону": 2257,
                "Омск": 946,
                "Краснодар": 2527,
                "Воронеж": 1863,
                "Пермь": 360,
                "Волгоград": 1790
            },
            "Казань": {
                "Москва": 810,
                "Санкт-Петербург": 1513,
                "Новосибирск": 2538,
                "Екатеринбург": 1068,
                "Нижний Новгород": 398,
                "Челябинск": 958,
                "Красноярск": 3323,
                "Самара": 372,
                "Уфа": 527,
                "Ростов-на-Дону": 1507,
                "Омск": 1886,
                "Краснодар": 1778,
                "Воронеж": 1078,
                "Пермь": 713,
                "Волгоград": 1039
            },
            "Нижний Новгород": {
                "Москва": 421,
                "Санкт-Петербург": 1126,
                "Новосибирск": 2942,
                "Екатеринбург": 1336,
                "Казань": 398,
                "Челябинск": 1362,
                "Красноярск": 3761,
                "Самара": 721,
                "Уфа": 931,
                "Ростов-на-Дону": 1274,
                "Омск": 2290,
                "Краснодар": 1542,
                "Воронеж": 742,
                "Пермь": 983,
                "Волгоград": 988
            },
            "Челябинск": {
                "Москва": 1776,
                "Санкт-Петербург": 2481,
                "Новосибирск": 1603,
                "Екатеринбург": 206,
                "Казань": 958,
                "Нижний Новгород": 1362,
                "Красноярск": 2388,
                "Самара": 867,
                "Уфа": 418,
                "Ростов-на-Дону": 2132,
                "Омск": 951,
                "Краснодар": 2402,
                "Воронеж": 1736,
                "Пермь": 563,
                "Волгоград": 1664
            },
            "Красноярск": {
                "Москва": 4173,
                "Санкт-Петербург": 4722,
                "Новосибирск": 790,
                "Екатеринбург": 2383,
                "Казань": 3323,
                "Нижний Новгород": 3761,
                "Челябинск": 2388,
                "Самара": 3267,
                "Уфа": 2817,
                "Ростов-на-Дону": 4530,
                "Омск": 1435,
                "Краснодар": 4767,
                "Воронеж": 4101,
                "Пермь": 2743,
                "Волгоград": 4029
            },
            "Самара": {
                "Москва": 1054,
                "Санкт-Петербург": 1767,
                "Новосибирск": 2482,
                "Екатеринбург": 993,
                "Казань": 372,
                "Нижний Новгород": 721,
                "Челябинск": 867,
                "Красноярск": 3267,
                "Уфа": 460,
                "Ростов-на-Дону": 1318,
                "Омск": 1830,
                "Краснодар": 1588,
                "Воронеж": 922,
                "Пермь": 899,
                "Волгоград": 849
            },
            "Уфа": {
                "Москва": 1345,
                "Санкт-Петербург": 2050,
                "Новосибирск": 2032,
                "Екатеринбург": 543,
                "Казань": 527,
                "Нижний Новгород": 931,
                "Челябинск": 418,
                "Красноярск": 2817,
                "Самара": 460,
                "Ростов-на-Дону": 1725,
                "Омск": 1380,
                "Краснодар": 1995,
                "Воронеж": 1329,
                "Пермь": 471,
                "Волгоград": 1256
            },
            "Ростов-на-Дону": {
                "Москва": 1074,
                "Санкт-Петербург": 1784,
                "Новосибирск": 3745,
                "Екатеринбург": 2257,
                "Казань": 1507,
                "Нижний Новгород": 1274,
                "Челябинск": 2132,
                "Красноярск": 4530,
                "Самара": 1318,
                "Уфа": 1725,
                "Омск": 3093,
                "Краснодар": 276,
                "Воронеж": 564,
                "Пермь": 2162,
                "Волгоград": 473
            },
            "Омск": {
                "Москва": 2703,
                "Санкт-Петербург": 3285,
                "Новосибирск": 651,
                "Екатеринбург": 946,
                "Казань": 1886,
                "Нижний Новгород": 2290,
                "Челябинск": 951,
                "Красноярск": 1435,
                "Самара": 1830,
                "Уфа": 1380,
                "Ростов-на-Дону": 3093,
                "Краснодар": 3330,
                "Воронеж": 2663,
                "Пермь": 1306,
                "Волгоград": 2591
            },
            "Краснодар": {
                "Москва": 1342,
                "Санкт-Петербург": 2054,
                "Новосибирск": 3982,
                "Екатеринбург": 2527,
                "Казань": 1778,
                "Нижний Новгород": 1542,
                "Челябинск": 2402,
                "Красноярск": 4767,
                "Самара": 1588,
                "Уфа": 1995,
                "Ростов-на-Дону": 276,
                "Омск": 3330,
                "Воронеж": 835,
                "Пермь": 2436,
                "Волгоград": 744
            },
            "Воронеж": {
                "Москва": 515,
                "Санкт-Петербург": 1227,
                "Новосибирск": 3316,
                "Екатеринбург": 1863,
                "Казань": 1078,
                "Нижний Новгород": 742,
                "Челябинск": 1736,
                "Красноярск": 4101,
                "Самара": 922,
                "Уфа": 1329,
                "Ростов-на-Дону": 564,
                "Омск": 2663,
                "Краснодар": 835,
                "Пермь": 1662,
                "Волгоград": 577
            },
            "Пермь": {
                "Москва": 1442,
                "Санкт-Петербург": 1984,
                "Новосибирск": 1958,
                "Екатеринбург": 360,
                "Казань": 713,
                "Нижний Новгород": 983,
                "Челябинск": 563,
                "Красноярск": 2743,
                "Самара": 899,
                "Уфа": 471,
                "Ростов-на-Дону": 2162,
                "Омск": 1306,
                "Краснодар": 2436,
                "Воронеж": 1662,
                "Волгоград": 1698
            },
            "Волгоград": {
                "Москва": 970,
                "Санкт-Петербург": 1682,
                "Новосибирск": 3244,
                "Екатеринбург": 1790,
                "Казань": 1039,
                "Нижний Новгород": 988,
                "Челябинск": 1664,
                "Красноярск": 4029,
                "Самара": 849,
                "Уфа": 1256,
                "Ростов-на-Дону": 473,
                "Омск": 2591,
                "Краснодар": 744,
                "Воронеж": 577,
                "Пермь": 1698
            }
        };

        calcForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const volumeForm = document.querySelector('.js-volume:checked')

            const distance = distances[cityDeparture.value][cityDestination.value] || false
            const volume = volumes[volumeForm.value] || 1;
            const back = toggle.classList.contains('active');
            const cost = Math.round(distance * volume * price) * (back ? 2 : 1);

            costForm.textContent = `${formatter.format(cost)} руб.`
            console.info(`Расстояние: ${distance} , объем: ${volume}`);
        });

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.target.classList.toggle('active')
        });
    }

    // * modal
    const modalClose = (modal) => {
        modal.querySelector('.modal__close').onclick = function () {
            modal.classList.remove('modal--active');
            body.classList.remove('body--active');
        };

        const modalContent = modal.querySelector('.modal__content');

        document.addEventListener('mousedown', (e) => {
            if (!modalContent.contains(e.target)) {
                modal.classList.remove('modal--active');
                body.classList.remove('body--active');
            }
        });
    }

    if (document.querySelector('.modal--call')) {
        const modalOpen = document.querySelectorAll('.modal-open');
        const modalCall = document.querySelector('.modal--call');

        modalOpen.forEach(item => {
            item.addEventListener('click', () => {
                modalCall.classList.add('modal--active')
                body.classList.add('body--active');
            })
        })

        modalClose(modalCall)
    }

    if (document.querySelector('.modal--calc')) {
        const openModalCalc = () => {
            const modalCalc = document.querySelector('.modal--calc');

            modalCalc.classList.add('modal--active')
            body.classList.add('body--active');

            modalClose(modalCalc)
        }

        // * Для вызова модального окна от калькулятора расскоментировать эту функцию
        openModalCalc();
    }

    // * scroll
    if (document.querySelectorAll('a[data-goto]')) {
        const menuLinks = document.querySelectorAll('a[data-goto]')

        if (menuLinks.length > 0) {

            menuLinks.forEach(menuLink => {
                menuLink.addEventListener('click', onMenuLinkClick);
            })

            function onMenuLinkClick(e) {
                const menuLink = e.target
                if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                    const gotoBlock = document.querySelector(menuLink.dataset.goto)
                    const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.header').offsetHeight

                    window.scrollTo({
                        top: gotoBlockValue,
                        behavior: "smooth"
                    })
                    e.preventDefault()
                }
            }
        }
    }

    // * swiper
    if (document.querySelector('.about__swiper')) {
        return new Swiper('.about__swiper', {
            loop: true,
            speed: 800,
            
            navigation: {
                nextEl: '.about__button--next',
                prevEl: '.about__button--prev',
            },

            pagination: {
                el: '.about__pagination',
                clickable: true,
            },

            breakpoints: {
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: true,
                },

                560: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },

                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
            },
        });
    }
})