/* ============================================================
   ДШР — дистанционный тест аттестации
   ============================================================ */
(function () {
  'use strict';

  const CONFIG = {
    /* URL веб-приложения Google Apps Script (…/exec).
       Пока пусто: результат показывается, но не отправляется. */
    endpoint: 'https://script.google.com/macros/s/AKfycbz55obag8nH0dUV9ECRXznedL7wJZrMUrRSC_uptifjql-HUL2pOysNqjfwiOlELlg/exec',
    total: 30,
    durationMin: 45,
    passScore: 24,
    passPercent: 80,
    perTopic: 6
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
        'Устройство, изготовленное в кустарных условиях, состоящее из взрывчатого вещества и горючих составов',
        'Только штатный армейский боеприпас промышленного производства',
        'Устройство, которое обязательно управляется по радио',
        'Учебный макет, не содержащий взрывчатых веществ'
      ],
      answer: 0,
      explain: 'СВУ — устройство кустарного изготовления из взрывчатого вещества (в том числе с имитационными и пиротехническими средствами) и горючих составов. К СВУ также относятся промышленные и военные устройства с элементами кустарного изготовления.'
    },
    {
      id: 'svu-02', topic: 'svu',
      q: 'Что необходимо сделать перед осмотром взрывного устройства?',
      options: [
        'Установить генератор радиопомех',
        'Сразу перекусить найденный провод',
        'Поместить устройство в бронированный кейс',
        'Попросить гражданских осмотреть устройство'
      ],
      answer: 0,
      explain: 'Порядок обезвреживания: безопасность, подавление связи генератором радиопомех, осмотр устройства, затем обезвреживание.'
    },
    {
      id: 'svu-03', topic: 'svu',
      q: 'Каким инструментом ищут нужный провод в устройстве?',
      options: [
        'Индикаторной (инжекторной) отвёрткой',
        'Сапёрной лопатой',
        'Пультом детонатора',
        'Бронированным кейсом'
      ],
      answer: 0,
      explain: 'Нужный провод находят индикаторной (инжекторной) отвёрткой, после чего перекусывают его кусачками.'
    },
    {
      id: 'svu-04', topic: 'svu',
      q: 'Чем перекусывают найденный провод?',
      options: ['Кусачками', 'Отвёрткой', 'Ножом', 'Струбциной'],
      answer: 0,
      explain: 'В наборе сапёра для этого предусмотрены кусачки: провод перекусывают, после чего СВУ считается обесточенным.'
    },
    {
      id: 'svu-05', topic: 'svu',
      q: 'Какой кейс используется для компонентов химического СВУ?',
      options: [
        'Бронированный кейс с песком',
        'Обычный тканевый мешок',
        'Кейс, полностью заполненный водой',
        'Кейс с химическим реагентом'
      ],
      answer: 0,
      explain: 'При химическом типе используют бронированный кейс с песком: песок поглощает радиацию и лучше фиксирует компоненты устройства.'
    },
    {
      id: 'svu-06', topic: 'svu',
      q: 'Что такое ингибиторы химических реакций?',
      options: [
        'Вещества, при которых скорость реакции уменьшается или реакция прекращается',
        'Вещества, которые ускоряют реакцию в несколько раз',
        'Газообразные продукты горения',
        'Радиоактивные изотопы'
      ],
      answer: 0,
      explain: 'Ингибиторы замедляют цепные и каталитические реакции — скорость реакции уменьшается или она прекращается.'
    },
    {
      id: 'svu-07', topic: 'svu',
      q: 'Что используют при обезвреживании электромеханического типа СВУ?',
      options: [
        'Генератор ЭМИ',
        'Генератор радиопомех',
        'Химическую защиту',
        'Кейс с песком'
      ],
      answer: 0,
      explain: 'При электромеханическом типе сначала применяют генератор ЭМИ, чтобы уничтожить электромагнитные поля, и только затем работают с проводами.'
    },
    {
      id: 'svu-08', topic: 'svu',
      q: 'Что строго запрещено при обезвреживании пояса смертника?',
      options: [
        'Обезвреживать СВУ на теле человека',
        'Снимать пояс после обесточивания',
        'Проверять пояс на растяжки',
        'Вывозить гражданских на безопасное расстояние'
      ],
      answer: 0,
      explain: 'Обезвреживать СВУ на теле человека строго запрещено. Исключение — повреждения, которые мешают снять пояс или причинят больший ущерб.'
    },
    {
      id: 'svu-09', topic: 'svu',
      q: 'На какое расстояние отходят при контролируемом подрыве СВУ на полигоне?',
      options: ['На 30 метров', 'На 5 метров', 'На 10 метров', 'На 100 метров'],
      answer: 0,
      explain: 'При контролируемом подрыве отходят на тридцать метров и ложатся ногами к СВУ. Расстояние 50 метров используется при выдёргивании мин крюком.'
    },
    {
      id: 'svu-10', topic: 'svu',
      q: 'Для чего предназначено устройство «Ингибитор-1М»?',
      options: [
        'Для локализации взрыва и снижения разрушений',
        'Для дистанционного подрыва СВУ',
        'Для поиска проводников в устройстве',
        'Для нейтрализации химических реагентов'
      ],
      answer: 0,
      explain: '«Ингибитор-1М» — устройство локализации взрыва: снижает выделяемую энергию, уменьшает разрушения и риск пожаров. Эффективен для СВУ массой до 1 кг в тротиловом эквиваленте.'
    },

    /* --- Первая помощь --- */
    {
      id: 'fa-01', topic: 'firstAid',
      q: 'С чего начинается алгоритм первой помощи?',
      options: [
        'С обеспечения безопасности себе и осмотра обстановки',
        'С вызова скорой помощи',
        'С непрямого массажа сердца',
        'С наложения жгута'
      ],
      answer: 0,
      explain: 'Сначала обеспечивают безопасность себе и осматривают обстановку, затем — безопасность пострадавшего, оценка состояния, вызов специалистов и неотложная помощь.'
    },
    {
      id: 'fa-02', topic: 'firstAid',
      q: 'Как проверяют дыхание пострадавшего?',
      options: [
        'Запрокидывают голову и наклоняются ко рту или носу, пытаясь услышать или почувствовать дыхание',
        'Надавливают на грудную клетку',
        'Измеряют температуру тела',
        'Дают понюхать нашатырный спирт'
      ],
      answer: 0,
      explain: 'Для проверки дыхания запрокидывают голову пострадавшего и наклоняются к его рту или носу, пытаясь услышать или почувствовать дыхание.'
    },
    {
      id: 'fa-03', topic: 'firstAid',
      q: 'В каком соотношении выполняются искусственная вентиляция лёгких и непрямой массаж сердца?',
      options: ['2 вдоха — 30 нажатий', '5 вдохов — 5 нажатий', '1 вдох — 10 нажатий', '10 вдохов — 10 нажатий'],
      answer: 0,
      explain: 'Соотношение — 2 к 30: два вдоха и тридцать нажатий. Мероприятия проводятся параллельно.'
    },
    {
      id: 'fa-04', topic: 'firstAid',
      q: 'Какова частота сжатий при непрямом массаже сердца?',
      options: ['80–100 в минуту', '20–30 в минуту', '150–180 в минуту', '40–50 в минуту'],
      answer: 0,
      explain: 'Частота сжатий — 80–100 в минуту, грудина прогибается примерно на треть (около 5 см у взрослого).'
    },
    {
      id: 'fa-05', topic: 'firstAid',
      q: 'Какой признак указывает на артериальное кровотечение?',
      options: [
        'Пульсирующая струя алой крови',
        'Густая тёмная кровь, вытекающая медленно',
        'Небольшое равномерное истечение крови',
        'Кровь останавливается самостоятельно'
      ],
      answer: 0,
      explain: 'Артериальное кровотечение — самое опасное: пульсирующая струя алой крови, которая не уменьшается при обычном придавливании.'
    },
    {
      id: 'fa-06', topic: 'firstAid',
      q: 'Каково максимальное время наложения жгута?',
      options: ['60 минут', '10 минут', '2 часа', '6 часов'],
      answer: 0,
      explain: 'Максимальное время — 60 минут, периодически давление ослабляют. После наложения прикладывают записку с указанием времени.'
    },
    {
      id: 'fa-07', topic: 'firstAid',
      q: 'Какая мера является самой важной при венозном кровотечении?',
      options: [
        'Наложение давящей повязки (тампонада)',
        'Наложение жгута на 2 часа',
        'Промывание раны водой',
        'Прикладывание холода к голове'
      ],
      answer: 0,
      explain: 'При венозном кровотечении важнее всего давящая повязка (тампонад): попадание воздуха в вену может привести к летальному исходу. Слои: стерильная салфетка, плотный слой ваты, стерильная салфетка.'
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
      q: 'Что запрещено давать пострадавшему при отморожении?',
      options: ['Алкогольные напитки', 'Горячий чай', 'Тёплую воду', 'Обезболивающее'],
      answer: 0,
      explain: 'Алкоголь расширяет сосуды и может привести к летальному исходу. Пострадавшего уводят в тепло, растирают поражённые участки и накладывают согревающую повязку.'
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
      q: 'На каком расстоянии переговорщик останавливается от захватчика?',
      options: ['10–20 метров', '1–2 метра', '50–100 метров', 'Рядом, вплотную'],
      answer: 0,
      explain: 'Переговорщик складывает оружие, подходит и встаёт на расстоянии 10–20 метров, подняв руки.'
    },
    {
      id: 'neg-02', topic: 'negotiations',
      q: 'Какую фразу произносит переговорщик при выходе на контакт?',
      options: [
        '«Я переговорщик, власти готовы выслушать ваши требования»',
        '«Сложите оружие, иначе начнётся штурм»',
        '«У вас пять минут, чтобы отпустить заложников»',
        '«Я сотрудник ФСБ, вы задержаны»'
      ],
      answer: 0,
      explain: 'После остановки на дистанции 10–20 метров и поднятых рук переговорщик произносит: «Я переговорщик, власти готовы выслушать ваши требования».'
    },
    {
      id: 'neg-03', topic: 'negotiations',
      q: 'Какая из целей переговоров связана с подготовкой спецслужб?',
      options: [
        'Затягивать время',
        'Немедленно начать штурм',
        'Скрыть требования преступников',
        'Ускорить передачу выкупа'
      ],
      answer: 0,
      explain: 'Одна из целей — затягивать время, чтобы специальные службы успели подготовиться к действиям.'
    },
    {
      id: 'neg-04', topic: 'negotiations',
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
      id: 'neg-05', topic: 'negotiations',
      q: 'Можно ли игнорировать требования похитителей?',
      options: [
        'Нет, игнорировать требования запрещено',
        'Да, если требования кажутся невыполнимыми',
        'Да, если заложников несколько',
        'Можно, если прошло больше часа'
      ],
      answer: 0,
      explain: 'Игнорировать требования похитителей нельзя — это прямой запрет для переговорщика.'
    },
    {
      id: 'neg-06', topic: 'negotiations',
      q: 'Как переговорщик должен общаться с преступниками?',
      options: [
        'Спокойно, без провокаций и повышения тона',
        'Жёстко, чтобы показать силу',
        'С угрозами немедленного штурма',
        'Перебивая и не давая говорить'
      ],
      answer: 0,
      explain: 'Запрещено провоцировать, конфликтовать и повышать тон на преступников.'
    },
    {
      id: 'neg-07', topic: 'negotiations',
      q: 'Что нужно сделать при передаче выкупа?',
      options: [
        'Постараться вывести сначала всех или часть заложников',
        'Сначала пересчитать деньги',
        'Сначала потребовать оружие преступников',
        'Сначала вызвать прессу'
      ],
      answer: 0,
      explain: 'При передаче выкупа стараются вывести сначала всех или часть заложников. Если захватчики отказываются — убедить сделать это одновременно.'
    },
    {
      id: 'neg-08', topic: 'negotiations',
      q: 'Как передают выкуп преступникам?',
      options: ['Через пол', 'Из рук в руки', 'Подбрасывают вверх', 'Оставляют в машине'],
      answer: 0,
      explain: 'Выкуп передают через пол. Если преступники хотят сначала пересчитать деньги — им дают такую возможность.'
    },
    {
      id: 'neg-09', topic: 'negotiations',
      q: 'Что начинается, если преступники забрали выкуп и не отдают заложников?',
      options: ['Штурм', 'Повторные переговоры', 'Выплата второго выкупа', 'Отвод сотрудников'],
      answer: 0,
      explain: 'Если выкуп забран, а заложников не отдают — начинается штурм.'
    },
    {
      id: 'neg-10', topic: 'negotiations',
      q: 'Кто, как правило, выступает переговорщиком?',
      options: [
        'Сотрудник ФСБ, назначенный командующим спецоперацией',
        'Любой гражданский доброволец',
        'Только губернатор лично',
        'Сотрудник пресс-службы'
      ],
      answer: 0,
      explain: 'Переговорщиком может быть должностное лицо, представляющее интересы властей, но как правило это сотрудник ФСБ, назначенный командующим спецоперацией (оперативным штабом).'
    },

    /* --- Штурм --- */
    {
      id: 'asm-01', topic: 'assault',
      q: 'Что означает команда «полсотни пять»?',
      options: ['Первая штурмовая группа', 'Группа закрепления', 'Группа резерва', 'Группа эвакуации'],
      answer: 0,
      explain: '«Полсотни пять» — первая штурмовая группа.'
    },
    {
      id: 'asm-02', topic: 'assault',
      q: 'Что означает команда «полсотни четыре»?',
      options: ['Группа закрепления', 'Первая штурмовая группа', 'Группа эвакуации', 'Группа резерва'],
      answer: 0,
      explain: '«Полсотни четыре» — группа закрепления.'
    },
    {
      id: 'asm-03', topic: 'assault',
      q: 'Что означает команда «полсотни три»?',
      options: ['Группа резерва', 'Группа закрепления', 'Группа эвакуации', 'Первая штурмовая группа'],
      answer: 0,
      explain: '«Полсотни три» — группа резерва.'
    },
    {
      id: 'asm-04', topic: 'assault',
      q: 'Что означает команда «полсотни два»?',
      options: ['Группа эвакуации', 'Группа резерва', 'Группа закрепления', 'Первая штурмовая группа'],
      answer: 0,
      explain: '«Полсотни два» — группа эвакуации.'
    },
    {
      id: 'asm-05', topic: 'assault',
      q: 'Когда подаётся команда «воздух»?',
      options: [
        'При артобстреле, миномётном обстреле или если сапёр не успевает разминировать СВУ',
        'Только при начале штурма',
        'Когда группа вошла в помещение',
        'Когда заложники освобождены'
      ],
      answer: 0,
      explain: '«Воздух» подаётся при артобстреле, миномётном обстреле или если сапёр не успевает разминировать СВУ.'
    },
    {
      id: 'asm-06', topic: 'assault',
      q: 'Что означает команда «закрепил»?',
      options: [
        'Замыкающий прикрывает спину',
        'Группа захватила здание',
        'Снайпер занял позицию',
        'Заложники освобождены'
      ],
      answer: 0,
      explain: '«Закрепил» — замыкающий прикрывает спину группы.'
    },
    {
      id: 'asm-07', topic: 'assault',
      q: 'На что направлен полицейский штурм?',
      options: [
        'На сохранение жизни заложников и задержание преступника',
        'На уничтожение противника без учёта заложников',
        'На максимальный расход боеприпасов',
        'На отход группы без контакта'
      ],
      answer: 0,
      explain: 'Полицейский штурм проводится с лёгким стрелковым вооружением, обычно со светошумовыми и газовыми гранатами, и направлен на сохранение жизни заложников и задержание преступника.'
    },
    {
      id: 'asm-08', topic: 'assault',
      q: 'Чем отличается армейский штурм?',
      options: [
        'Проводится без учёта наличия заложников и направлен на уничтожение противника',
        'Использует только светошумовые гранаты',
        'Всегда начинается с переговоров',
        'Проводится только днём'
      ],
      answer: 0,
      explain: 'Армейский штурм использует лёгкое, среднее и тяжёлое вооружение, отличается повышенным расходом боеприпасов, проводится без учёта заложников и направлен на уничтожение противника.'
    },
    {
      id: 'asm-09', topic: 'assault',
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
      id: 'asm-10', topic: 'assault',
      q: 'Какая тактика не зависит от ширины двери?',
      options: ['«Крест»', '«Крючок»', '«Угол»', '«Диагональ»'],
      answer: 0,
      explain: 'В тактике «Крест» ширина двери не важна: сотрудники входят один за другим, почти одновременно пересекая проём по диагонали.'
    },

    /* --- Запреты главы 4 --- */
    {
      id: 'prh-01', topic: 'prohibitions',
      q: 'Какое наказание предусмотрено за нарушение нормативно-правовых актов Нижегородской области (п. 4.1)?',
      options: [
        'Штраф / выговор / 2 выговора / увольнение',
        'Только устное замечание',
        'Только увольнение',
        'Понижение до двух ступеней'
      ],
      answer: 0,
      explain: 'Пункт 4.1: штраф / выговор / 2 выговора / увольнение.'
    },
    {
      id: 'prh-02', topic: 'prohibitions',
      q: 'Что грозит за употребление релаксантов или алкогольных веществ (п. 4.3)?',
      options: ['Увольнение', 'Штраф', 'Выговор', 'Понижение в должности'],
      answer: 0,
      explain: 'Пункт 4.3: употребление релаксантов / алкогольных веществ — увольнение.'
    },
    {
      id: 'prh-03', topic: 'prohibitions',
      q: 'Кому разрешено носить маску в рабочей форме (п. 4.5)?',
      options: [
        'Сотрудникам ФСБ, ОСН «Гром», ОСН «Берсерк», СР и ССНВП',
        'Всем сотрудникам без исключений',
        'Только сотрудникам полиции',
        'Только гражданским лицам'
      ],
      answer: 0,
      explain: 'Исключение по п. 4.5: сотрудники ФСБ, ОСН «Гром», ОСН «Берсерк», СР, ССНВП. Иным лицам — только при оперативно-профилактических мероприятиях, специальных операциях и сопоставимых мероприятиях.'
    },
    {
      id: 'prh-04', topic: 'prohibitions',
      q: 'Какое наказание предусмотрено за отсутствие на рабочем месте более 15 минут (п. 4.11)?',
      options: [
        'Штраф / выговор / понижение до двух ступеней',
        'Только увольнение',
        'Только 2 выговора',
        'Занесение в общий чёрный список'
      ],
      answer: 0,
      explain: 'Пункт 4.11: штраф / выговор / понижение до двух ступеней. 15 минут даётся с момента входа в игру, чтобы добраться до работы.'
    },
    {
      id: 'prh-05', topic: 'prohibitions',
      q: 'Что грозит за стрельбу по гражданским и должностным лицам без предусмотренных законом оснований (п. 4.12)?',
      options: [
        'Увольнение + занесение в общий чёрный список (ОЧС)',
        'Только штраф',
        'Только выговор',
        'Понижение до двух ступеней'
      ],
      answer: 0,
      explain: 'Пункт 4.12: увольнение + занесение в общий чёрный список (ОЧС).'
    },
    {
      id: 'prh-06', topic: 'prohibitions',
      q: 'Задержание граждан, проживающих в области не более 5 лет, наказывается (п. 4.13):',
      options: ['Выговором', 'Увольнением', 'Штрафом', 'Арестом'],
      answer: 0,
      explain: 'Пункт 4.13: задержание граждан, проживающих в области не более 5 лет (включительно), если иное не предусмотрено законодательством, — выговор.'
    },
    {
      id: 'prh-07', topic: 'prohibitions',
      q: 'Что предусмотрено за распространение служебной тайны (п. 4.14)?',
      options: [
        'Выговор / увольнение',
        'Только штраф',
        'Только понижение',
        'Только устное замечание'
      ],
      answer: 0,
      explain: 'Пункт 4.14: выговор / увольнение. Состав служебной тайны будет добавлен позже.'
    },
    {
      id: 'prh-08', topic: 'prohibitions',
      q: 'Какое наказание предусмотрено за злоупотребление должностными полномочиями (п. 4.6)?',
      options: [
        '2 выговора / увольнение',
        'Штраф / выговор',
        'Только выговор',
        'Понижение до двух ступеней'
      ],
      answer: 0,
      explain: 'Пункт 4.6: 2 выговора / увольнение.'
    },
    {
      id: 'prh-09', topic: 'prohibitions',
      q: 'Что грозит за выдачу себя за сотрудника другой или несуществующей организации (п. 4.7)?',
      options: [
        'Выговор / увольнение',
        'Только штраф',
        'Только 2 выговора',
        'Занесение в ОЧС'
      ],
      answer: 0,
      explain: 'Пункт 4.7: выговор / увольнение.'
    },
    {
      id: 'prh-10', topic: 'prohibitions',
      q: 'Какое наказание предусмотрено за нарушение иерархии власти согласно гл. 3 ОУГ (п. 4.10)?',
      options: [
        'Выговор / увольнение',
        'Штраф / выговор',
        'Только понижение',
        'Только 2 выговора'
      ],
      answer: 0,
      explain: 'Пункт 4.10: выговор / увольнение.'
    },
    {
      id: 'prh-11', topic: 'prohibitions',
      q: 'Что грозит за неподобающее поведение в строю при проведении проверок (п. 4.2)?',
      options: [
        'Штраф / выговор / увольнение',
        'Только увольнение',
        'Только 2 выговора',
        'Понижение до двух ступеней'
      ],
      answer: 0,
      explain: 'Пункт 4.2: штраф / выговор / увольнение.'
    },
    {
      id: 'prh-12', topic: 'prohibitions',
      q: 'Какое наказание предусмотрено за ложь сотрудникам ФСБ, Правительства или Суда (п. 4.4)?',
      options: [
        'Выговор / увольнение',
        'Только штраф',
        'Только 2 выговора',
        'Занесение в ОЧС'
      ],
      answer: 0,
      explain: 'Пункт 4.4: выговор / увольнение.'
    },
    {
      id: 'prh-13', topic: 'prohibitions',
      q: 'Кто освобождён от запрета на незарегистрированный личный транспорт в форме и при исполнении (п. 4.8)?',
      options: [
        'Адвокаты Палаты адвокатов — любой транспорт без обязательной регистрации',
        'Все сотрудники полиции',
        'Только сотрудники ФСБ',
        'Никто, исключений нет'
      ],
      answer: 0,
      explain: 'Пункт 4.8: выговор / 2 выговора + ответственность по ст. 20.7 КоАП. Исключение — адвокаты Палаты адвокатов: любой транспорт без обязательной регистрации.'
    },
    {
      id: 'prh-14', topic: 'prohibitions',
      q: 'Что грозит за музыкальные проигрыватели в форме и при исполнении обязанностей (п. 4.9)?',
      options: ['Штраф / выговор', 'Только увольнение', 'Только 2 выговора', 'Понижение до двух ступеней'],
      answer: 0,
      explain: 'Пункт 4.9: штраф / выговор.'
    },
    {
      id: 'prh-15', topic: 'prohibitions',
      q: 'Кому разрешено носить форму и погоны, не соответствующие званию и должности (п. 4.15)?',
      options: [
        'Военнослужащим ФСБ, сотрудникам ГУ МВД и ОСБ — при оперативно-профилактических мероприятиях или работе под прикрытием',
        'Всем сотрудникам в выходной день',
        'Только сотрудникам ДШР',
        'Никому, исключений нет'
      ],
      answer: 0,
      explain: 'Пункт 4.15: выговор / увольнение. Исключение — военнослужащие ФСБ, сотрудники ГУ МВД, сотрудники ОСБ при оперативно-профилактических мероприятиях или работе под прикрытием.'
    }
  ];

  /* ---------------- Утилиты ---------------- */
  const app = document.getElementById('testApp');
  if (!app) return;

  const STORE = 'dshr-test-draft-v1';
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
        throw new Error((data && (data.message || data.error)) || 'bad response');
      }
      return data;
    });
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

  /* ---------------- Стартовый экран ---------------- */
  function renderStart(draft) {
    stopTimer();
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
            '<p>Тест состоит из 30 случайных вопросов: по 6 из каждой темы. На выполнение даётся 45 минут. Проходной балл — 24 из 30 (80%).</p>' +
            '<div class="callout callout-info"><div><strong>Одна попытка.</strong> Повторное прохождение открывается только командиром.</div></div>' +
            (CONFIG.endpoint ? '' : '<div class="callout callout-warn"><div><strong>Отправка ещё не подключена.</strong> В конце теста результат нужно будет скопировать и передать командиру вручную.</div></div>') +
            '<div class="test-rules">' +
              '<div class="test-rule"><span class="test-rule-num">30</span><span>вопросов</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">45</span><span>минут</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">24</span><span>проходной балл</span></div>' +
              '<div class="test-rule"><span class="test-rule-num">5</span><span>тем</span></div>' +
            '</div>' +
            '<div class="test-topics">' +
              '<span class="badge">СВУ</span>' +
              '<span class="badge">Первая помощь</span>' +
              '<span class="badge">Переговоры</span>' +
              '<span class="badge">Штурм</span>' +
              '<span class="badge">Запреты главы 4</span>' +
            '</div>' +
            '<p class="muted small">Вопросы составлены по материалам сайта. Во время теста нельзя закрывать вкладку: оставшееся время сохраняется, но таймер продолжает идти.</p>' +
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
      }).catch(() => {
        /* Сервер недоступен или ещё не обновлён: не блокируем старт,
           окончательную проверку выполнит doPost при отправке. */
        setBusy(btn, false);
        toast('Не удалось проверить попытки — сервер проверит при отправке');
        startTest({ nickname: nickname, staticId: staticId, unit: unit });
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
        }).catch(() => {
          setBusy(btn, false);
          toast('Не удалось проверить попытки — сервер проверит при отправке');
          resumeTest(draft);
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
    const picked = [];
    Object.keys(TOPICS).forEach(topic => {
      const pool = shuffle(BANK.filter(q => q.topic === topic));
      pool.slice(0, CONFIG.perTopic).forEach(q => {
        const opts = q.options.map((text, i) => ({ text: text, ok: i === q.answer }));
        const mixed = shuffle(opts);
        picked.push({
          id: q.id,
          topic: q.topic,
          q: q.q,
          options: mixed.map(o => o.text),
          answer: mixed.findIndex(o => o.ok),
          explain: q.explain,
          chosen: null
        });
      });
    });

    state = {
      candidate: candidate,
      items: shuffle(picked),
      current: 0,
      startedAt: Date.now(),
      remaining: CONFIG.durationMin * 60,
      resultId: makeId(),
      submitted: false,
      result: null
    };
    saveDraft();
    renderTest();
    startTimer();
  }

  function resumeTest(draft) {
    const items = buildItems(draft.items);
    if (items.length !== draft.items.length) {
      clearDraft();
      renderStart(null);
      toast('Черновик повреждён, начните тест заново');
      return;
    }
    state = {
      candidate: draft.candidate,
      items: items,
      current: Math.min(Math.max(0, draft.current || 0), items.length - 1),
      startedAt: draft.startedAt || Date.now(),
      remaining: remainingForDraft(draft),
      resultId: draft.resultId || makeId(),
      submitted: false,
      result: null
    };
    renderTest();
    startTimer();
    if (state.remaining <= 0) submitTest(true);
  }

  /* ---------------- Таймер ---------------- */
  function startTimer() {
    stopTimer();
    updateTimerUI();
    timerId = setInterval(() => {
      if (!state || state.submitted) { stopTimer(); return; }
      state.remaining -= 1;
      if (state.remaining % 5 === 0) saveDraft();
      updateTimerUI();
      if (state.remaining <= 0) {
        stopTimer();
        submitTest(true);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function updateTimerUI() {
    const el = document.getElementById('testTimer');
    if (!el || !state || state.submitted) return;
    el.textContent = fmtTime(state.remaining);
    el.classList.toggle('is-low', state.remaining <= 300);
    el.classList.toggle('is-critical', state.remaining <= 60);
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
          '<div class="test-hud-timer" id="testTimer">' + fmtTime(state.remaining) + '<small>осталось</small></div>' +
          '<div class="test-hud-progress">' +
            '<span><strong id="testAnswered">0</strong> / ' + state.items.length + '</span>' +
            '<small>отвечено</small>' +
          '</div>' +
        '</div>' +
        '<div class="test-layout">' +
          '<div class="test-main">' +
            '<div id="testQuestion"></div>' +
            '<div class="test-controls">' +
              '<button type="button" class="btn" id="testPrev">← Назад</button>' +
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
            '<p class="test-side-note">Можно отвечать в любом порядке. Неотвеченные вопросы при завершении считаются ошибками.</p>' +
          '</aside>' +
        '</div>' +
      '</div>';

    document.getElementById('testPrev').addEventListener('click', () => goTo(state.current - 1));
    document.getElementById('testNext').addEventListener('click', () => goTo(state.current + 1));
    document.getElementById('testFinish').addEventListener('click', finishWithConfirm);

    document.getElementById('testQuestion').addEventListener('click', e => {
      const btn = e.target.closest('.test-opt');
      if (!btn) return;
      const idx = Number(btn.dataset.opt);
      state.items[state.current].chosen = idx;
      saveDraft();
      renderQuestion();
      renderNav();
      updateAnswered();
    });

    document.getElementById('testNav').addEventListener('click', e => {
      const btn = e.target.closest('.test-nav-btn');
      if (!btn) return;
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

    const options = item.options.map((text, i) => {
      const on = item.chosen === i;
      return '<button type="button" class="test-opt' + (on ? ' chosen' : '') + '" data-opt="' + i + '" aria-pressed="' + on + '">' +
        '<span class="test-opt-key">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="test-opt-text">' + esc(text) + '</span>' +
        '<span class="test-opt-mark" aria-hidden="true">' + (on ? '✓' : '') + '</span>' +
      '</button>';
    }).join('');

    box.innerHTML =
      '<article class="test-question">' +
        '<div class="test-q-top">' +
          '<span class="badge badge-accent">' + esc(TOPICS[item.topic].name) + '</span>' +
          '<span class="test-q-count">Вопрос ' + (state.current + 1) + ' из ' + state.items.length + '</span>' +
        '</div>' +
        '<h2 class="test-q-text">' + esc(item.q) + '</h2>' +
        '<div class="test-options">' + options + '</div>' +
      '</article>';

    const prev = document.getElementById('testPrev');
    const next = document.getElementById('testNext');
    if (prev) prev.disabled = state.current === 0;
    if (next) next.disabled = state.current === state.items.length - 1;
  }

  function renderNav() {
    const nav = document.getElementById('testNav');
    if (!nav) return;
    nav.innerHTML = state.items.map((it, i) => {
      let cls = 'test-nav-btn';
      if (i === state.current) cls += ' current';
      else if (it.chosen !== null) cls += ' answered';
      return '<button type="button" class="' + cls + '" data-go="' + i + '" aria-label="Вопрос ' + (i + 1) + '"' +
        (i === state.current ? ' aria-current="true"' : '') + '>' + (i + 1) + '</button>';
    }).join('');
  }

  function updateAnswered() {
    const el = document.getElementById('testAnswered');
    if (el) el.textContent = state.items.filter(it => it.chosen !== null).length;
  }

  function goTo(index) {
    if (!state || index < 0 || index >= state.items.length) return;
    state.current = index;
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
    if (window.confirm(msg)) submitTest(false);
  }

  /* ---------------- Завершение и результат ---------------- */
  function submitTest(auto) {
    if (!state || state.submitted) return;
    state.submitted = true;
    stopTimer();

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
      topics: topics,
      answers: answers
    };

    state.result = result;
    clearDraft();
    renderResult(result, auto);
    sendResult(result);
  }

  function renderResult(result, auto) {
    const wrong = result.answers.filter(a => !a.isCorrect);
    const when = new Date(result.finishedAt);
    const dateStr = when.toLocaleString('ru-RU');
    const mins = Math.floor(result.durationSec / 60);
    const secs = result.durationSec % 60;

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
            const chosen = a.chosen === null ? 'Нет ответа' : a.chosen;
            return '<div class="test-review-item">' +
              '<p class="test-review-q">' + esc(a.question) + '</p>' +
              '<p class="test-review-line bad"><span>Ваш ответ:</span> ' + esc(chosen) + '</p>' +
              '<p class="test-review-line good"><span>Правильно:</span> ' + esc(a.correct) + '</p>' +
              '<p class="test-review-explain">' + esc(byId[a.id] ? byId[a.id].explain : '') + '</p>' +
            '</div>';
          }).join('') +
        '</div>'
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
          '<p class="muted small">' + esc(dateStr) + ' · затрачено ' + mins + ' мин ' + secs + ' сек' + (auto ? ' · время истекло' : '') + '</p>' +
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
    lines.push('Дата: ' + new Date(r.finishedAt).toLocaleString('ru-RU'));
    lines.push('ID результата: ' + r.id);
    lines.push('');
    Object.keys(r.topics).forEach(key => {
      const t = r.topics[key];
      lines.push(t.name + ': ' + t.correct + ' / ' + t.total);
    });
    const wrong = r.answers.filter(a => !a.isCorrect);
    if (wrong.length) {
      lines.push('');
      lines.push('Ошибки:');
      wrong.forEach((a, i) => {
        lines.push((i + 1) + '. ' + a.question);
        lines.push('   Ваш ответ: ' + (a.chosen === null ? 'нет ответа' : a.chosen));
        lines.push('   Правильно: ' + a.correct);
      });
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
