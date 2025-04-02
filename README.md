# IBB "BLOG" - Мини Блог

Данный проект представляет собой мини блог.

## Функционал
- Авторизация через google
- CRUD операции

## Технологии
 - ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Redux + RTK](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
- ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
- ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
- ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/Gennod/ibb-social-network.git
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите приложение:

```bash
npm start
```

## Демо

Посмотреть работающее приложение можно здесь:
[IBB-BLOG](https://ibb-social-network.netlify.app/)

## Структура проекта

```
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
├── public
    ├── favicon.ico
    ├── index.html
    ├── logo192.png
    ├── logo512.png
    ├── manifest.json
    └── robots.txt
├── src
    ├── App.scss
    ├── App.tsx
    ├── components
    │   ├── AuthButton.tsx
    │   ├── PostForm.tsx
    │   └── PostList.tsx
    ├── firebase.ts
    ├── images
    │   └── anonymous.jpg
    ├── index.css
    ├── index.tsx
    ├── react-app-env.d.ts
    ├── store
    │   ├── features
    │   │   ├── authSlice.ts
    │   │   └── postSlice.ts
    │   └── store.ts
    ├── types.ts
    └── utils
    │   ├── _variables.scss
    │   └── index.scss
└── tsconfig.json
```
