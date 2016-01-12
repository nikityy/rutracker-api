# Rutracker API для Node.js
Данный модуль позволяет искать по раздачам трекера Rutracker.org. Поскольку поиск запрещён для незарегистрированных пользователей, также поддерживаетcя и авторизация.

## Установка
Установите пакет в нужную директорию с помощью ```npm install rutracker-api``` (предполагается, что Node.js и пакетный менеждер npm у вас уже установлены). После установки модуля и загрузки его зависимостей, Rutracker API готов к использованию.

## Использование
В первую очередь необходимо скопировать папку с Rutracker API в ваш проект. Далее, подключите модуль в нужном вам JS-файле:

```js
var RutrackerApi = require('./rutracker-api');
```

Следующий этап — авторизация приложения. Сделать это можно непосредственно при вызове конструктора, либо позже — с помощью метода объекта ```login```.

```js
var username = 'username',
    password = 'password';

// Вариант №1: при вызове конструктора
var rutracker = new RutrackerApi({
	username: username, 
	password: password
});

// Вариант №2: с помощью метода 'login'
var rutracker = new RutrackerApi();
rutracker.login(username, password);
```

Помните, что для синхронизации вы можете использовать событие ```login```. После того, как приложение получило токен, мы можем начать искать раздачи. Поиск осуществляется через метод ```search```:

```js
var query = "YOUR QUERY HERE",
	callback = function(data) {
		console.log(data);
	};

rutracker.search(query, callback);
```

В callback будет передан объект вида:
```js
[
	{ 
		state: 'проверено',
    	category: 'CATEGORY_NAME',
    	title: 'TITLE',
    	author: 'AUTHOR_NAME',
    	size: '1.46GB',
    	seeds: '7123',
    	leechs: '275',
    	url: 'rutracker.org/forum/viewtopic.php?t=XXXXXX' 
    }, ...
]
```

Парсинг осуществляется с помощью метода ```parseSearch```. При желании можно сделать так, чтобы в callback передавалась сырая HTML-страница. Для этого свойству ```rutracker.parseData``` нужно присвоить значение ```false```. 

## События
### login
Срабатывает при успешной авторизации приложения. 
