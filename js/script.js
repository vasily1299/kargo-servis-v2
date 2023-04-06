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

    // * modal
    const modalClose = (modal, cbc) => {
        modal.querySelector('.modal__close').onclick = function () {
            modal.classList.remove('modal--active');
            body.classList.remove('body--active');
            typeof cbc === 'function' && cbc()
        };

        const modalContent = modal.querySelector('.modal__content');
        const onMouseDown = (e) => {
            if (!modalContent.contains(e.target)) {
                modal.classList.remove('modal--active');
                body.classList.remove('body--active');
                typeof cbc === 'function' && cbc()

                document.removeEventListener('mousedown', onMouseDown);
            }
        }

        document.addEventListener('mousedown', onMouseDown);
    }

    if (document.querySelector('.modal--call')) {
        const modalOpen = document.querySelectorAll('.modal-open');
        const modalCall = document.querySelector('.modal--call');

        modalOpen.forEach(item => {
            item.addEventListener('click', () => {
                modalCall.classList.add('modal--active')
                body.classList.add('body--active');

                modalClose(modalCall)
            })
        })
    }


    const openModalCalc = (cbc) => {
        const modalCalc = document.querySelector('.modal--calc');

        modalCalc.classList.add('modal--active')
        body.classList.add('body--active');

        modalClose(modalCalc, cbc)
    }

    // * Для вызова модального окна от калькулятора расскоментировать эту функцию
    /*openModalCalc();*/

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
        new Swiper('.about__swiper', {
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

    /****
     *
     *
     *
     * ***/
    const button = document.getElementById('js-calc-next')
    const steps = document.getElementsByClassName('calc__list')
    const volumes = document.getElementsByClassName('js-calc-volume')
    const services = document.getElementsByClassName('js-calc-service')
    const modalCalc = document.querySelector('.modal--calc')
    const modalFrom = document.getElementById('js-calc-modal-from')
    const modalTo = document.getElementById('js-calc-modal-to')
    const modalAmount = document.getElementById('js-calc-modal-amount')
    const modalDistance = document.getElementById('js-calc-modal-distance')
    const edit = document.getElementsByClassName('calc-way__info')
    const formatter = new Intl.NumberFormat("ru", {minimumFractionDigits: 0})
    const servicesVolumes = Array.from(services).concat(Array.from(volumes))
    const error = document.getElementById('js-calc-error')
    const volumePrices = {
        '90': 1,
        '110': 1.2,
        '115': 1.2,
    }
    const servicePrices = {
        '90': 1,
        '110': 1.2,
        'Коники': 1.15,
        'Рефрижератор': 1.3,
    }
    const price = 70
    let step = 1, fromData = null, toData = null, routeData = false;
    button.style.opacity = 0.7;

    const options = {
        results: 20,
        provider: {
            suggest(request, options) {
                delete options['provider'];
                return ymaps.suggest(request, options).then(items => {
                    let arrayResult = [];
                    let arrayPromises = [];
                    let founds = [];

                    function pushGeoData(displayName, value, jsonData) {
                        arrayResult.push({displayName: displayName, value: value, jsonData: jsonData});
                    }

                    items.forEach(i => {
                        arrayPromises.push(ymaps.geocode(i.value).then(gc => {
                            let displayName = "";
                            let value = i.value;
                            let geoObject = gc.geoObjects.get(0);

                            if (geoObject && !geoObject.getThoroughfare() && geoObject.getCountryCode() == "RU"
                                && geoObject.getLocalities().length) {
                                let jsonData = JSON.stringify({
                                    'city': geoObject.getLocalities()[0] || geoObject.getAdministrativeAreas()[0],
                                    'street': geoObject.getThoroughfare() || geoObject.getLocalities()[0],
                                    'house': geoObject.getPremiseNumber(),
                                });

                                value = value.replace(geoObject.getCountry() + ", ", "");
                                value = value.replace(geoObject.getAdministrativeAreas()[0] + ", ", "");
                                value = value.replace(geoObject.getThoroughfare() + ', ', '')


                                value = geoObject.getAdministrativeAreas()[0] + ', ' + geoObject.getLocalities()[0]
                                displayName = "<div class='yandex-map-address_info'>" + value + "</div>";
                                value = value.replace("undefined", "");
                                displayName = displayName.replace("undefined", "");

                                if(founds.indexOf(value) < 0) {
                                    pushGeoData(displayName, value, jsonData);
                                    founds.push(value)
                                }
                            }
                        }));
                    });

                    return Promise.all(arrayPromises).then(function () {
                        return ymaps.vow.resolve(arrayResult);
                    });
                });
            }
        }
    }
    const init = () => {
        const suggestFromView = new ymaps.SuggestView('departure', options)
        const suggestToView = new ymaps.SuggestView('destination', options)

        suggestFromView.events.add('select', (e) => {
            fromData = e.get('item').value
            pick()
        })
        suggestToView.events.add('select', (e) => {
            toData = e.get('item').value
            pick()
        })

    }
    const onChangeDeparture = (e) => {
        setTimeout(() => {
            e.target.value = fromData
            error.innerText = ''
        }, 150)
    }
    const onChangeDestination = (e) => {
        setTimeout(() => {
            e.target.value = toData
            error.innerText = ''
        }, 150)
    }

    document.getElementById('departure').addEventListener('change', onChangeDeparture)
    document.getElementById('destination').addEventListener('change', onChangeDestination)
    const pick = () => {
        if (fromData && toData) {
            (async () => {
                button.classList.add('js-loading')
                routeData = await router(fromData, toData)
                if(routeData.dist !== 0) {
                    button.style.opacity = '1'
                }
                button.classList.remove('js-loading')
            })()
        } else {
            button.style.opacity = 0.7;
        }
    }
    const router = async (from, to) => {
        return ymaps.route([from, to], {multiRoute: false, routingMode: "auto"})
            .then(r => {
                return {from: from, to: to, dist: r.getLength() / 1000}
            })
            .catch(e => {
                error.innerText = 'Ошибка при рассечете'
                console.log(e);
                return {from: from, to: to, dist: 0}
            });
    }
    const cbClose = () => {
        step = 1
        steps[0].classList.remove('calc__list--hidden')
        steps[1].classList.add('calc__list--hidden')
    }
    Array.from(edit).forEach(item => {
        item.onclick = () => {
            modalCalc.querySelector('.modal__close').onclick()
        }
    })


    button.addEventListener('click', (e) => {
        if(!fromData) {
            error.innerText = 'Выберите пункт отправки из списка'
        }else if(!toData) {
            error.innerText = 'Выберите пункт доставки из списка'
        }else if(!routeData.hasOwnProperty('dist') || routeData.dist === 0) {
            error.innerText = 'Ошибка при рассечете'
        }else{
            error.innerText = ''
        }
        if (step === 1 && fromData && toData && routeData.hasOwnProperty('dist')) {
            steps[0].classList.add('calc__list--hidden')
            steps[1].classList.remove('calc__list--hidden')
            step++
        } else if (step === 2) {
            const volumeForm = document.querySelector('.js-calc-volume:checked')
            const serviceForm = document.querySelector('.js-calc-service:checked')
            const volume = volumePrices[volumeForm?.value] || 1;
            const service = servicePrices[serviceForm?.value] || 1;
            const distance = Math.round(routeData.dist)
            const cost = Math.round(distance * volume * service * price)

            modalAmount.textContent = `${formatter.format(cost)}`
            modalFrom.textContent = fromData
            modalTo.textContent = toData
            modalDistance.textContent = distance.toString()

            const result = `Откуда: ${fromData} , куда: ${toData}. Расстояние: ${distance} , услуга: ${volumeForm?.value||serviceForm?.value} , цена ${formatter.format(cost)}`
            console.info(result);
            document.getElementById('js-calc-result').value = result
            openModalCalc(cbClose)
        }
        e.preventDefault()
    })
    servicesVolumes.forEach(volume => {
        volume.addEventListener('change', (e) => {
            if (e.target.checked) {
                servicesVolumes.forEach(elm => {
                    if (elm.checked && elm !== e.target) {
                        elm.checked = false
                    }
                })
            }
        });
    })

    ymaps.ready(init);

    /**
     *
     *
     * */
    $.validator.methods.tel = function( value, element ) {
        return this.optional( element ) || value.replace(/[^0-9]/g,'').length === 11
    }
    Array.from(document.getElementsByClassName('form')).forEach(form => {
        const button = form.querySelector('button[type=submit]')
        const inputs = Array.from(form.querySelectorAll('input, textarea'))

        const checkValid = () => {
            const valid = inputs.every(item => item.checkValidity() && $(item).valid())
            if(valid === false || !$(form).validate().checkForm()){
                button.disabled = true
                button.classList.add('disabled')
            }else{
                button.disabled = false
                button.classList.remove('disabled')
            }
        }

        $(form).validate({
            onfocusin: checkValid,
            onkeyup: checkValid,
            onclick: checkValid,
            rules: {
                name: {
                    required: true,
                    minlength: 2,
                },
                phone: {
                    required: true,
                    tel: true,
                },
                email: {
                    required: true,
                    email: true,
                },
                agree: "required"
            },
            messages: {
                name: {
                    required: "Введите свое имя",
                    minlength: $.validator.format("Введите {0} символа"),
                },
                phone: "",
                email: {
                    required: "Введите свою почту",
                    email: "Неправильно введен адрес почты",
                },
                agree: ""
            },
        })
        checkValid()
    })

    $(function(){
        $("input[name=tel]").mask("+7 (999) 999-99-99");
        $("input[name=phone]").mask("+7 (999) 999-99-99");
    });
})
async function submitForm(event) {
    event.preventDefault(); // отключаем перезагрузку/перенаправление страницы
    try {
        // Формируем запрос
        const response = await fetch(event.target.action, {
            method: 'POST',
            body: new FormData(event.target)
        });
        // проверяем, что ответ есть
        if (!response.ok) throw (`Ошибка при обращении к серверу: ${response.status}`);
        // проверяем, что ответ действительно JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw ('Ошибка обработки. Ответ не JSON');
        }
        // обрабатываем запрос
        const json = await response.json();
        if (json.result === "success") {
            // в случае успеха
            alert(json.info);
        } else {
            // в случае ошибки
            console.log(json);
            throw (json.info);
        }
    } catch (error) { // обработка ошибки
        alert(error);
    }
}
