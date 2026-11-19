/* ============================================================
   ДШР — дистанционный тест аттестации
   ============================================================ */
(function () {
  'use strict';

  const CONFIG = {
    /* URL веб-приложения Google Apps Script (…/exec).
       Пока пусто: результат показывается, но не отправляется. */
    endpoint: 'https://script.google.com/macros/s/AKfycbyrtK9FmVi6vbo6ez7nyZBxx703WsHf9xcD0xAJBerDPKhIOouFd8jyDSFHahZ7zDjj/exec',
    total: 30,
    durationMin: 35,
    questionSec: 70,
    passScore: 25,
    passPercent: 83
  };

  const TOPICS = {
    svu: { name: 'СВУ' },
    firstAid: { name: 'Первая помощь' },
    negotiations: { name: 'Переговоры' },
    assault: { name: 'Штурм' },
    prohibitions: { name: 'Запреты главы 4' }
  };

  /* ---------------- Банк вопросов ---------------- */
  const BANK = [
    /* --- СВУ --- */
    {
      id: 'svu-01', topic: 'svu',
      q: 'Что такое самодельное взрывное устройство (СВУ)?',
      options: [
        'Устройство, изготовленное в кустарных условиях — без разрешения и фиксированных правил производства',
        'Только взрывное устройство заводского производства с маркировкой',
        'Любой предмет, в котором есть аккумулятор и провода',
        'Учебный макет, не способный создать взрыв'
      ],
      answer: 0,
      explain: 'СВУ — самодельное взрывное устройство, изготовленное в кустарных условиях: без соответствующего разрешения и фиксированных правил производства. Оно может выглядеть как угодно и собираться из любых доступных материалов.'
    },
    {
      id: 'svu-02', topic: 'svu',
      q: 'На какое расстояние нужно прогнать людей при обнаружении СВУ?',
      options: [
        'На 15–50 метров',
        'На 1–2 метра',
        'На 100–200 метров',
        'Отводить людей не требуется'
      ],
      answer: 0,
      explain: 'Первое действие — прогнать всех от СВУ на 15–50 метров, затем достать и активировать генератор радиопомех. При механическом виде генератор не достают.'
    },
    {
      id: 'svu-03', topic: 'svu',
      q: 'Что делают сразу после того, как прогнали людей от обнаруженного СВУ?',
      options: [
        'Достают, активируют и вешают на разгрузку генератор радиопомех',
        'Открывают СВУ и определяют вид',
        'Перекусывают все провода подряд',
        'Отходят на 30 метров и ложатся'
      ],
      answer: 0,
      explain: 'После удаления людей на 15–50 метров достают, активируют и вешают на разгрузку генератор радиопомех. Если СВУ механического вида, генератор не достают.'
    },
    {
      id: 'svu-04', topic: 'svu',
      q: 'Какой признак указывает на дистанционный вид СВУ?',
      options: [
        'Внутри обнаружен приёмник сигнала: телефон, рация, антенна или пейджер',
        'Снаружи находится только нажимная плита',
        'Внутри находятся только механические шестерни',
        'Устройство собрано в прозрачном корпусе'
      ],
      answer: 0,
      explain: 'Признак дистанционного вида — приёмник информации внутри: телефон, антенна, рация, пейджер. Подрыв происходит по сигналу или по истечении заданного времени.'
    },
    {
      id: 'svu-05', topic: 'svu',
      q: 'Что делать, если провода залиты металлом и найти нужный невозможно?',
      options: [
        'Извлечь детонатор или часть заряда вместе с детонатором',
        'Перекусить все провода подряд',
        'Залить устройство водой',
        'Оставить устройство и уйти'
      ],
      answer: 0,
      explain: 'Если провода залиты металлом или свинцом и определить нужный провод невозможно — извлекают сам детонатор либо часть заряда с детонатором.'
    },
    {
      id: 'svu-06', topic: 'svu',
      q: 'В каком кейсе транспортируют компоненты СВУ на полигон или в лабораторию?',
      options: [
        'В бронированном кейсе с песком',
        'В обычном тканевом мешке',
        'В кейсе, заполненном водой',
        'В пластиковом контейнере без крышки'
      ],
      answer: 0,
      explain: 'Для транспортировки используют бронированный кейс, при необходимости — с песком: песок поглощает радиацию и лучше фиксирует компоненты устройства.'
    },
    {
      id: 'svu-07', topic: 'svu',
      q: 'Что строго запрещено при обезвреживании пояса смертника?',
      options: [
        'Обезвреживать СВУ на теле человека',
        'Снимать пояс после обесточивания',
        'Успокаивать человека в сознании',
        'Использовать генератор радиопомех'
      ],
      answer: 0,
      explain: 'Обезвреживать СВУ на теле человека строго запрещено. Исключение — повреждения, которые мешают снять пояс или причинят больший ущерб.'
    },
    {
      id: 'svu-08', topic: 'svu',
      q: 'Что не относится к СВУ?',
      options: [
        'Заводская противотанковая мина, используемая по назначению',
        'Кустарно изготовленная мина с нажимной плитой',
        'Пояс смертника с электропроводами',
        'Растяжка на основе гранаты'
      ],
      answer: 0,
      explain: 'К СВУ не относятся С4, противопехотные и противотанковые мины и другие законные взрывные устройства заводского производства, если они используются по назначению и не являются компонентом СВУ.'
    },
    {
      id: 'svu-09', topic: 'svu',
      q: 'На какое расстояние отходят при контролируемом подрыве СВУ?',
      options: [
        'На 30 метров и ложатся ногами к СВУ',
        'На 5 метров и стоят в полный рост',
        'На 100 метров и наблюдают из машины',
        'Отходить не нужно, достаточно укрытия в 2 метрах'
      ],
      answer: 0,
      explain: 'При контролируемом подрыве отходят на тридцать метров и ложатся ногами к СВУ. Расстояние 50 метров используется при выдёргивании мин крюком.'
    },
    {
      id: 'svu-10', topic: 'svu',
      q: 'Почему пластид сам по себе не опасен?',
      options: [
        'Без взрывателя детонации не будет',
        'Он не содержит взрывчатых веществ',
        'Он срабатывает только при нагреве',
        'Он всегда покрыт защитной оболочкой'
      ],
      answer: 0,
      explain: 'Сами по себе ПВВ не опасны: без взрывателя детонации не будет. Задача — обезвредить и эвакуировать пластид, а не уничтожить его.'
    },

    /* --- Первая помощь --- */
    {
      id: 'fa-01', topic: 'firstAid',
      q: 'С чего начинается алгоритм первой помощи?',
      options: [
        'С обеспечения собственной безопасности и осмотра обстановки',
        'С вызова скорой помощи',
        'С непрямого массажа сердца',
        'С наложения жгута'
      ],
      answer: 0,
      explain: 'Сначала обеспечивают безопасность себе и осматривают обстановку, затем — безопасность пострадавшего, оценка состояния, вызов специалистов и неотложная помощь.'
    },
    {
      id: 'fa-02', topic: 'firstAid',
      q: 'В каком соотношении выполняются искусственная вентиляция лёгких и непрямой массаж сердца?',
      options: ['2 вдоха — 30 нажатий', '5 вдохов — 5 нажатий', '1 вдох — 10 нажатий', '10 вдохов — 10 нажатий'],
      answer: 0,
      explain: 'Соотношение — 2 к 30: два вдоха и тридцать нажатий. Мероприятия проводятся параллельно.'
    },
    {
      id: 'fa-03', topic: 'firstAid',
      q: 'Какова частота сжатий при непрямом массаже сердца?',
      options: ['80–100 в минуту', '20–30 в минуту', '150–180 в минуту', '40–50 в минуту'],
      answer: 0,
      explain: 'Частота сжатий — 80–100 в минуту, грудина прогибается примерно на треть (около 5 см у взрослого).'
    },
    {
      id: 'fa-04', topic: 'firstAid',
      q: 'Куда выполняют толчки при приёме Геймлиха?',
      options: [
        'В область живота между пупком и грудиной — внутрь и вверх',
        'В середину грудной клетки, только вниз',
        'В правое подреберье',
        'В область шеи'
      ],
      answer: 0,
      explain: 'Встать сзади, обхватить, надавливать кулаком в область живота между пупком и грудиной резкими толчками внутрь и вверх. Беременным и тучным — толчки в нижнюю часть грудной клетки.'
    },
    {
      id: 'fa-05', topic: 'firstAid',
      q: 'Каково максимальное время наложения жгута?',
      options: [
        'Летом — 60 минут, зимой — 30 минут',
        'Летом — 2 часа, зимой — 1 час',
        'Круглый год — 3 часа',
        'Круглый год — 10 минут'
      ],
      answer: 0,
      explain: 'Максимальное время: летом — 60 минут, зимой — 30 минут. Если время вышло, жгут ослабляют и сдавливают заново, поделив норматив на 2: летом 30 минут, зимой 15.'
    },
    {
      id: 'fa-06', topic: 'firstAid',
      q: 'Какое средство применяют при венозном кровотечении?',
      options: [
        'Давящую повязку (тампонад)',
        'Жгут на 2 часа',
        'Только холод',
        'Только антисептик'
      ],
      answer: 0,
      explain: 'При венозном кровотечении накладывают давящую повязку: стерильная салфетка → плотный слой ваты → стерильная салфетка, всё плотно завязать.'
    },
    {
      id: 'fa-07', topic: 'firstAid',
      q: 'Куда вводят адреналин при анафилактическом шоке?',
      options: [
        'Внутримышечно в переднюю верхнюю треть бедра',
        'Внутривенно в кисть',
        'Под язык в виде таблетки',
        'В плечо подкожно'
      ],
      answer: 0,
      explain: 'При наличии адреналина и подготовки его вводят внутримышечно в переднюю верхнюю треть бедра.'
    },
    {
      id: 'fa-08', topic: 'firstAid',
      q: 'Сколько времени охлаждают ожог прохладной проточной водой?',
      options: ['15–20 минут', '1–2 минуты', '40–60 минут', 'Не охлаждают вовсе'],
      answer: 0,
      explain: 'Ожог охлаждают прохладной проточной водой 15–20 минут. При химическом ожоге руки промывают не менее 40 минут.'
    },
    {
      id: 'fa-09', topic: 'firstAid',
      q: 'Что запрещено при отморожении?',
      options: [
        'Растирать снегом и быстро согревать грелками',
        'Уходить с холода в тёплое помещение',
        'Накладывать согревающую повязку',
        'Давать горячий чай'
      ],
      answer: 0,
      explain: 'Запрещено быстро согревать обмороженные места грелками, горячим душем, ванной или у огня, растирать снегом, употреблять алкоголь и натирать обмороженные места жиром.'
    },
    {
      id: 'fa-10', topic: 'firstAid',
      q: 'Что категорически нельзя делать при открытом переломе?',
      options: [
        'Вправлять кость и трогать место перелома',
        'Накладывать шину',
        'Обрабатывать края раны антисептиком',
        'Накрывать рану стерильной салфеткой'
      ],
      answer: 0,
      explain: 'При открытом переломе ни в коем случае нельзя вправлять кость и трогать место перелома. Нужно остановить кровотечение, обработать края раны, наложить салфетку и шину.'
    },

    /* --- Переговоры --- */
    {
      id: 'neg-01', topic: 'negotiations',
      q: 'За сколько метров останавливается охрана переговорщика?',
      options: ['За 30 метров', 'За 5 метров', 'За 100 метров', 'Охрана идёт рядом с переговорщиком'],
      answer: 0,
      explain: 'За 30 метров до захватчиков охрана останавливается, дальше переговорщик подходит один.'
    },
    {
      id: 'neg-02', topic: 'negotiations',
      q: 'На каком расстоянии переговорщик предупреждает, что он переговорщик?',
      options: ['На 10 метрах', 'На 50 метрах', 'Вплотную к захватчикам', 'Уже у машины'],
      answer: 0,
      explain: 'Переговорщик медленно подходит и на расстоянии 10 метров предупреждает: «Я государственный переговорщик. Мы готовы выслушать ваши требования. Оружия у меня нет…»'
    },
    {
      id: 'neg-03', topic: 'negotiations',
      q: 'Что обязательно снять до начала переговоров?',
      options: [
        'Шевроны, погоны и отличительные знаки',
        'Только головной убор',
        'Только бронежилет',
        'Ничего снимать не нужно'
      ],
      answer: 0,
      explain: 'Перед переговорами снимают все шевроны, погоны и отличительные знаки, складывают оружие и устройства, надевают маску и белую повязку на предплечье.'
    },
    {
      id: 'neg-04', topic: 'negotiations',
      q: 'Какой вопрос входит в обязательный список при переговорах?',
      options: [
        'Есть ли СВУ на заложнике',
        'Сколько стоит выкуп',
        'Кто из преступников главный по званию',
        'Какой марки автомобиль у охраны'
      ],
      answer: 0,
      explain: 'Обязательно уточняют количество заложников, их состояние, что будет после выполнения требований, наличие СВУ на заложнике и на территории, время на выполнение и разрешение идти к оперштабу.'
    },
    {
      id: 'neg-05', topic: 'negotiations',
      q: 'Что запрещено, если преступники предлагают пройти и посмотреть на заложника?',
      options: [
        'Идти за ними',
        'Задавать вопросы о состоянии заложника',
        'Требовать показать заложника из окна',
        'Уточнять требования'
      ],
      answer: 0,
      explain: 'Идти за захватчиками запрещено. Исключение — угроза жизни заложнику.'
    },
    {
      id: 'neg-06', topic: 'negotiations',
      q: 'Когда переговорщику разрешено снять маску?',
      options: [
        'Если захватчик ведёт себя агрессивно и начинает угрожать',
        'В любой момент по своему желанию',
        'После первого вопроса о требованиях',
        'Когда заложники освобождены'
      ],
      answer: 0,
      explain: 'Снимать маску запрещено. Исключение: захватчик ведёт себя агрессивно и начинает угрожать.'
    },
    {
      id: 'neg-07', topic: 'negotiations',
      q: 'Какое правило относится к негласным правилам переговоров?',
      options: [
        'Никогда не говори «никогда» и строй предложения в позитивной форме',
        'Требуй немедленного выполнения всех требований',
        'Оценивай личность преступника и указывай на его ошибки',
        'Демонстрируй силу во время разговора'
      ],
      answer: 0,
      explain: 'Негласное правило: никогда не говори «никогда». Предложения строят в позитивной форме, без фраз «нет, не могу», «это невозможно», «нельзя выполнить это требование».'
    },
    {
      id: 'neg-08', topic: 'negotiations',
      q: 'Кого в первую очередь стараются вывести при передаче выкупа?',
      options: [
        'Женщин, детей и пожилых людей',
        'Только иностранных граждан',
        'Только сотрудников организации',
        'Только раненых преступников'
      ],
      answer: 0,
      explain: 'При передаче выкупа в первую очередь пытаются «вытянуть» женщин, детей и пожилых людей.'
    },
    {
      id: 'neg-09', topic: 'negotiations',
      q: 'Как передают выкуп преступникам?',
      options: ['Через пол', 'Из рук в руки', 'Подбрасывают вверх', 'Оставляют в машине'],
      answer: 0,
      explain: 'Выкуп передают через пол. Если преступники хотят сначала пересчитать деньги — им дают такую возможность.'
    },
    {
      id: 'neg-10', topic: 'negotiations',
      q: 'Что начинается, если преступники забрали выкуп и не отдают заложников?',
      options: ['Штурм', 'Повторные переговоры', 'Выплата второго выкупа', 'Отвод сотрудников'],
      answer: 0,
      explain: 'Если выкуп забран, а заложников не отдают — начинается штурм.'
    },

    /* --- Штурм --- */
    {
      id: 'asm-01', topic: 'assault',
      q: 'Что такое штурм?',
      options: [
        'Решительная атака укреплённой позиции противника и активные действия по достижению цели',
        'Только блокирование здания без входа внутрь',
        'Только переговоры с преступниками',
        'Отход группы с занимаемых позиций'
      ],
      answer: 0,
      explain: 'Штурм — решительная атака крепости, укреплённой позиции противника, а также активные действия, направленные на достижение цели путём преодоления трудностей.'
    },
    {
      id: 'asm-02', topic: 'assault',
      q: 'На что направлен армейский штурм?',
      options: [
        'На уничтожение противника без учёта наличия заложников',
        'На сохранение жизни заложников и задержание преступника',
        'На минимальный расход боеприпасов',
        'На отход без контакта'
      ],
      answer: 0,
      explain: 'Армейский штурм использует лёгкое, среднее и тяжёлое вооружение, отличается повышенным расходом боеприпасов, проводится без учёта заложников и направлен на уничтожение противника.'
    },
    {
      id: 'asm-03', topic: 'assault',
      q: 'Какое условие делает штурм необходимым?',
      options: [
        'Требования преступников невыполнимы',
        'Преступники согласились на переговоры',
        'Заложники не выдвигают требований',
        'Прошло менее часа с момента захвата'
      ],
      answer: 0,
      explain: 'Штурм проводится, если заложнику угрожает опасность, требования невыполнимы или захватчики убили переговорщика либо нанесли тяжкий вред его здоровью.'
    },
    {
      id: 'asm-04', topic: 'assault',
      q: 'Как действует основная (штурмовая) группа?',
      options: [
        'Делится на группы по 2–3 человека и работает по принципу «первый идёт — второй прикрывает»',
        'Действует только в одиночку',
        'Всегда штурмует только через крышу',
        'Отвечает только за охрану освобождённых позиций'
      ],
      answer: 0,
      explain: 'Основная группа разбивается на группы по 2–3 человека, непосредственно штурмует объект, участники страхуют друг друга и работают по принципу «первый идёт — второй прикрывает».'
    },
    {
      id: 'asm-05', topic: 'assault',
      q: 'Какую часть участников штурма составляет резерв?',
      options: [
        'Треть участников штурма',
        'Одного человека',
        'Половину участников',
        'Резерв не предусмотрен'
      ],
      answer: 0,
      explain: 'Резерв — треть участников штурма: обезвреживает СВУ, оказывает первую помощь, подкрепляет группы; разведка также относится к резерву.'
    },
    {
      id: 'asm-06', topic: 'assault',
      q: 'При каких условиях применяется тактика «Крючок»?',
      options: [
        'При короткоствольном оружии и достаточной ширине двери',
        'При любой ширине двери и длинноствольном оружии',
        'Только когда помещение последнее',
        'Только при штурме с крыши'
      ],
      answer: 0,
      explain: '«Крючок» применяется при короткоствольном оружии и достаточной ширине двери. Недостаток — двое в узком проёме одновременно не пройдут.'
    },
    {
      id: 'asm-07', topic: 'assault',
      q: 'Какая тактика не зависит от ширины двери?',
      options: ['«Крест»', '«Крючок»', '«Угол»', '«Квартира»'],
      answer: 0,
      explain: 'В тактике «Крест» ширина двери не важна: сотрудники входят один за другим, почти одновременно пересекая проём по диагонали.'
    },
    {
      id: 'asm-08', topic: 'assault',
      q: 'Кто выбирает вариант тактики «Угол»?',
      options: [
        'Боец №1, который входит первым',
        'Командир группы до выдвижения',
        'Боец №2, замыкающий',
        'Вариант выбирается случайно'
      ],
      answer: 0,
      explain: 'В тактике «Угол» возможны два варианта — выбор делает №1, который входит первым, №2 подстраивается.'
    },
    {
      id: 'asm-09', topic: 'assault',
      q: 'Сколько бойцов минимум участвует в мобильном штурме автомобиля?',
      options: [
        'Шесть: четыре штурмующих и два вспомогательных',
        'Двое: водитель и стрелок',
        'Десять: восемь штурмующих и два снайпера',
        'Четыре: только штурмующие'
      ],
      answer: 0,
      explain: 'Обычно штурм выполняется силами как минимум шести бойцов: четыре штурмующих и два вспомогательных участника, которые помогают проникнуть в машину и извлечь преступников или заложников.'
    },
    {
      id: 'asm-10', topic: 'assault',
      q: 'Что нужно сделать прежде, чем помогать заложникам выбраться из машины?',
      options: [
        'Вытащить из салона или уничтожить преступников',
        'Открыть дверь и помочь заложнику выйти',
        'Отойти на 50 метров',
        'Начать переговоры'
      ],
      answer: 0,
      explain: 'Прежде чем помогать выбраться из машины заложникам, необходимо вытащить из салона или уничтожить преступников.'
    },

    /* --- Запреты главы 4 --- */
    {
      id: 'prh-01', topic: 'prohibitions',
      q: 'Что запрещено пунктом 4.1?',
      options: [
        'Нарушать ОУГ, кодексы, законы и федеральные законы',
        'Носить форму не по размеру',
        'Пользоваться служебным транспортом',
        'Обращаться к командиру по званию'
      ],
      answer: 0,
      explain: 'Пункт 4.1: запрещено нарушать Общий устав государственных организаций (ОУГ), кодексы, законы, федеральные законы.'
    },
    {
      id: 'prh-02', topic: 'prohibitions',
      q: 'Что считается дезертирством (п. 4.2)?',
      options: [
        'Самовольное оставление части или места службы в целях уклонения от военной службы',
        'Опоздание на службу на 15 минут',
        'Отсутствие на службе более 7 дней',
        'Отказ от ношения военной формы'
      ],
      answer: 0,
      explain: 'Пункт 4.2: дезертирство — самовольное оставление части или места службы в целях уклонения от прохождения военной службы, а равно неявка в тех же целях на службу.'
    },
    {
      id: 'prh-03', topic: 'prohibitions',
      q: 'С какого срока отсутствие на месте службы без уважительных причин становится грубым проступком (п. 4.4)?',
      options: [
        'Более семи (7) дней подряд',
        'Более трёх дней подряд',
        'Более 14 дней подряд',
        'Более 30 дней подряд'
      ],
      answer: 0,
      explain: 'Пункт 4.4: отсутствие военнослужащего на месте военной службы без уважительных причин более семи (7) дней подряд.'
    },
    {
      id: 'prh-04', topic: 'prohibitions',
      q: 'Что запрещено делать с военным имуществом (п. 4.7)?',
      options: [
        'Умышленно уничтожать, повреждать, портить, незаконно расходовать (красть) или использовать',
        'Ремонтировать по приказу командира',
        'Сдавать на склад по накладной',
        'Маркировать согласно уставу'
      ],
      answer: 0,
      explain: 'Пункт 4.7: умышленные уничтожение, повреждение, порча, незаконное расходование (кража) или использование военного имущества.'
    },
    {
      id: 'prh-05', topic: 'prohibitions',
      q: 'Что относится к нарушению правил обращения с оружием и боеприпасами (п. 4.9)?',
      options: [
        'Обращение, создающее повышенную опасность для окружающих',
        'Ношение оружия в штатной кобуре',
        'Чистка оружия по расписанию',
        'Сдача оружия на хранение'
      ],
      answer: 0,
      explain: 'Пункт 4.9: нарушение правил обращения с оружием, боеприпасами или иными веществами и предметами, представляющими повышенную опасность для окружающих.'
    },
    {
      id: 'prh-06', topic: 'prohibitions',
      q: 'Что запрещено командиру пунктом 4.12?',
      options: [
        'Не принимать мер по проступку подчинённого и скрывать информацию о нём',
        'Докладывать о проступке вышестоящему командиру',
        'Привлекать подчинённого к дисциплинарной ответственности',
        'Проводить разбирательство по факту проступка'
      ],
      answer: 0,
      explain: 'Пункт 4.12: командир обязан предупреждать и пресекать проступки подчинённых, привлекать их к ответственности и устранять причины проступков. Непринятие мер и сокрытие информации — грубый проступок.'
    },
    {
      id: 'prh-07', topic: 'prohibitions',
      q: 'Раскрытие чего является грубым дисциплинарным проступком (п. 4.14)?',
      options: [
        'Служебной тайны',
        'Личных данных сослуживца',
        'Расписания дежурств',
        'Номера воинской части'
      ],
      answer: 0,
      explain: 'Пункт 4.14: раскрытие служебной тайны.'
    },
    {
      id: 'prh-08', topic: 'prohibitions',
      q: 'Что запрещено предоставлять СМИ и распространять в Интернете (п. 4.15)?',
      options: [
        'Информацию о военнослужащих, их местонахождении и деятельности, связанной со службой',
        'Прогноз погоды',
        'Общедоступные новости региона',
        'Собственные стихи и рисунки'
      ],
      answer: 0,
      explain: 'Пункт 4.15: запрещено распространять информацию, позволяющую определить принадлежность военнослужащих к Вооружённым Силам, их место нахождения, а также сведения о деятельности и дислокации органов военного управления.'
    },
    {
      id: 'prh-09', topic: 'prohibitions',
      q: 'Какие устройства запрещено иметь при себе при исполнении обязанностей военной службы (п. 4.16)?',
      options: [
        'Электронные изделия бытового назначения для хранения и передачи аудио, фото, видео и геолокации',
        'Механические наручные часы',
        'Бумажный блокнот и карандаш',
        'Карманный фонарик'
      ],
      answer: 0,
      explain: 'Пункт 4.16: запрещены электронные изделия (приборы, технические средства) бытового назначения, в которых могут храниться или которые позволяют распространять аудио-, фото-, видеоматериалы и данные геолокации.'
    },
    {
      id: 'prh-10', topic: 'prohibitions',
      q: 'Что прямо запрещено пунктом 4.21?',
      options: [
        'Врать руководящему и начальствующему составам части',
        'Уточнять приказ у командира',
        'Докладывать о неисправности техники',
        'Просить разъяснений по службе'
      ],
      answer: 0,
      explain: 'Пункт 4.21: строго запрещается врать руководящему и начальствующему составам части.'
    }
  ];

  /* ---------------- Утилиты ---------------- */
  const app = document.getElementById('testApp');
  if (!app) return;

  const STORE = 'dshr-test-draft-v6';
  const byId = {};
  BANK.forEach(q => { byId[q.id] = q; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }

  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); }
      catch (err) { reject(err); }
      finally { ta.remove(); }
    });
  }

  /* ---------------- Состояние ---------------- */
  let state = null;
  let timerId = null;

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || !d.candidate || !Array.isArray(d.items) || !d.items.length) return null;
      return d;
    } catch (e) {
      return null;
    }
  }

  function saveDraft() {
    if (!state || state.submitted) return;
    const items = state.items.map(it => ({
      id: it.id,
      options: it.options,
      answer: it.answer,
      chosen: it.chosen
    }));
    try {
      localStorage.setItem(STORE, JSON.stringify({
        candidate: state.candidate,
        items: items,
        current: state.current,
        startedAt: state.startedAt,
        remaining: state.remaining,
        questionStartedAt: state.questionStartedAt,
        questionLimit: state.questionLimit,
        resultId: state.resultId
      }));
    } catch (e) { /* приватный режим — просто не сохраняем */ }
  }

  function clearDraft() {
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
  }

  /* Оставшееся время считается по моменту старта: закрытие вкладки не ставит таймер на паузу. */
  function remainingForDraft(draft) {
    const total = CONFIG.durationMin * 60;
    const elapsed = draft.startedAt ? Math.floor((Date.now() - draft.startedAt) / 1000) : 0;
    const byClock = total - Math.max(0, elapsed);
    const saved = typeof draft.remaining === 'number' ? draft.remaining : byClock;
    return Math.max(0, Math.min(saved, byClock));
  }

  /* ---------------- Проверка попытки ---------------- */
  function checkAttempt(candidate) {
    if (!CONFIG.endpoint) return Promise.resolve({ ok: true, allowed: true });

    const body = {
      action: 'check',
      staticId: candidate.staticId,
      nickname: candidate.nickname,
      checkId: 'check-' + Date.now()
    };

    return fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    }).then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).catch(() => {
      /* Резервный канал, если POST заблокирован браузером. */
      const url = CONFIG.endpoint +
        '?action=check&staticId=' + encodeURIComponent(candidate.staticId) +
        '&nickname=' + encodeURIComponent(candidate.nickname) +
        '&t=' + Date.now();
      return fetch(url, { method: 'GET', redirect: 'follow', cache: 'no-store' })
        .then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        });
    }).then(data => {
      if (!data || data.ok !== true || typeof data.allowed !== 'boolean') {
        const err = new Error((data && (data.message || data.error)) || 'bad response');
        /* Старая версия Apps Script не знает про action=check. */
        if (data && (data.error === 'empty or invalid payload id' || data.service === 'dshr-test-results')) {
          err.code = 'not_configured';
        }
        throw err;
      }
      return data;
    });
  }

  function checkFailHtml(err) {
    if (err && err.code === 'not_configured') {
      return '<strong>Проверка попыток не настроена.</strong> Пройти тест сейчас нельзя: командиру нужно развернуть новую версию Apps Script.';
    }
    return '<strong>Не удалось проверить попытки.</strong> Проверьте подключение к интернету и попробуйте снова. Начать тест без проверки нельзя.';
  }

  function blockedHtml(data) {
    let html = '<strong>Тест уже пройден.</strong> Повторная попытка возможна только с разрешения командира.';
    const prev = data && data.previous;
    if (prev && prev.total) {
      const when = prev.date ? new Date(prev.date) : null;
      const whenStr = when && !isNaN(when.getTime()) ? when.toLocaleString('ru-RU') : '';
      html += '<span>Предыдущая попытка: ' + prev.score + ' из ' + prev.total +
        (prev.passed ? ' (сдано)' : ' (не сдано)') +
        (whenStr ? ' · ' + whenStr : '') + '.</span>';
    }
    return html;
  }

  function setAttemptNotice(html, kind) {
    const box = document.getElementById('testAttempt');
    if (!box) return;
    if (!html) {
      box.hidden = true;
      box.className = 'test-attempt';
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.className = 'test-attempt test-attempt-' + (kind || 'warn');
    box.innerHTML = html;
    if (box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setBusy(btn, busy, label) {
    if (!btn) return;
    if (busy) {
      btn.dataset.idleLabel = btn.textContent;
      btn.textContent = label || 'Подождите…';
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.idleLabel || btn.textContent;
      btn.disabled = false;
    }
  }

  function setTestingMode(on) {
    document.body.classList.toggle('is-testing', !!on);
    if (on) {
      const overlay = document.getElementById('overlay');
      if (overlay) overlay.hidden = true;
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
      const menuBtn = document.getElementById('menuBtn');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  /* ---------------- Стартовый экран ---------------- */
  function renderStart(draft) {
    stopTimer();
    setTestingMode(false);
    state = null;

    let resume = '';
    if (draft) {
      const answered = draft.items.filter(it => it.chosen !== null && it.chosen !== undefined).length;
      resume =
        '<div class="test-resume">' +
          '<div>' +
            '<strong>Найден незавершённый тест</strong>' +
            '<p>Кандидат: ' + esc(draft.candidate.nickname) + ' · ' + esc(draft.candidate.staticId) +
            '. Отвечено ' + answered + ' из ' + draft.items.length + '. Осталось ' + fmtTime(remainingForDraft(draft)) + '.</p>' +
          '</div>' +
          '<div class="test-resume-actions">' +
            '<button type="button" class="btn btn-primary" id="testResume">Продолжить</button>' +
            '<button type="button" class="btn" id="testDiscard">Начать заново</button>' +
          '</div>' +
        '</div>';
    }

    app.innerHTML =
      '<div class="test-shell">' +
        '<div class="test-intro">' +
          '<div class="test-intro-main">' +
            '<h2 class="test-block-title">Перед началом</h2>' +
            '<p>Тест состоит из 30 случайных вопросов из общего банка (50 вопросов). Вопросы и варианты ответов перемешиваются полностью, без деления по темам. На каждый вопрос даётся 1 минута 10 секунд, на весь тест — 35 минут. Проходной балл — 25 из 30 (83%).</p>' +
            '<div class="callout callout-info"><div><strong>Одна попытка.</strong> Повторное прохождение открывается только командиром.</div></div>' +
            '<div class="callout callout-warn"><div><strong>Режим теста.</strong> Ответ нельзя изменить, к пройденному вопросу нельзя вернуться. Переключение вкладки или окна и переходы по сайту завершают тест.</div></div>' +
            (CONFIG.endpoint ? '' : '<div class="callout callout-warn"><div><strong>Отправка ещё не подключена.</strong> В конце теста результат нужно будет скопировать и передать командиру вручную.</div></div>') +
            '<div class="test-rules">' +
              '<div class="test-rule"><span class="test-rule-num">30</span><span>вопросов</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">70</span><span>секунд на ответ</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">35</span><span>минут всего</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">25</span><span>проходной балл</span></div>' +
            '</div>' +
            '<div class="test-topics">' +
              '<span class="badge">СВУ</span>' +
              '<span class="badge">Первая помощь</span>' +
              '<span class="badge">Переговоры</span>' +
              '<span class="badge">Штурм</span>' +
              '<span class="badge">Запреты главы 4</span>' +
            '</div>' +
            '<p class="muted small">Вопросы составлены по материалам сайта. Черновик сохраняется, но таймер не останавливается. Возврат к вопросам и изменение ответов запрещены.</p>' +
          '</div>' +
          '<div class="test-intro-side">' +
            '<h2 class="test-block-title">Данные кандидата</h2>' +
            '<form class="test-form" id="testForm" novalidate>' +
              '<div class="test-attempt" id="testAttempt" role="status" hidden></div>' +
              '<label class="test-field">' +
                '<span>Никнейм</span>' +
                '<input type="text" id="testNick" maxlength="60" autocomplete="nickname" placeholder="Например, Romerik_Banhammer" required>' +
              '</label>' +
              '<label class="test-field">' +
                '<span>Статик-ID</span>' +
                '<input type="text" id="testStatic" maxlength="30" inputmode="numeric" autocomplete="off" placeholder="Номер статика" required>' +
              '</label>' +
              '<label class="test-field">' +
                '<span>Подразделение</span>' +
                '<input type="text" id="testUnit" maxlength="60" autocomplete="organization" placeholder="Подразделение или должность" required>' +
              '</label>' +
              '<p class="test-form-error" id="testFormError" role="alert"></p>' +
              '<button type="submit" class="btn btn-primary test-start-btn">Начать тест</button>' +
              '<p class="muted small">Нажимая «Начать тест», вы подтверждаете, что выполняете его самостоятельно.</p>' +
            '</form>' +
          '</div>' +
        '</div>' +
        resume +
      '</div>';

    const form = document.getElementById('testForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nickname = document.getElementById('testNick').value.trim();
      const staticId = document.getElementById('testStatic').value.trim();
      const unit = document.getElementById('testUnit').value.trim();
      const err = document.getElementById('testFormError');
      const btn = form.querySelector('.test-start-btn');

      if (nickname.length < 2) { err.textContent = 'Укажите никнейм (минимум 2 символа).'; return; }
      if (staticId.length < 1) { err.textContent = 'Укажите статик-ID.'; return; }
      if (unit.length < 2) { err.textContent = 'Укажите подразделение.'; return; }

      err.textContent = '';
      setAttemptNotice('');
      setBusy(btn, true, 'Проверяем…');

      checkAttempt({ nickname: nickname, staticId: staticId }).then(data => {
        if (data.allowed) {
          startTest({ nickname: nickname, staticId: staticId, unit: unit });
          return;
        }
        setBusy(btn, false);
        setAttemptNotice(blockedHtml(data), 'warn');
      }).catch(err => {
        setBusy(btn, false);
        setAttemptNotice(checkFailHtml(err), 'bad');
      });
    });

    if (draft) {
      document.getElementById('testResume').addEventListener('click', () => {
        const btn = document.getElementById('testResume');
        setBusy(btn, true, 'Проверяем…');
        checkAttempt(draft.candidate).then(data => {
          if (data.allowed) { resumeTest(draft); return; }
          setBusy(btn, false);
          setAttemptNotice(blockedHtml(data), 'warn');
          toast('Тест уже пройден');
        }).catch(err => {
          setBusy(btn, false);
          setAttemptNotice(checkFailHtml(err), 'bad');
          toast('Проверка не пройдена');
        });
      });
      document.getElementById('testDiscard').addEventListener('click', () => {
        clearDraft();
        renderStart(null);
        toast('Черновик удалён');
      });
    }
  }

  /* ---------------- Запуск и выбор вопросов ---------------- */
  function buildItems(source) {
    return source.map(saved => {
      const base = byId[saved.id];
      if (!base) return null;
      return {
        id: base.id,
        topic: base.topic,
        q: base.q,
        options: saved.options,
        answer: saved.answer,
        explain: base.explain,
        chosen: (saved.chosen === null || saved.chosen === undefined) ? null : saved.chosen
      };
    }).filter(Boolean);
  }

  function startTest(candidate) {
    const picked = shuffle(BANK)
      .slice(0, Math.min(CONFIG.total, BANK.length))
      .map(q => {
        const opts = q.options.map((text, i) => ({ text: text, ok: i === q.answer }));
        const mixed = shuffle(opts);
        return {
          id: q.id,
          topic: q.topic,
          q: q.q,
          options: mixed.map(o => o.text),
          answer: mixed.findIndex(o => o.ok),
          explain: q.explain,
          chosen: null
        };
      });

    const now = Date.now();
    state = {
      candidate: candidate,
      items: picked,
      current: 0,
      startedAt: now,
      remaining: CONFIG.durationMin * 60,
      questionStartedAt: now,
      questionLimit: CONFIG.questionSec,
      questionRemaining: CONFIG.questionSec,
      resultId: makeId(),
      submitted: false,
      confirming: false,
      awayHandled: false,
      result: null
    };
    setTestingMode(true);
    saveDraft();
    renderTest();
    startTimer();
  }

  function resumeTest(draft) {
    const items = buildItems(draft.items);
    const expected = Math.min(CONFIG.total, BANK.length);
    if (items.length !== draft.items.length || items.length !== expected) {
      clearDraft();
      renderStart(null);
      toast('Черновик повреждён, начните тест заново');
      return;
    }

    const now = Date.now();
    const remaining = remainingForDraft(draft);
    const questionStartedAt = draft.questionStartedAt || now;
    const questionLimit = Math.min(Number(draft.questionLimit) || CONFIG.questionSec, remaining);
    const questionElapsed = Math.max(0, Math.floor((now - questionStartedAt) / 1000));

    state = {
      candidate: draft.candidate,
      items: items,
      current: Math.min(Math.max(0, draft.current || 0), items.length - 1),
      startedAt: draft.startedAt || now,
      remaining: remaining,
      questionStartedAt: questionStartedAt,
      questionLimit: questionLimit,
      questionRemaining: Math.max(0, questionLimit - questionElapsed),
      resultId: draft.resultId || makeId(),
      submitted: false,
      confirming: false,
      awayHandled: false,
      result: null
    };
    setTestingMode(true);
    renderTest();
    startTimer();
    if (state.remaining <= 0) { submitTest(true, 'time'); return; }
    if (state.questionRemaining <= 0) { handleQuestionTimeout(); }
  }

  /* ---------------- Таймер ---------------- */
  function startTimer() {
    stopTimer();
    updateTimerUI();
    timerId = setInterval(() => {
      if (!state || state.submitted) { stopTimer(); return; }

      const elapsedTotal = Math.floor((Date.now() - state.startedAt) / 1000);
      state.remaining = Math.max(0, CONFIG.durationMin * 60 - elapsedTotal);

      const elapsedQuestion = Math.floor((Date.now() - state.questionStartedAt) / 1000);
      state.questionRemaining = Math.max(0, state.questionLimit - elapsedQuestion);

      if (state.remaining % 5 === 0) saveDraft();
      updateTimerUI();

      if (state.remaining <= 0) { submitTest(true, 'time'); return; }
      if (state.questionRemaining <= 0) { handleQuestionTimeout(); }
    }, 1000);
  }

  function handleQuestionTimeout() {
    if (!state || state.submitted) return;
    if (state.current >= state.items.length - 1) {
      submitTest(true, 'question-timeout');
      return;
    }
    toast('Время на вопрос истекло');
    goTo(state.current + 1);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function updateTimerUI() {
    if (!state || state.submitted) return;

    const el = document.getElementById('testTimer');
    if (el) {
      el.innerHTML = fmtTime(state.remaining) + '<small>на тест</small>';
      el.classList.toggle('is-low', state.remaining <= 300);
      el.classList.toggle('is-critical', state.remaining <= 60);
    }

    const qEl = document.getElementById('testQuestionTimer');
    if (qEl) {
      qEl.innerHTML = fmtTime(state.questionRemaining) + '<small>на вопрос</small>';
      qEl.classList.toggle('is-low', state.questionRemaining <= 30);
      qEl.classList.toggle('is-critical', state.questionRemaining <= 10);
    }
  }

  /* ---------------- Экран теста ---------------- */
  function renderTest() {
    const c = state.candidate;
    app.innerHTML =
      '<div class="test-shell">' +
        '<div class="test-hud">' +
          '<div class="test-hud-person">' +
            '<span class="test-hud-label">Кандидат</span>' +
            '<strong>' + esc(c.nickname) + '</strong>' +
            '<span class="test-hud-sub">' + esc(c.unit) + ' · ' + esc(c.staticId) + '</span>' +
          '</div>' +
          '<div class="test-hud-timer" id="testTimer">' + fmtTime(state.remaining) + '<small>на тест</small></div>' +
          '<div class="test-hud-progress">' +
            '<span><strong id="testAnswered">0</strong> / ' + state.items.length + '</span>' +
            '<small>отвечено</small>' +
          '</div>' +
        '</div>' +
        '<div class="test-layout">' +
          '<div class="test-main">' +
            '<div id="testQuestion"></div>' +
            '<div class="test-controls">' +
              '<button type="button" class="btn" id="testNext">Далее →</button>' +
              '<button type="button" class="btn btn-primary" id="testFinish">Завершить тест</button>' +
            '</div>' +
          '</div>' +
          '<aside class="test-side">' +
            '<p class="test-side-title">Навигация</p>' +
            '<div class="test-nav" id="testNav"></div>' +
            '<div class="test-legend">' +
              '<span><i class="test-dot answered"></i> отвечен</span>' +
              '<span><i class="test-dot current"></i> текущий</span>' +
              '<span><i class="test-dot"></i> без ответа</span>' +
            '</div>' +
            '<p class="test-side-note">Движение только вперёд: вернуться к пройденному вопросу нельзя. Неотвеченные вопросы при завершении считаются ошибками.</p>' +
          '</aside>' +
        '</div>' +
      '</div>';

    document.getElementById('testNext').addEventListener('click', () => goTo(state.current + 1));
    document.getElementById('testFinish').addEventListener('click', finishWithConfirm);

    document.getElementById('testQuestion').addEventListener('click', e => {
      const btn = e.target.closest('.test-opt');
      if (!btn || btn.disabled) return;
      const item = state.items[state.current];
      if (item.chosen !== null) return;
      item.chosen = Number(btn.dataset.opt);
      saveDraft();
      renderQuestion();
      renderNav();
      updateAnswered();
      toast('Ответ зафиксирован');
    });

    document.getElementById('testNav').addEventListener('click', e => {
      const btn = e.target.closest('.test-nav-btn');
      if (!btn || btn.disabled) return;
      goTo(Number(btn.dataset.go));
    });

    renderQuestion();
    renderNav();
    updateAnswered();
    updateTimerUI();
  }

  function renderQuestion() {
    const box = document.getElementById('testQuestion');
    if (!box || !state) return;
    const item = state.items[state.current];
    const locked = item.chosen !== null;

    const options = item.options.map((text, i) => {
      const on = item.chosen === i;
      return '<button type="button" class="test-opt' + (on ? ' chosen' : '') + '" data-opt="' + i + '" aria-pressed="' + on + '"' +
        (locked ? ' disabled' : '') + '>' +
        '<span class="test-opt-key">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="test-opt-text">' + esc(text) + '</span>' +
        '<span class="test-opt-mark" aria-hidden="true">' + (on ? '✓' : '') + '</span>' +
      '</button>';
    }).join('');

    box.innerHTML =
      '<article class="test-question">' +
        '<div class="test-q-top">' +
          '<span class="badge badge-accent">' + esc(TOPICS[item.topic].name) + '</span>' +
          '<span class="test-q-meta">' +
            '<span class="test-q-count">Вопрос ' + (state.current + 1) + ' из ' + state.items.length + '</span>' +
            '<span class="test-q-timer" id="testQuestionTimer">' + fmtTime(state.questionRemaining) + '<small>на вопрос</small></span>' +
          '</span>' +
        '</div>' +
        '<h2 class="test-q-text">' + esc(item.q) + '</h2>' +
        '<div class="test-options' + (locked ? ' is-locked' : '') + '">' + options + '</div>' +
        (locked ? '<p class="test-answer-lock">Ответ зафиксирован. Изменить его нельзя.</p>' : '') +
      '</article>';

    const next = document.getElementById('testNext');
    if (next) next.disabled = state.current === state.items.length - 1;
  }

  function renderNav() {
    const nav = document.getElementById('testNav');
    if (!nav) return;
    nav.innerHTML = state.items.map((it, i) => {
      let cls = 'test-nav-btn';
      if (i === state.current) cls += ' current';
      else if (it.chosen !== null) cls += ' answered';
      if (i !== state.current) cls += ' locked';
      return '<button type="button" class="' + cls + '" data-go="' + i + '" aria-label="Вопрос ' + (i + 1) + '"' +
        (i === state.current ? ' aria-current="true"' : ' disabled') + '>' + (i + 1) + '</button>';
    }).join('');
  }

  function updateAnswered() {
    const el = document.getElementById('testAnswered');
    if (el) el.textContent = state.items.filter(it => it.chosen !== null).length;
  }

  function goTo(index) {
    if (!state || index !== state.current + 1 || index >= state.items.length) return;
    state.current = index;
    state.questionStartedAt = Date.now();
    state.questionLimit = Math.min(CONFIG.questionSec, state.remaining);
    state.questionRemaining = state.questionLimit;
    saveDraft();
    renderQuestion();
    renderNav();
    const card = document.querySelector('.test-question');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function finishWithConfirm() {
    if (!state || state.submitted) return;
    const left = state.items.filter(it => it.chosen === null).length;
    const msg = left
      ? 'Без ответа осталось вопросов: ' + left + '. Они будут засчитаны как ошибки. Завершить тест?'
      : 'Все вопросы отвечены. Завершить тест и отправить результат?';

    /* Пока открыт системный диалог, окно может потерять фокус — не считаем это уходом со страницы. */
    state.confirming = true;
    let ok = false;
    try { ok = window.confirm(msg); } finally { state.confirming = false; }
    if (ok) submitTest(false, 'manual');
  }

  /* ---------------- Завершение и результат ---------------- */
  function submitTest(auto, reason) {
    if (!state || state.submitted) return;
    state.submitted = true;
    stopTimer();

    const termination = reason || (auto ? 'time' : 'manual');
    const finishedAt = Date.now();
    const elapsed = Math.min(CONFIG.durationMin * 60, Math.round((finishedAt - state.startedAt) / 1000));
    const answers = state.items.map(it => ({
      id: it.id,
      topic: it.topic,
      question: it.q,
      chosen: it.chosen === null ? null : it.options[it.chosen],
      correct: it.options[it.answer],
      isCorrect: it.chosen === it.answer
    }));

    const score = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    const percent = total ? Math.round(score / total * 100) : 0;
    const topics = {};
    Object.keys(TOPICS).forEach(key => {
      const inTopic = answers.filter(a => a.topic === key);
      topics[key] = {
        name: TOPICS[key].name,
        correct: inTopic.filter(a => a.isCorrect).length,
        total: inTopic.length
      };
    });

    const result = {
      id: state.resultId,
      nickname: state.candidate.nickname,
      staticId: state.candidate.staticId,
      unit: state.candidate.unit,
      score: score,
      total: total,
      percent: percent,
      passed: score >= CONFIG.passScore,
      passScore: CONFIG.passScore,
      startedAt: new Date(state.startedAt).toISOString(),
      finishedAt: new Date(finishedAt).toISOString(),
      durationSec: elapsed,
      autoSubmitted: !!auto,
      termination: termination,
      topics: topics,
      answers: answers
    };

    state.result = result;
    clearDraft();
    renderResult(result, auto, termination);
    sendResult(result);
  }

  function renderResult(result, auto, reason) {
    setTestingMode(false);
    /* В разбор попадают только вопросы, на которые кандидат дал ответ. */
    const wrong = result.answers.filter(a => !a.isCorrect && a.chosen !== null);
    const unanswered = result.answers.filter(a => a.chosen === null).length;
    const when = new Date(result.finishedAt);
    const dateStr = when.toLocaleString('ru-RU');
    const mins = Math.floor(result.durationSec / 60);
    const secs = result.durationSec % 60;

    const endNote = reason === 'tab-switch'
      ? ' · тест завершён из-за переключения вкладки'
      : reason === 'question-timeout'
        ? ' · время на последний вопрос истекло'
        : reason === 'time'
          ? ' · время теста истекло'
          : '';

    const topicRows = Object.keys(result.topics).map(key => {
      const t = result.topics[key];
      const pct = t.total ? Math.round(t.correct / t.total * 100) : 0;
      return '<div class="test-topic-row">' +
        '<span>' + esc(t.name) + '</span>' +
        '<span class="test-topic-bar"><i style="width:' + pct + '%"></i></span>' +
        '<strong>' + t.correct + ' / ' + t.total + '</strong>' +
      '</div>';
    }).join('');

    const review = wrong.length
      ? '<h2 class="test-block-title">Разбор ошибок</h2>' +
        '<div class="test-review">' +
          wrong.map(a => {
            return '<div class="test-review-item">' +
              '<p class="test-review-q">' + esc(a.question) + '</p>' +
              '<p class="test-review-line bad"><span>Ваш ответ:</span> ' + esc(a.chosen) + '</p>' +
              '<p class="test-review-line good"><span>Правильно:</span> ' + esc(a.correct) + '</p>' +
              '<p class="test-review-explain">' + esc(byId[a.id] ? byId[a.id].explain : '') + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
        (unanswered
          ? '<p class="muted small">Без ответа осталось вопросов: ' + unanswered + ' — они засчитаны как ошибки и в разбор не входят.</p>'
          : '')
      : unanswered
        ? '<h2 class="test-block-title">Разбор ошибок</h2>' +
          '<div class="test-perfect">Ошибочных ответов нет. Без ответа осталось вопросов: ' + unanswered + ' — они засчитаны как ошибки.</div>'
        : '<div class="test-perfect">Все ответы верные — ошибок нет.</div>';

    app.innerHTML =
      '<div class="test-shell">' +
        '<div class="test-result ' + (result.passed ? 'is-pass' : 'is-fail') + '">' +
          '<span class="eyebrow">' + (result.passed ? 'Аттестация сдана' : 'Аттестация не сдана') + '</span>' +
          '<div class="test-score">' +
            '<strong>' + result.score + '</strong>' +
            '<span>/ ' + result.total + '</span>' +
          '</div>' +
          '<p class="test-score-line">' + result.percent + '% · проходной балл ' + result.passScore + ' из ' + result.total + '</p>' +
          '<p class="test-candidate">' + esc(result.nickname) + ' · ' + esc(result.staticId) + ' · ' + esc(result.unit) + '</p>' +
          '<p class="muted small">' + esc(dateStr) + ' · затрачено ' + mins + ' мин ' + secs + ' сек' + endNote + '</p>' +
          (reason === 'tab-switch' ? '<div class="callout callout-danger test-result-alert"><div><strong>Тест завершён автоматически.</strong> Во время прохождения была переключена вкладка или окно.</div></div>' : '') +
          '<div id="testDelivery" class="test-delivery"></div>' +
        '</div>' +

        '<div class="test-result-grid">' +
          '<div class="test-result-card">' +
            '<h2 class="test-block-title">Результат по темам</h2>' +
            '<div class="test-topic-list">' + topicRows + '</div>' +
          '</div>' +
          '<div class="test-result-card test-result-actions">' +
            '<h2 class="test-block-title">Действия</h2>' +
            '<p class="muted small">Скопируйте результат, если нужно передать его вручную. Повторная попытка — только с разрешения командира.</p>' +
            '<button type="button" class="btn" id="testCopy">Скопировать результат</button>' +
            '<button type="button" class="btn" id="testAgain">К форме теста</button>' +
            '<a class="btn btn-ghost" href="#/attestation">Вернуться к аттестации</a>' +
          '</div>' +
        '</div>' +

        review +
      '</div>';

    document.getElementById('testCopy').addEventListener('click', () => {
      copyText(resultToText(result))
        .then(() => toast('Результат скопирован'))
        .catch(() => toast('Не удалось скопировать'));
    });

    document.getElementById('testAgain').addEventListener('click', () => {
      state = null;
      renderStart(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function resultToText(r) {
    const lines = [];
    lines.push('ДШР — тест аттестации');
    lines.push('Кандидат: ' + r.nickname);
    lines.push('Статик-ID: ' + r.staticId);
    lines.push('Подразделение: ' + r.unit);
    lines.push('Результат: ' + r.score + ' из ' + r.total + ' (' + r.percent + '%)');
    lines.push('Статус: ' + (r.passed ? 'СДАНО' : 'НЕ СДАНО'));
    if (r.termination && r.termination !== 'manual') {
      lines.push('Завершение: ' + (
        r.termination === 'tab-switch' ? 'переключение вкладки' :
        r.termination === 'question-timeout' ? 'время на вопрос' : 'время теста'
      ));
    }
    lines.push('Дата: ' + new Date(r.finishedAt).toLocaleString('ru-RU'));
    lines.push('ID результата: ' + r.id);
    lines.push('');
    Object.keys(r.topics).forEach(key => {
      const t = r.topics[key];
      lines.push(t.name + ': ' + t.correct + ' / ' + t.total);
    });
    const wrong = r.answers.filter(a => !a.isCorrect && a.chosen !== null);
    const unanswered = r.answers.filter(a => a.chosen === null).length;
    if (wrong.length) {
      lines.push('');
      lines.push('Ошибки:');
      wrong.forEach((a, i) => {
        lines.push((i + 1) + '. ' + a.question);
        lines.push('   Ваш ответ: ' + a.chosen);
        lines.push('   Правильно: ' + a.correct);
      });
    }
    if (unanswered) {
      lines.push('');
      lines.push('Без ответа: ' + unanswered + ' (засчитаны как ошибки)');
    }
    return lines.join('\n');
  }

  /* ---------------- Отправка результата ---------------- */
  function setDelivery(html) {
    const box = document.getElementById('testDelivery');
    if (box) box.innerHTML = html;
  }

  function sendResult(result) {
    if (!CONFIG.endpoint) {
      setDelivery('<span class="test-send test-send-warn">Результат не отправлен: приёмник ещё не настроен. Скопируйте результат и передайте командиру.</span>');
      return;
    }

    setDelivery('<span class="test-send test-send-wait">Отправляем результат…</span>');

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(result),
      redirect: 'follow'
    }).then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(data => {
      if (data && data.ok === false) {
        if (data.error === 'already_attempted') {
          setDelivery('<span class="test-send test-send-bad">Результат не принят: этот кандидат уже проходил тест. Повторная попытка — только с разрешения командира.</span>');
        } else {
          setDelivery('<span class="test-send test-send-bad">Результат не принят. Скопируйте его и передайте командиру.</span>');
        }
        return;
      }
      setDelivery('<span class="test-send test-send-ok">Результат отправлен командиру.</span>');
    }).catch(() => {
      sendViaForm(result);
    });
  }

  /* Резервный канал для случая, когда fetch блокируется CORS. */
  function sendViaForm(result) {
    const frameName = 'testSendFrame';
    let frame = document.getElementById(frameName);
    if (!frame) {
      frame = document.createElement('iframe');
      frame.name = frameName;
      frame.id = frameName;
      frame.style.display = 'none';
      frame.title = 'Отправка результата';
      document.body.appendChild(frame);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CONFIG.endpoint;
    form.target = frameName;
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payload';
    input.value = JSON.stringify(result);
    form.appendChild(input);
    document.body.appendChild(form);

    try {
      form.submit();
      setDelivery('<span class="test-send test-send-ok">Результат передан. Если строка не появилась в таблице, скопируйте результат и передайте вручную.</span>');
    } catch (e) {
      setDelivery('<span class="test-send test-send-bad">Не удалось отправить результат. Скопируйте его и передайте командиру.</span>');
    }

    setTimeout(() => form.remove(), 2000);
  }

  /* ---------------- Запрет ухода со страницы ---------------- */
  function handleAway() {
    if (!state || state.submitted || state.confirming || state.awayHandled) return;
    state.awayHandled = true;
    submitTest(true, 'tab-switch');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) handleAway();
  });
  window.addEventListener('blur', handleAway);

  function blockTestNavigation(e) {
    if (!state || state.submitted) return;
    const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    toast('Во время теста переходы по сайту запрещены');
  }

  document.addEventListener('click', blockTestNavigation, true);
  document.addEventListener('auxclick', blockTestNavigation, true);
  document.addEventListener('contextmenu', e => {
    if (state && !state.submitted) {
      e.preventDefault();
      toast('Контекстное меню во время теста недоступно');
    }
  }, true);

  window.addEventListener('hashchange', () => {
    if (state && !state.submitted && location.hash !== '#/test') {
      location.hash = '#/test';
      toast('Во время теста переходы по сайту запрещены');
    }
  });

  /* ---------------- Предупреждение о закрытии ---------------- */
  window.addEventListener('beforeunload', e => {
    if (state && !state.submitted) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  /* ---------------- Инициализация ---------------- */
  renderStart(loadDraft());
})();
