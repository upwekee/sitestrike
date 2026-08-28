export interface HardwareZone {
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  mouse?: string;
  keyboard?: string;
  headset?: string;
}

export interface PromotionTier {
  label: string;
  bonus: string;
}

export interface LoyaltyRank {
  rank: string;
  time: string;
  discount: string;
  color: string;
}

export interface PromotionItem {
  id: string;
  title: string;
  badge: string;
  badgeColor?: string;
  description: string;
  terms?: string;
  image: string;
  highlight?: string;
  tiers?: PromotionTier[];
  ranks?: LoyaltyRank[];
}

export interface FoodMenuItem {
  title: string;
  price: string;
  desc?: string;
  tag?: string;
  image?: string;
  category?: string;
}

export interface TeaCategory {
  category: string;
  price: string;
  items: string[];
}

export interface ClubData {
  id: number;
  name: string;
  shortName: string;
  subtitle: string;
  address: string;
  hours: string;
  phone: string;
  phoneRaw: string;
  vk: string;
  vkLabel: string;
  yandexMapsUrl: string;
  twoGisUrl: string;
  lat: number;
  lng: number;
  tag: string;
  image: string;
  gallery: string[];
  workstationsCount: number;
  pricing: {
    pc: {
      zones: string[];
      rows: { label: string; sub: string; color: string; prices: string[] }[];
    };
    ps5: {
      zones: string[];
      rows: { label: string; sub: string; color: string; prices: string[] }[];
    };
  };
  hardware: {
    zones: HardwareZone[];
  };
  promotions: PromotionItem[];
  food: {
    available: boolean;
    messageIfUnavailable?: string;
    menu?: {
      snacks: FoodMenuItem[];
      pizza: FoodMenuItem[];
      drinks?: FoodMenuItem[];
      tea: TeaCategory[];
    };
  };
}

export const COMMON_FOOD_MENU = {
  snacks: [
    { title: "Картошка фри с соусом", price: "150 ₽", desc: "Хрустящий золотистый картофель фри с порционным соусом на выбор", tag: "Хит", image: "/media/food/snack-fries.jpg", category: "Горячие снеки" },
    { title: "Сэндвич горячий", price: "180 ₽", desc: "Сытный поджаренный сэндвич с ветчиной, сыром и фирменным соусом", tag: "Снек", image: "/media/food/snack-sandwich.jpg", category: "Горячие снеки" },
    { title: "Наггетсы куриные", price: "220 ₽", desc: "Нежное сочное куриное филе в хрустящей панировке (6 шт)", tag: "Популярное", image: "/media/food/snack-nuggets.jpg", category: "Горячие снеки" },
    { title: "Чебупелли мясные", price: "220 ₽", desc: "Жареные золотистые мини-пельмешки с сочным мясом", tag: "Хит", image: "/media/food/chebupeli.jpg", category: "Горячие снеки" },
    { title: "Чебупицца", price: "220 ₽", desc: "Хрустящие запеченные треугольные снеки с сыром и пепперони", tag: "Хит", image: "/media/food/chebupizza.jpg", category: "Горячие снеки" },
    { title: "Хотстеры / Хот-дог", price: "220 ₽", desc: "Мини-сосиски в воздушном тесте с горчичным соусом", tag: "Снек", image: "/media/food/snack-hotdog.jpg", category: "Горячие снеки" },
    { title: "Лапша Wok / Доширак", price: "80 ₽", desc: "Быстрый горячий сытный перекус во время катки", tag: "", image: "/media/food/snack-noodles.jpg", category: "Быстрый перекус" },
    { title: "Чебурек с мясом", price: "90 ₽", desc: "Большой хрустящий чебурек с сочной начинкой из фарша и зелени", tag: "Топ", image: "/media/food/cheburek.jpg", category: "Быстрый перекус" },
  ],
  pizza: [
    { title: "Студенческая", price: "300 ₽", desc: "Томатная основа, сыр моцарелла, колбаски, зелень и пряности", tag: "Выгодно", image: "/media/food/pizza-student.jpg", category: "Пицца 30см" },
    { title: "Маргарита", price: "300 ₽", desc: "Классическая итальянская основа с томатами и тянущимся сыром", tag: "Классика", image: "/media/food/pizza-margherita.jpg", category: "Пицца 30см" },
    { title: "С ветчиной и грибами", price: "350 ₽", desc: "Нежная ветчина, свежие шампиньоны, моцарелла и белый соус", tag: "Топ", image: "/media/food/pizza-ham-mushrooms.jpg", category: "Пицца 30см" },
    { title: "Мясная фирменная", price: "350 ₽", desc: "Пепперони, бекон, охотничьи колбаски, моцарелла и острый соус", tag: "Сытно", image: "/media/food/pizza-meat.jpg", category: "Пицца 30см" },
  ],
  drinks: [
    { title: "Monster Energy (0.5л)", price: "200 ₽", desc: "Оригинальный, Mango Loco, Ultra White, Pipeline Punch", tag: "Энергия", image: "/media/food/drink-monster.jpg", category: "Энергетики" },
    { title: "Red Bull (0.33л)", price: "220 ₽", desc: "Классический премиальный энергетик для ночных каток", tag: "Энергия", image: "/media/food/drink-redbull.jpg", category: "Энергетики" },
    { title: "Flash Up Energy (0.45л)", price: "130 ₽", desc: "Ягодный, ультра, оригинальный вкус", tag: "Выгодно", image: "/media/food/drink-flash.jpg", category: "Энергетики" },
    { title: "Coca-Cola / Добрый Кола (0.5л)", price: "120 ₽", desc: "Охлаждённая классическая газировка", tag: "Холодные", image: "/media/food/drink-cola.jpg", category: "Напитки" },
  ],
  tea: [
    {
      category: "Китайская чайная церемония",
      price: "300 ₽",
      image: "/media/food/tea-puer.jpg",
      desc: "Элитные выдержанные сорта: Шу и Шен Пуэры, легендарный Да Хун Пао на пролив",
      items: [
        'Шен Пуэр Мэнхай "Свежий лист"',
        'Да Хун Пао "Большой красный халат"',
        'Пуэр Шу "8-летний аромат зрелости"',
      ],
    },
    {
      category: "Классические сорта и Улун",
      price: "250 ₽",
      image: "/media/food/tea-oolong.jpg",
      desc: "Отборные листовые сорта: ароматный молочный улун, зелёный с жасмином и чабрец",
      items: [
        "Молочный улун",
        "Чёрный с чабрецом",
        "Чёрный с бергамотом",
        "Чёрный с облепихой",
        "Зелёный с жасмином",
      ],
    },
    {
      category: "Фруктовые и ягодные сборы",
      price: "250 ₽",
      image: "/media/food/tea-berries.jpg",
      desc: "Натуральные фруктово-ягодные сборы в прозрачном чайнике на чайной свече",
      items: [
        "Нахальный Наглый Фрукт",
        "Таёжный сбор",
        "Апельсин с корицей",
        "Сенча лимон с имбирём",
        "Земляника со сливками",
      ],
    },
  ],
};

export const CLUBS_DATA: ClubData[] = [
  {
    id: 0,
    name: "ул. Ломоносова, 84",
    shortName: "ул. Ломоносова, 84",
    subtitle: "Воронеж, ул. Ломоносова, 84",
    address: "Воронеж, ул. Ломоносова, 84",
    hours: "24/7 Круглосуточно",
    phone: "+7 (995) 669-02-06",
    phoneRaw: "+79956690206",
    vk: "https://vk.ru/club235455500",
    vkLabel: "vk.ru/club235455500",
    yandexMapsUrl: "https://yandex.ru/maps/-/CTDHFJMJ",
    twoGisUrl: "https://2gis.ru/voronezh/search/ул.%20Ломоносова%2084",
    lat: 51.709684,
    lng: 39.230524,
    workstationsCount: 45,
    tag: "Флагман",
    image: "/photos/lomonosova/photo-3.jpg",
    gallery: [
      "/photos/lomonosova/photo-1.jpg",
      "/photos/lomonosova/photo-2.jpg",
      "/photos/lomonosova/photo-3.jpg",
      "/photos/lomonosova/photo-4.jpg",
      "/photos/lomonosova/photo-5.jpg",
      "/photos/lomonosova/photo-6.jpg",
      "/photos/lomonosova/photo-7.jpg",
      "/photos/lomonosova/photo-8.jpg",
      "/photos/lomonosova/photo-9.jpg",
    ],
    pricing: {
      pc: {
        zones: ["COMFORT", "BOOTCAMP / VIP", "DUO / TRIO"],
        rows: [
          { label: "1 ЧАС", sub: "Почасовая игра", color: "#1166ff", prices: ["120 ₽", "160 ₽", "200 ₽"] },
          { label: "4 ЧАСА", sub: "Дневной пакет", color: "#1166ff", prices: ["380 ₽", "510 ₽", "640 ₽"] },
          { label: "6 ЧАСОВ", sub: "Максимальный день", color: "#1166ff", prices: ["540 ₽", "770 ₽", "960 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 07:00", color: "#0a3fa8", prices: ["500 ₽", "700 ₽", "900 ₽"] },
          { label: "УТРО", sub: "07:00 — 12:00", color: "#c47a00", prices: ["60 ₽/ч", "80 ₽/ч", "100 ₽/ч"] },
        ],
      },
      ps5: {
        zones: ["PS5 LOUNGE"],
        rows: [
          { label: "1 ЧАС", sub: "Игра на консоли", color: "#1166ff", prices: ["300 ₽"] },
          { label: "4 ЧАСА", sub: "Пакет консоль", color: "#1166ff", prices: ["900 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 07:00", color: "#0a3fa8", prices: ["1 100 ₽"] },
        ],
      },
    },
    hardware: {
      zones: [
        {
          name: "COMFORT (1–25)",
          cpu: "Intel Core i5-12400F",
          gpu: "NVIDIA GeForce RTX 3070 Ti",
          ram: "16 GB DDR4 3600MHz",
          monitor: "165 Гц IPS Gaming",
          mouse: "Logitech G102 Lightsync",
          keyboard: "Dark Project KD87",
          headset: "HyperX Cloud II",
        },
        {
          name: "BOOTCAMP / VIP (26–35)",
          cpu: "Intel Core i5-13600KF",
          gpu: "NVIDIA GeForce RTX 4070 Ti",
          ram: "32 GB DDR5 6000MHz",
          monitor: "240 Гц FAST IPS",
          mouse: "Logitech G Pro Wireless",
          keyboard: "Dark Project Arena KD-1",
          headset: "HyperX Cloud Alpha S",
        },
        {
          name: "DUO / TRIO (36–45)",
          cpu: "AMD Ryzen 7 7800X3D",
          gpu: "NVIDIA GeForce RTX 5070 12GB",
          ram: "32 GB DDR5 6400MHz",
          monitor: "600 Гц Ultra FAST TN",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Dark Project Arena KD-1 Mechanical",
          headset: "HyperX Cloud II Wireless",
        },
      ],
    },
    promotions: [
      {
        id: "l-cashback",
        title: "Получай кешбэк за пополнение",
        badge: "Бонус на счёт",
        badgeColor: "#1166ff",
        description: "Пополняй баланс на крупную сумму и получай моментальный дополнительный бонус на счёт!",
        image: "/media/akcii/20let-military.jpg",
        highlight: "до +1 000 ₽",
        tiers: [
          { label: "+1 000 ₽", bonus: "+100 ₽ на счёт" },
          { label: "+2 000 ₽", bonus: "+250 ₽ на счёт" },
          { label: "+5 000 ₽", bonus: "+1 000 ₽ на счёт" },
        ],
      },
      {
        id: "l-military",
        title: "Скидка 10% военным и курсантам",
        badge: "Скидка 10%",
        badgeColor: "#10b981",
        description: "Постоянная скидка 10% на все услуги клуба для военнослужащих и курсантов военных училищ.",
        image: "/media/akcii/lomonosov-extra.jpg",
        highlight: "10% ВСЕГДА",
        terms: "При предъявлении военного билета или удостоверения курсанта администратору.",
      },
      {
        id: "l-loyalty",
        title: "Система лояльности STRIKE",
        badge: "До 15% скидки",
        badgeColor: "#f59e0b",
        description: "Играй больше — получай постоянную скидку на всё игровое время в клубе!",
        image: "/media/akcii/lomonosov-military.jpg",
        highlight: "4 УРОВНЯ",
        ranks: [
          { rank: "Bronze", time: "100 - 299 часов", discount: "3%", color: "#cd7f32" },
          { rank: "Silver", time: "300 - 499 часов", discount: "5%", color: "#c0c0c0" },
          { rank: "Gold", time: "500 - 999 часов", discount: "10%", color: "#ffd700" },
          { rank: "Platinum", time: "1000+ часов", discount: "15%", color: "#00d4ff" },
        ],
      },
      {
        id: "l-review",
        title: "Оставь отзыв о клубе",
        badge: "100 ₽ на баланс",
        badgeColor: "#00d4ff",
        description: "Оставь честный отзыв в 2ГИС и Яндекс Картах и получи 100 рублей на игровой баланс!",
        image: "/media/akcii/lomonosov-review.jpg",
        highlight: "+100 ₽",
        terms: "Показать администратору опубликованный отзыв. Воспользоваться акцией можно один раз.",
      },
      {
        id: "l-hookah-ps",
        title: "Кальян + PS5: час в подарок",
        badge: "PS5 Акция",
        badgeColor: "#8b5cf6",
        description: "Покупай кальян + 1 час на PlayStation и получай 1 час игры на PlayStation в подарок!",
        image: "/media/akcii/lomonosov-hookah-ps.jpg",
        highlight: "+1 ЧАС FREE",
        terms: "Акция действует в лаундж-зоне с PS5. Подробности у администратора.",
      },
    ],
    food: {
      available: true,
      menu: COMMON_FOOD_MENU,
    },
  },
  {
    id: 1,
    name: "ул. 20-летия Октября, 101",
    shortName: "ул. 20-летия Октября, 101",
    subtitle: "Воронеж, ул. 20-летия Октября, 101",
    address: "Воронеж, ул. 20-летия Октября, 101",
    hours: "24/7 Круглосуточно",
    phone: "+7 (993) 297-63-60",
    phoneRaw: "+79932976360",
    vk: "https://vk.ru/kkstrike",
    vkLabel: "vk.ru/kkstrike",
    yandexMapsUrl: "https://yandex.ru/maps/-/CTDHBPL0",
    twoGisUrl: "https://2gis.ru/voronezh/search/ул.%2020-летия%20Октября%20101",
    lat: 51.651510,
    lng: 39.191632,
    workstationsCount: 50,
    tag: "Центр",
    image: "/photos/20let/photo-1.jpg",
    gallery: [
      "/photos/20let/photo-1.jpg",
      "/photos/20let/photo-2.jpg",
      "/photos/20let/photo-3.jpg",
      "/photos/20let/photo-4.jpg",
      "/photos/20let/photo-5.jpg",
      "/photos/20let/photo-6.jpg",
      "/photos/20let/photo-7.jpg",
      "/photos/20let/photo-8.jpg",
    ],
    pricing: {
      pc: {
        zones: ["COMFORT", "LOUNGE / SQUAD", "VIP"],
        rows: [
          { label: "1 ЧАС", sub: "Почасовая игра", color: "#1166ff", prices: ["110 ₽", "140 ₽", "180 ₽"] },
          { label: "3 ЧАСА", sub: "Пакет 3ч", color: "#1166ff", prices: ["290 ₽", "370 ₽", "480 ₽"] },
          { label: "5 ЧАСОВ", sub: "Пакет 5ч", color: "#1166ff", prices: ["440 ₽", "560 ₽", "720 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 08:00 (10ч)", color: "#0a3fa8", prices: ["450 ₽", "580 ₽", "750 ₽"] },
          { label: "УТРО", sub: "08:00 — 13:00 (5ч)", color: "#c47a00", prices: ["200 ₽", "250 ₽", "320 ₽"] },
        ],
      },
      ps5: {
        zones: ["PS5"],
        rows: [
          { label: "1 ЧАС", sub: "Консольная игра", color: "#1166ff", prices: ["300 ₽"] },
          { label: "3 ЧАСА", sub: "Пакет 3ч", color: "#1166ff", prices: ["750 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 08:00 (10ч)", color: "#0a3fa8", prices: ["1 000 ₽"] },
        ],
      },
    },
    hardware: {
      zones: [
        {
          name: "COMFORT (1–20)",
          cpu: "Intel Core i5-12400F",
          gpu: "GeForce RTX 3070 Ti",
          ram: "16 GB DDR4 3600MHz",
          monitor: "165 Гц IPS Gaming",
          mouse: "Logitech G102 Lightsync",
          keyboard: "Dark Project KD87",
          headset: "HyperX Cloud II",
        },
        {
          name: "LOUNGE / SQUAD (21–35)",
          cpu: "Intel Core i5-12600KF",
          gpu: "GeForce RTX 3080 10GB",
          ram: "32 GB DDR4 3600MHz",
          monitor: "240 Гц FAST IPS",
          mouse: "Logitech G Pro Wireless",
          keyboard: "Dark Project KD87A",
          headset: "HyperX Cloud Alpha",
        },
        {
          name: "VIP ZONE (36–50)",
          cpu: "Intel Core i5-13600KF",
          gpu: "GeForce RTX 4070 Ti 12GB",
          ram: "32 GB DDR5 6000MHz",
          monitor: "390 Гц FAST IPS",
          mouse: "Logitech G Pro X Superlight",
          keyboard: "Dark Project Arena KD-1",
          headset: "HyperX Cloud II Wireless",
        },
      ],
    },
    promotions: [
      {
        id: "20-cashback",
        title: "Кешбэк за пополнение баланса",
        badge: "Бонус на счёт",
        badgeColor: "#1166ff",
        description: "Пополняй игровой баланс и получай моментальный дополнительный бонус!",
        image: "/media/akcii/20let-military.jpg",
        highlight: "до +1 000 ₽",
        tiers: [
          { label: "+1 000 ₽", bonus: "+100 ₽ на счёт" },
          { label: "+2 000 ₽", bonus: "+250 ₽ на счёт" },
          { label: "+5 000 ₽", bonus: "+1 000 ₽ на счёт" },
        ],
      },
      {
        id: "20-military",
        title: "Скидка 10% военным и курсантам",
        badge: "Скидка 10%",
        badgeColor: "#10b981",
        description: "10% скидка на всё игровое время для военнослужащих и курсантов военных училищ.",
        image: "/media/akcii/20let-cashback.jpg",
        highlight: "10% ВСЕГДА",
        terms: "Предъявите военный билет или студенческий билет военного училища администратору.",
      },
      {
        id: "20-loyalty",
        title: "Программа лояльности STRIKE",
        badge: "До 15% скидки",
        badgeColor: "#f59e0b",
        description: "Копите игровые часы на аккаунте и получайте пожизненный дисконт на все зоны!",
        image: "/media/akcii/20let-loyalty.jpg",
        highlight: "4 РАНГА",
        ranks: [
          { rank: "Bronze", time: "100 - 299 часов", discount: "3%", color: "#cd7f32" },
          { rank: "Silver", time: "300 - 499 часов", discount: "5%", color: "#c0c0c0" },
          { rank: "Gold", time: "500 - 999 часов", discount: "10%", color: "#ffd700" },
          { rank: "Platinum", time: "1000+ часов", discount: "15%", color: "#00d4ff" },
        ],
      },
    ],
    food: {
      available: true,
      menu: COMMON_FOOD_MENU,
    },
  },
  {
    id: 2,
    name: "ул. Ключникова, 1",
    shortName: "ул. Ключникова, 1",
    subtitle: "Воронеж, ул. Ключникова, д. 1",
    address: "Воронеж, ул. Ключникова, д. 1",
    hours: "24/7 Круглосуточно",
    phone: "+7 (993) 728-45-04",
    phoneRaw: "+79937284504",
    vk: "https://vk.ru/strikeshilovo",
    vkLabel: "vk.ru/strikeshilovo",
    yandexMapsUrl: "https://yandex.ru/maps/-/CTDHBNkR",
    twoGisUrl: "https://2gis.ru/voronezh/search/ул.%20Ключникова%201",
    lat: 51.568039,
    lng: 39.121882,
    workstationsCount: 40,
    tag: "Шилово",
    image: "/photos/shilovo/photo-1.jpg",
    gallery: [
      "/photos/shilovo/photo-1.jpg",
      "/photos/shilovo/photo-2.jpg",
      "/photos/shilovo/photo-3.jpg",
      "/photos/shilovo/photo-4.jpg",
      "/photos/shilovo/photo-5.jpg",
      "/photos/shilovo/photo-6.jpg",
    ],
    pricing: {
      pc: {
        zones: ["COMFORT", "PRO", "BOOTCAMP"],
        rows: [
          { label: "1 ЧАС", sub: "Почасовая игра", color: "#1166ff", prices: ["100 ₽", "130 ₽", "160 ₽"] },
          { label: "3 ЧАСА", sub: "Пакет 3ч", color: "#1166ff", prices: ["270 ₽", "350 ₽", "430 ₽"] },
          { label: "5 ЧАСОВ", sub: "Пакет 5ч", color: "#1166ff", prices: ["400 ₽", "520 ₽", "640 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 08:00 (10ч)", color: "#0a3fa8", prices: ["420 ₽", "550 ₽", "680 ₽"] },
          { label: "УТРО", sub: "08:00 — 13:00 (5ч)", color: "#c47a00", prices: ["180 ₽", "230 ₽", "290 ₽"] },
        ],
      },
      ps5: {
        zones: ["PS5"],
        rows: [
          { label: "1 ЧАС", sub: "Консольная игра", color: "#1166ff", prices: ["250 ₽"] },
          { label: "3 ЧАСА", sub: "Пакет 3ч", color: "#1166ff", prices: ["650 ₽"] },
          { label: "НОЧЬ", sub: "22:00 — 08:00 (10ч)", color: "#0a3fa8", prices: ["850 ₽"] },
        ],
      },
    },
    hardware: {
      zones: [
        {
          name: "COMFORT (1–20)",
          cpu: "Intel Core i3-12100F",
          gpu: "GeForce GTX 1080 Ti Aorus",
          ram: "16 GB DDR4 3200MHz",
          monitor: "165 Гц IPS Gaming",
          mouse: "Ardor Gaming Edge",
          keyboard: "Dark Project KD87",
          headset: "HyperX Cloud Stinger",
        },
        {
          name: "PRO (21–32)",
          cpu: "Intel Core i5-12400F",
          gpu: "GeForce RTX 3070 Ti 8GB",
          ram: "32 GB DDR4 3600MHz",
          monitor: "240 Гц FAST IPS",
          mouse: "Logitech G Pro Wireless",
          keyboard: "Dark Project KD87A",
          headset: "HyperX Cloud II",
        },
        {
          name: "BOOTCAMP (33–40)",
          cpu: "Intel Core i5-13600KF",
          gpu: "GeForce RTX 4070 Super",
          ram: "32 GB DDR5 6000MHz",
          monitor: "280 Гц FAST IPS",
          mouse: "Logitech G Pro X Superlight",
          keyboard: "Dark Project Arena KD-1",
          headset: "HyperX Cloud Alpha Wireless",
        },
      ],
    },
    promotions: [
      {
        id: "sh-cashback",
        title: "Кешбэк за пополнение",
        badge: "Бонус на счёт",
        badgeColor: "#1166ff",
        description: "Пополняй баланс от 1000 ₽ и получай дополнительные деньги на счёт клуба!",
        image: "/media/akcii/20let-military.jpg",
        highlight: "до +1 000 ₽",
        tiers: [
          { label: "+1 000 ₽", bonus: "+100 ₽ на счёт" },
          { label: "+2 000 ₽", bonus: "+250 ₽ на счёт" },
          { label: "+5 000 ₽", bonus: "+1 000 ₽ на счёт" },
        ],
      },
      {
        id: "sh-military",
        title: "Скидка 10% военным и курсантам",
        badge: "Скидка 10%",
        badgeColor: "#10b981",
        description: "10% скидка на всё игровое время для военнослужащих и курсантов военных училищ.",
        image: "/media/akcii/20let-cashback.jpg",
        highlight: "10% ВСЕГДА",
        terms: "При предъявлении военного билета или удостоверения курсанта администратору.",
      },
      {
        id: "sh-loyalty",
        title: "Система лояльности STRIKE",
        badge: "До 15% скидки",
        badgeColor: "#f59e0b",
        description: "Играй больше — получай постоянную скидку на всё игровое время в клубе!",
        image: "/media/akcii/20let-loyalty.jpg",
        highlight: "4 УРОВНЯ",
        ranks: [
          { rank: "Bronze", time: "100 - 299 часов", discount: "3%", color: "#cd7f32" },
          { rank: "Silver", time: "300 - 499 часов", discount: "5%", color: "#c0c0c0" },
          { rank: "Gold", time: "500 - 999 часов", discount: "10%", color: "#ffd700" },
          { rank: "Platinum", time: "1000+ часов", discount: "15%", color: "#00d4ff" },
        ],
      },
    ],
    food: {
      available: false,
      messageIfUnavailable: "В филиале на ул. Ключникова, 1 (Шилово) горячая кухня и чайная церемония не представлены. Для гостей доступны прохладительные напитки и снеки у администратора. Горячая пицца, снеки и китайский чай ждут вас в наших филиалах на ул. Ломоносова, 84 и ул. 20-летия Октября, 101!",
    },
  },
];
