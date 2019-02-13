<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="requestsType">
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <div class="requestsHeader">
      <b-button
        :to="{ name: 'settings' }"
        variant="outline-danger"
        class="float-right"
      >
        Настройки
      </b-button>
      <h2>Управление заявками</h2>
    </div>
    <b-tabs pills nav-class="ml-4 mr-4">
      <b-tab title="Входящие" class="requestsTab" active>
        <b-alert v-if="!requests.incoming.length" show variant="warning" class="m-4">Заявки не найдены</b-alert>
        <ul class="requestsList">
          <b-media
            @click="viewRequest(request)"
            @mouseover="showRequestNavByIndex = request"
            @mouseout="showRequestNavByIndex = null"
            v-for="request in requests.incoming"
            :key="request.id"
            tag="li"
            class="requestItem"
            :class="{
              'new': !request.seen
            }"
          >
            <div class="float-right">
              <b-dropdown
                v-show="showRequestNavByIndex === request"
                right
                text="Действия"
                variant="outline-primary"
                class="m-2 down-right"
              >
                <b-dropdown-item @click.stop="addResponse(request)">Ответить</b-dropdown-item>
                <b-dropdown-item @click.stop="sendMessage(request)">Написать</b-dropdown-item>
              </b-dropdown>
            </div>
            <b-img
              :src="request.userPhoto"
              rounded="circle"
              slot="aside"
              width="64"
              height="64"
            />
            <p class="text-muted requestCity">{{ request.city }}</p>
            <h5 class="mt-0 mb-0">{{ request.description }}</h5>
            <b-badge variant="light" class="requestAmount">до {{ request.amount }} руб.</b-badge>
            <p class="text-muted requestExpired">{{ request.expired }}</p>
          </b-media>
        </ul>
      </b-tab>
      <b-tab title="В работе" class="requestsTab">
        <b-alert v-if="!requests.active.length" show variant="warning" class="m-4">Заявки не найдены</b-alert>
        <ul class="requestsList">
          <b-media
            @click="viewRequest(request)"
            @mouseover="showRequestNavByIndex = request"
            @mouseout="showRequestNavByIndex = null"
            v-for="request in requests.active"
            :key="request.id"
            tag="li"
            class="requestItem"
          >
            <div class="float-right">
              <b-dropdown
                v-show="showRequestNavByIndex === request"
                id="down-right"
                right
                text="Действия"
                variant="outline-primary"
                class="m-2"
              >
                <b-dropdown-item @click.stop="addResponse(request)">Ответить</b-dropdown-item>
                <b-dropdown-item @click.stop="sendMessage(request)">Написать</b-dropdown-item>
              </b-dropdown>
            </div>
            <div slot="aside">
              <b-img
                :src="request.userPhoto"
                rounded="circle"
                width="64"
                height="64"
              />
              <div
                v-if="request.responses.total"
                class="requestResponses"
              >
                <b-badge
                  class="requestResponsesBadge"
                  variant="light"
                >
                  <span v-if="request.responses.new">{{ request.responses.total - request.responses.new }} / </span>{{ request.responses.total }}
                </b-badge>
              </div>
            </div>
            <p class="text-muted requestCity">{{ request.city }}</p>
            <h5 class="mt-0 mb-0">{{ request.description }}</h5>
            <b-badge variant="light" class="requestAmount">до {{ request.amount }} руб.</b-badge>
            <p class="text-muted requestExpired">{{ request.expired }}</p>
          </b-media>
        </ul>
      </b-tab>
      <b-tab title="Архивные" class="requestsTab">
        <b-alert v-if="!requests.archival.length" show variant="warning" class="m-4">Заявки не найдены</b-alert>
        <ul class="requestsList">
          <b-media
            @click="viewRequest(request)"
            @mouseover="showRequestNavByIndex = request"
            @mouseout="showRequestNavByIndex = null"
            v-for="request in requests.archival"
            :key="request.id"
            tag="li"
            class="requestItem"
          >
            <div class="float-right">
              <b-dropdown
                v-show="showRequestNavByIndex === request"
                id="down-right"
                right
                text="Действия"
                variant="outline-primary"
                class="m-2"
              >
                <b-dropdown-item @click.stop="sendMessage(request)">Написать</b-dropdown-item>
              </b-dropdown>
            </div>
            <div slot="aside">
              <b-img
                :src="request.userPhoto"
                rounded="circle"
                width="64"
                height="64"
              />
              <div
                v-if="request.responses.total"
                class="requestResponses"
              >
                <b-badge
                  class="requestResponsesBadge"
                  variant="light"
                >
                  <span v-if="request.responses.new">{{ request.responses.total - request.responses.new }} / </span>{{ request.responses.total }}
                </b-badge>
              </div>
            </div>
            <p class="text-muted requestCity">{{ request.city }}</p>
            <h5 class="mt-0 mb-0">{{ request.description }}</h5>
            <b-badge variant="light" class="requestAmount">до {{ request.amount }} руб.</b-badge>
            <p class="text-muted requestExpired">{{ request.expired }}</p>
          </b-media>
        </ul>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
  export default {
    name: 'requestsType',
    data() {
      return {
        error: false,
        showRequestNavByIndex: null
      }
    },
    methods: {
      viewRequest: function(request) {
        this.$router.push({
          name: 'viewRequest',
          params: {
            id: request.id
          }
        });
      },
      addResponse: function(request) {
        this.$router.push({
          name: 'addRequestResponse',
          params: {
            id: request.id
          }
        });
      },
      sendMessage: function(request) {
        console.log('sendMessage');
        console.log(request.id);
      }
    },
    computed: {
      requests: function () {
        let requests = {
          incoming: [],
          active: [],
          archival: []
        };

        this.$store.getters.requests.forEach(function(request) {
          let description = [];
          let flatRooms = [];

          switch (request.outgoingRequest.type) {
            case 'flat':
              description.push('Квартира');

              request.outgoingRequest.flatRooms.forEach(function(flatRoom) {
                switch (flatRoom) {
                  case '1':
                    flatRooms.push('1-комн.');
                    break;
                  case '2':
                    flatRooms.push('2-комн.');
                    break;
                  case '3':
                    flatRooms.push('3-комн.');
                    break;
                  case '4+':
                    flatRooms.push('4+ комн.');
                    break;
                  case 'studio':
                    flatRooms.push('студия');
                    break;
                }
              });

              description.push(flatRooms.join('/'));
              break;
            case 'room':
              description.push('Комната');

              if (request.outgoingRequest.roomArea) {
                description.push('от ' + request.outgoingRequest.roomArea + ' м2');
              }
              break;
          }

          switch (request.outgoingRequest.term) {
            case 'long':
              description.push('длительно');
              break;
            case 'daily':
              description.push('посуточно');
              break;
          }

          description.push('для ' + request.outgoingRequest.tenants + ' чел.');

          if (request.outgoingRequest.family) {
            description.push('(семья)');
          }

          let additional = [];

          if (request.outgoingRequest.children) {
            additional.push('детьми');
          }

          if (request.outgoingRequest.animals) {
            additional.push('животными');
          }

          if (additional.length) {
            description.push('c ' + additional.join(' и '));
          }

          let newResponses = 0;

          request.responses.forEach(function(response) {
            if (!response.seen) {
              newResponses ++;
            }
          });

          requests[request.status].push({
            id: request._id,
            seen: request.seen,
            expired: request.outgoingRequest.expired,
            amount: request.outgoingRequest.amount,
            city: request.outgoingRequest.city.name,
            description: description.join(' '),
            userPhoto: process.env.VUE_APP_SERVER_URL + '/users/photo/' + request.outgoingRequest.user._id,
            responses: {
              total: request.responses.length,
              new: newResponses
            }
          });
        });

        return requests;
      }
    }
  }
</script>

<style scoped>
  .errorAlert {
    border-radius: 0 !important;
    margin: 0;
  }
  .requestsHeader {
    padding: 25px;
  }
  .requestsTab {
    margin: 25px 0 0 0;
  }
  .requestsList {
    margin: 0;
    padding: 0;
  }
  .requestItem {
    padding: 15px 20px;
    border-top: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .requestItem:hover {
    background: #f5f5f5;
  }
  .requestItem.new {
    background: #eaf5ff;
  }
  .requestResponses {
    text-align: center;
    margin-top: 5px;
  }
  .requestResponsesBadge {
    font-size: 16px;
    margin: 5px 0;
    padding: 7px;
  }
  .requestAmount {
    font-size: 14px;
    font-weight: normal;
    border: 1px solid #e3e3e3;
    margin: 5px 0;
    padding: 8px;
  }
  .requestCity,
  .requestExpired {
    font-size: 13px;
    margin: 0;
  }
</style>
