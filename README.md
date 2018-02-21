# rutracker-api
Позволяет искать по раздачам трекера Rutracker.org. Поскольку поиск запрещён для незарегистрированных пользователей, также поддерживаетcя и авторизация.

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

### RutrackerApi#search({ query })
Возвращает Promise<[Torrent](#torrent)[]>.

```js
const RutrackerApi = require('rutracker-api');
const rutracker = new RutrackerApi();

rutracker.login({ username: '', password: '' })
  .then(() => rutracker.search({ query: 'your query' }))
  .then(torrents => console.log(torrents));
```

### RutrackerApi#download(torrentId)
Возвращает Promise<[fs.ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams)>.

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

#### Свойства

##### id: `string`
Уникальный идентификатор раздачи. Используйте это свойство в методах [`RutrackerApi#download`](#rutrackerapidownloadtorrentid) и [`RutrackerApi#getMagnetLink`](rutrackerapigetmagnetlinktorrentid).

##### title: `string`
Заголовок раздачи.

##### author: `string`
Имя пользователя, который создал раздачу.

##### category: `string`
Имя категории.

##### size: `number`
Размер раздачи в байтах.

##### formattedSize: `string`
Форматированный размер раздачи, похожий на тот, что выводит сам RuTracker. Например, `"3.03 GB"`.

##### seeds: `number`
Количество активных сидеров.

##### leeches: `number`
Количество активных личеров.

##### url: `string`
Ссылка на страницу торрента.

##### state: `string`
Текущий статус раздачи. Для сравнения используйте статические свойства объекта Torrent.
```js
const approvedTorrents = torrents.filter(torrent => torrent.state === Torrent.APPROVED);
```

#### Статические свойства

##### Torrent.APPROVED
Константа для статуса `проверено`.

##### Torrent.NOT_APPROVED
Константа для статуса `не проверено`.

##### Torrent.NEED_EDIT
Константа для статуса `недооформлено`.

##### Torrent.DUBIOUSLY
Константа для статуса `сомнительно`.

##### Torrent.CONSUMED
Константа для статуса `поглощена`.

##### Torrent.TEMPORARY
Константа для статуса `временная`.
