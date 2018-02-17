# Rutracker API для Node.js
Данный модуль позволяет искать по раздачам трекера Rutracker.org. Поскольку поиск запрещён для незарегистрированных пользователей, также поддерживаетcя и авторизация.

## Установка
Запусти ```npm install rutracker-api``` (предполагается, что Node.js и пакетный менеждер npm у вас уже установлены). Для работы требуется версия Node.js >= 6.

## API

### RutrackerApi#login({ username, password })
Возвращает Promise<>. Promise упадет, если были введены неправильные `username` или `password`.

```js
const RutrackerApi = require('rutracker-api');
const rutracker = new RutrackerApi();

rutracker.login({ username: '', password: '' })
  .then(() => {
    console.log('Authorized');
  })
  .catch(err => console.error(err));
```

### RutrackerApi#search(query)
Возвращает Promise<[#Torrent](Torrent)[]>.

```js
const RutrackerApi = require('rutracker-api');
const rutracker = new RutrackerApi();

rutracker.login({ username: '', password: '' })
  .then(() => rutracker.query('your query'))
  .then(torrents => console.log(torrents));
```

### RutrackerApi#download(torrentId)
Возвращает Promise<[https://nodejs.org/api/stream.html#stream_readable_streams](fs.ReadableStream)>.

```js
const fs = require('fs');
const RutrackerApi = require('rutracker-api');
const rutracker = new RutrackerApi();

rutracker.login({ username: '', password: '' })
  .then(() => rutracker.download('id'))
  .then(stream => stream.pipe(fs.createWriteStream('filename.torrent')));
```

### RutrackerApi#getMagnetLink(torrentId)
Возвращает Promise<string>.

```js
const RutrackerApi = require('rutracker-api');
const rutracker = new RutrackerApi();

rutracker.login({ username: '', password: '' })
  .then(() => rutracker.getMagnetLink('id'))
  .then(uri => console.log(uri));
```


## Типы

### Torrent
Объект следующей формы:
```js
{
  state: 'проверено',
  id: 'XXXXXXXX'
  category: 'CATEGORY_NAME',
  title: 'TITLE',
  author: 'AUTHOR_NAME',
  size: '1.07 GB',
  seeds: '7123',
  leechs: '275',
  url: 'rutracker.org/forum/viewtopic.php?t=XXXXXX'
}
```
