<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="developers">
    <div class="developersHeader">
      <h2>Разработчикам</h2>
    </div>
    <b-tabs pills nav-class="ml-4 mr-4">
      <b-tab title="Руководство" active class="m-4">
        <p>
          Onium предоставляет возможность внешним разработчикам программными средствами получать и записывать данные.
          Для организации взаимодействия необходимо использовать REST API.
        </p>
        <p>
          REST API определяет набор функций, к которым разработчики могут совершать запросы и получать ответы.
          Взаимодействие происходит по протоколу HTTP.
        </p>

        <h4 class="mb-4">Как использовать REST API</h4>
        <b-container class="mb-4">
          <b-row>
            <b-col class="p-0 m-0" cols="2">URL для запросов</b-col>
            <b-col class="p-0 m-0"><a :href="apiUrl" target="_blank">{{ apiUrl }}</a></b-col>
          </b-row>
          <b-row>
            <b-col class="p-0 m-0" cols="2">Кодировка</b-col>
            <b-col class="p-0 m-0">UTF-8</b-col>
          </b-row>
          <b-row>
            <b-col class="p-0 m-0" cols="2">Методы</b-col>
            <b-col class="p-0 m-0">GET / POST / PUT / DELETE</b-col>
          </b-row>
        </b-container>
        <p>
          Все вызовы методов API — это HTTP-запросы с некоторым набором параметров или без них. Выбирайте в
          документации нужный метод, формируете запрос согласно документации метода, и осуществляете этот запрос.
          В ответ на запрос вы получаете его результат, который также описан в документации каждой функции.
        </p>

        <h4 class="mb-4">Авторизация</h4>
        <p>
          Некоторые API-методы доступны только аутентифицированным пользователям. Для доступа к таким методам
          необходимо создать клиента и получить токен доступа. Все запросы к методам, которые доступны только
          аутентифицированным пользователям выполняются с добавлением специального заголовка, который содержит
          ранее полученный токен доступа:
        </p>
        <b-alert show variant="warning">Authorization: Bearer <b><i>[token]</i></b></b-alert>
        <p>
          Данный заголовок идентифицирует пользователя. Его необходимо передавать при каждом запросе к методам,
          которые доступны только аутентифицированным пользователям.
        </p>
        <h4 class="mb-4">Формат ответа</h4>
        <p>
          Все API-методы возвращают ответ в виде JSON-объекта. Ответ всегда содержит свойство <b><i>result</i></b> со
          значением <b><i>success</i></b> или <b><i>error</i></b>. В случае возврата ошибки, в зависимости от метода,
          может быть передана дополнительная информация по ошибке. При успешном выполнении запроса в ответе может
          содержаться дополнительная информация. Смотрите документацию к конкретному методу для получения подробной
          информации по формату ответа.
        </p>
        <b-container class="mb-4">
          <b-row>
            <b-col class="pl-0 pr-4 m-0">
              <b-card header="Пример успешного ответа">
                <code style="white-space: pre-wrap">{
  "result":"success",
  "message":"API is running"
}</code>
              </b-card>
            </b-col>
            <b-col class="p-0 m-0">
              <b-card header="Пример ответа с ошибкой">
                <code style="white-space: pre-wrap">{
  "result":"error",
  "message":"Error code #1"
}</code>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>
      <b-tab title="Справочник">

        <div role="tablist" class="mt-4">

          <div>
            <div v-b-toggle.postUsersAuth role="tab" class="apiHeader">
              <div class="p-4">
                <b-badge variant="success" class="float-right apiMethod">POST</b-badge>
                <div><b>users/auth</b></div>
                <div>Аутентификация пользователя</div>
              </div>
            </div>
            <b-collapse id="postUsersAuth" accordion="my-accordion" role="tabpanel">
              <div class="m-4">
                <p>
                  Получение токена доступа и основной информации о профиле пользователя. Для аутентификации пользователя
                  используется стандартный OAuth-клиент "Onium Service Client".
                </p>
                <p>
                  Использовать этот метод для получения токена доступа следует только в крайних случаях, когда
                  аутентификация через собственного клиента невозможна.
                </p>
              </div>
              <h5 class="p-4 m-0 apiNav">Параметры запроса</h5>
              <b-table hover :items="ref.postUsersAuth" :fields="ref.fields" class="m-0"></b-table>
              <h5 class="p-4 m-0 apiNav">Формат успешного ответа</h5>
<code class="p-4 apiAnswer">{
  "result": "success",
  "token": "wlZWbFhMXkuZAHUQhpXTVL1lrOqNdiojbxQIabVb8FQ",     // Токен доступа
  "profile": {                                                // Информация о профиле пользователя
    "id": "5c50f50093efae6465c08143",                         // ID пользователя
    "phone": "+70000000000",                                  // Телефон пользователя
    "status": "active",                                       // Состояние пользователя
    "type": "realtor",                                        // Тип пользователя
    "name": "Иванов Иван Иванович"                            // Имя пользователя
  }
}</code>
              <h5 class="p-4 m-0 apiNav">Формат ответа с ошибкой</h5>
<code class="p-4 apiAnswer">{
  "result":"error"
}</code>
            </b-collapse>
          </div>

          <div>
            <div v-b-toggle.getUsersInit role="tab" class="apiHeader">
              <div class="p-4">
                <b-badge variant="primary" class="float-right apiMethod">GET</b-badge>
                <div><b-badge variant="warning">A</b-badge>&nbsp;<b>users/init</b></div>
                <div>Инициализация пользователя</div>
              </div>
            </div>
            <b-collapse id="getUsersInit" accordion="my-accordion" role="tabpanel">
              <div class="m-4">
                Получение сводной информации учетной записи пользователя необходимой для инициализации клиентского
                приложения.
              </div>
              <div class="apiNav">
                <b-form-radio-group buttons button-variant="outline-secondary" size="sm" v-model="formatSuccessResponseMode.selected" :options="formatSuccessResponseMode.options" class="float-right apiNavMode"/>
                <h5 class="p-4 m-0">
                  Формат успешного ответа
                </h5>
              </div>
<code v-if="formatSuccessResponseMode.selected === 'seeker'" class="p-4 apiAnswer">{
  "result": "success",
  "init": {
    "cities": [                                         // Список городов
      {
        "_id": "5c50f50093efae6465c08143",              // ID города
        "name": "Москва",                               // Наименование города
        "districts": [                                  // Список районов
          {
            "_id": "5c50f50093efae6465c08267",          // ID района
            "name": "Якиманка"                          // Наименование района
          },
          // Другие районы города
        ],
        "metro": [                                      // Станции метро
          {
            "_id": "5c50f50193efae6465c082fb",          // ID странции метро
            "name": "Аэропорт"                          // Наименование станции метро
          },
          // Другие станции метро
        ]
      },
      // Другие города
    ],
    "requests": [                                       // Список входящих заявок (только для соискателей)
      {
        "_id": "5c5132d18f9c85732474fb4a",              // ID заявки
        "created": "2019-01-30T05:14:57.789Z",          // Дата создания заявки
        "expired": "2019-02-06T05:14:57.000Z",          // Дата автоматического закрытия заявки
        "user": {                                       // Создатель заявки
          "_id": "5c50f50093efae6465c0814e",            // ID соискателя
          "phone": "+70000000000"                       // Телефон соискателя
        },
        "status": "active",                             // Статус заявки [active|archival]
        "type": "flat",                                 // Тип объекта [flat|room]
        "term": "long",                                 // Срок аренды [long|daily]
        "flatRooms": ["1", "2"],                        // Кол-во комнат (только для квартир) [1|2|3|4+|studio|null]
        "roomArea": 30,                                 // Пложадь комнаты кв.м. (только для комнат) [int|null]
        "tenants": "1",                                 // Кол-во жильцов [1|2|3|4+]
        "family": true,                                 // Семья [true|false]
        "children": false,                              // Наличие детей [true|false]
        "animals": false,                               // Наличие животных [true|false]
        "amount": 50000,                                // Стоимость аренды (до)
        "comment": "комментарий",                       // Комментарий в свободной форме
        "city": {                                       // Город
          "_id": "5c50f50093efae6465c08143",            // ID города
          "name": "Москва",                             // Наименование города
        },
        "districts": [                                  // Список районов
          {
            "_id": "5c50f50093efae6465c08267",          // ID района
            "name": "Якиманка"                          // Наименование района
          },
          // Другие районы города
        ],
        "metro": [                                      // Станции метро
          {
            "_id": "5c50f50193efae6465c082fb",          // ID странции метро
            "name": "Аэропорт"                          // Наименование станции метро
          },
          // Другие станции метро
        ],
        "responses": [                                  // Ответы на заявку
          {
            "_id": "5c50f50093efae6465c08267",          // ID ответа
            "created": "2019-01-30T05:14:57.789Z",      // Дата создания ответа
            "seen": true                                // Состояние просмотра ответа [true|false]
          },
          // Другие ответы
        ]
      },
      // Другие входящие заявки
    ],
    "events": [                                         // Список событий
      {
        "created": "2019-01-30T05:14:57.789Z",          // Дата события
        "type": "moveActiveIncomingRequestToArchive",   // Тип события [moveActiveIncomingRequestToArchive]
        "id": "5c50f50193efae6465c082fb",               // ID объекта связанного с событием
        "seen": false                                   // Состояние просмотра события [true|false]
      }
    ]
  }
}</code>
<code v-if="formatSuccessResponseMode.selected === 'realtor'" class="p-4 apiAnswer">{
  "result": "success",
  "init": {
    "cities": [                                         // Список городов
      {
        "_id": "5c50f50093efae6465c08143",              // ID города
        "name": "Москва",                               // Наименование города
        "districts": [                                  // Список районов
          {
            "_id": "5c50f50093efae6465c08267",          // ID района
            "name": "Якиманка"                          // Наименование района
          },
          // Другие районы города
        ],
        "metro": [                                      // Станции метро
          {
            "_id": "5c50f50193efae6465c082fb",          // ID странции метро
            "name": "Аэропорт"                          // Наименование станции метро
          },
          // Другие станции метро
        ]
      },
      // Другие города
    ],
    "requests": [                                       // Список входящих заявок (только для соискателей)
      {
        "_id": "5c5132d18f9c85732474fb4a",              // ID заявки
        "created": "2019-01-30T05:14:57.789Z",          // Дата создания заявки
        "expired": "2019-02-06T05:14:57.000Z",          // Дата автоматического закрытия заявки
        "user": {                                       // Создатель заявки
          "_id": "5c50f50093efae6465c0814e",            // ID соискателя
          "phone": "+70000000000"                       // Телефон соискателя
        },
        "status": "active",                             // Статус заявки [active|archival]
        "type": "flat",                                 // Тип объекта [flat|room]
        "term": "long",                                 // Срок аренды [long|daily]
        "flatRooms": ["1", "2"],                        // Кол-во комнат (только для квартир) [1|2|3|4+|studio|null]
        "roomArea": 30,                                 // Пложадь комнаты кв.м. (только для комнат) [int|null]
        "tenants": "1",                                 // Кол-во жильцов [1|2|3|4+]
        "family": true,                                 // Семья [true|false]
        "children": false,                              // Наличие детей [true|false]
        "animals": false,                               // Наличие животных [true|false]
        "amount": 50000,                                // Стоимость аренды (до)
        "comment": "комментарий",                       // Комментарий в свободной форме
        "city": {                                       // Город
          "_id": "5c50f50093efae6465c08143",            // ID города
          "name": "Москва",                             // Наименование города
        },
        "districts": [                                  // Список районов
          {
            "_id": "5c50f50093efae6465c08267",          // ID района
            "name": "Якиманка"                          // Наименование района
          },
          // Другие районы города
        ],
        "metro": [                                      // Станции метро
          {
            "_id": "5c50f50193efae6465c082fb",          // ID странции метро
            "name": "Аэропорт"                          // Наименование станции метро
          },
          // Другие станции метро
        ],
        "responses": [                                  // Ответы на заявку
          {
            "_id": "5c50f50093efae6465c08267",          // ID ответа
            "created": "2019-01-30T05:14:57.789Z",      // Дата создания ответа
            "seen": true                                // Состояние просмотра ответа [true|false]
          },
          // Другие ответы
        ]
      },
      // Другие входящие заявки
    ],
    "events": [                                         // Список событий
      {
        "created": "2019-01-30T05:14:57.789Z",          // Дата события
        "type": "moveActiveIncomingRequestToArchive",   // Тип события [moveActiveIncomingRequestToArchive]
        "id": "5c50f50193efae6465c082fb",               // ID объекта связанного с событием
        "seen": false                                   // Состояние просмотра события [true|false]
      }
    ]
  }
}</code>
              <h5 class="p-4 m-0 apiNav">Формат ответа с ошибкой</h5>
<code class="p-4 apiAnswer">{
  "result":"error"
}</code>
            </b-collapse>
          </div>

          <div>
            <div v-b-toggle.postRequest role="tab" class="apiHeader">
              <div class="p-4">
                <b-badge variant="success" class="float-right apiMethod">POST</b-badge>
                <div><b-badge variant="warning">A</b-badge>&nbsp;<b>requests</b></div>
                <div>Создание заявки</div>
              </div>
            </div>
            <b-collapse id="postRequest" accordion="my-accordion" role="tabpanel">
              <div class="m-4">
                Создание новой заявки на подбор объекта недвижимости. Данный метод доступен только для соискателей.
                Для риелторов данный метод будет всегда возвращать ошибку.
              </div>
              <h5 class="p-4 m-0 apiNav">Параметры запроса</h5>
              <b-table hover :items="ref.postRequest" :fields="ref.fields" class="m-0"></b-table>
              <h5 class="p-4 m-0 apiNav">
                Формат успешного ответа
              </h5>
<code class="p-4 apiAnswer">{
  "result": "success",
  "outgoingRequest": {                                    // Информация по исходящей заявке
    "_id": "5c52f682b78c40141a5dd00f",                    // ID заявки
    "created": "2019-01-31T13:22:10.779Z",                // Дата создания заявки
    "expired": "2019-02-07T13:22:10.000Z",                // Дата автоматического закрытия заявки
    "user": "5c50f50093efae6465c0814e",                   // ID пользователя
    "status": "active",                                   // Статус заявки [active|archival]
    "type": "flat",                                       // Тип объекта [flat|room]
    "term": "long",                                       // Срок аренды [long|daily]
    "flatRooms": [                                        // Кол-во комнат (только для квартир) [1|2|3|4+|studio|null]
      "1",
      "2",
      "studio"
    ],
    "roomArea": 0,                                        // Пложадь комнаты кв.м. (только для комнат) [int|null]
    "tenants": "2",                                       // Кол-во жильцов [1|2|3|4+]
    "children": false,                                    // Наличие детей [true|false]
    "animals": true,                                      // Наличие животных [true|false]
    "family": true,                                       // Семья [true|false]
    "amount": 50000,                                      // Стоимость аренды (до)
    "comment": "комментарий",                             // Комментарий в свободной форме
    "city": "5c50f50093efae6465c08143",                   // ID города
    "districts": [                                        // Список ID районов
      "5c50f50193efae6465c082e2",
      "5c50f50193efae6465c08299",
      "5c50f50093efae6465c08276"
    ],
    "metro": [                                            // Список ID станций метро
      "5c50f50193efae6465c0837a",
      "5c50f50193efae6465c08361",
      "5c50f50193efae6465c0832f"
    ],
  }
}</code>
              <h5 class="p-4 m-0 apiNav">Формат ответа с ошибкой</h5>
<code class="p-4 apiAnswer">{
  "result": "error"
}</code>
            </b-collapse>
          </div>
        </div>

      </b-tab>
      <b-tab title="Клиенты">
        Управление OAuth клиентами
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: 'developers',
  data() {
    return {
      apiUrl: process.env.VUE_APP_SERVER_URL + '/api/v' + process.env.VUE_APP_API_VERSION,
      ref: {
        fields: [
          {
            key: 'name',
            label: 'Имя'
          },
          {
            key: 'type',
            label: 'Тип'
          },
          {
            key: 'descr',
            label: 'Описание'
          }
        ],
        postUsersAuth: [
          { name: 'phone', type: 'integer', descr: 'Телефон (без "+7")' },
          { name: 'password', type: 'string', descr: 'Пароль' }
        ],
        postRequest: [
          { name: 'term', type: 'enum[long, daily]', descr: 'Срок аренды' },
          { name: 'type', type: 'enum[flat, room]', descr: 'Тип объекта' },
          { name: 'flatRooms', type: 'array(enum[1, 2, 3, 4+, studio])', descr: 'Кол-во конат (только для квартиры)' },
          { name: 'roomArea', type: 'integer', descr: 'Площадь конаты (только для конаты)' },
          { name: 'tenants', type: 'enum[1, 2, 3, 4+]', descr: 'Кол-во жильцов' },
          { name: 'family', type: 'bool', descr: 'Семья' },
          { name: 'children', type: 'bool', descr: 'Наличие детей' },
          { name: 'animals', type: 'bool', descr: 'Наличие животных' },
          { name: 'amount', type: 'integer', descr: 'Сумма аренды' },
          { name: 'city', type: 'string', descr: 'ID города' },
          { name: 'districts', type: 'array(string)', descr: 'Список ID районов' },
          { name: 'metro', type: 'array(string)', descr: 'Список ID метро' },
          { name: 'comment', type: 'string', descr: 'Комментарий в свободной форме' }
        ]
      },
      formatSuccessResponseMode: {
        selected: 'seeker',
        options: [
          { text: 'Риелтор', value: 'realtor' },
          { text: 'Соискатель', value: 'seeker' }
        ]
      }
    }
  }
}
</script>

<style scoped>
  .developersHeader {
    padding: 25px;
  }
  .apiHeader {
    cursor: pointer;
    border-top: 1px solid #e3e3e3;
  }
  .apiHeader:hover {
    background: #f5f5f5;
  }
  .apiHeader:not(.collapsed) {
    background: #fff4a9;
  }
  .apiMethod {
    margin-top: 10px;
    font-size: 18px;
  }
  .apiAnswer {
    white-space: pre-wrap;
    border-top: 1px solid #e3e3e3;
    display: block;
  }
  .apiNav {
    background: #f5f5f5;
  }
  .apiNavMode {
    margin: 5px;
  }
</style>
