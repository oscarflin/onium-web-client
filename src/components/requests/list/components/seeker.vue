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
    <b-alert
      v-if="archiveRequestSuccess"
      show
      variant="success"
      class="archiveRequestSuccessAlert"
    >
      Заявка успешно перемещена в архив
    </b-alert>
    <div class="requestsHeader">
      <b-button
        :to="{ name: 'addRequest' }"
        variant="outline-danger"
        class="float-right"
      >
        Создать заявку
      </b-button>
      <h2>Управление заявками</h2>
    </div>
    <b-tabs pills nav-class="ml-4 mr-4">
      <b-tab title="Активные" class="requestsTab" active>
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
            :class="{
              'new': request.responses.new
            }"
          >
            <b-button
              v-show="showRequestNavByIndex === request"
              @click.stop="archiveRequestAction(request)"
              variant="outline-danger"
              class="float-right m-2"
            >
              Архивировать
            </b-button>
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
                  :variant="request.responses.new ? 'success' : 'light'"
                >
                  <span v-if="!request.responses.new">{{ request.responses.total }}</span><span v-if="request.responses.new">+{{ request.responses.new }}</span>
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
            :class="{
              'new': request.responses.new
            }"
          >
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
                  :variant="request.responses.new ? 'success' : 'light'"
                >
                  <span v-if="!request.responses.new">{{ request.responses.total }}</span><span v-if="request.responses.new">+{{ request.responses.new }}</span>
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
  import {
    REQUESTS_ARCHIVE
  } from '../../../../store/actions/requests'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../../../store/actions/utils'

  export default {
    name: 'requestsType',
    data() {
      return {
        error: false,
        archiveRequestSuccess: false,
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
      archiveRequestAction: function(request) {
        this.error = false;
        this.archiveRequestSuccess = false;

        this.$store.dispatch(UTILS_PROCESSING_BEGIN);

        this.$store.dispatch(REQUESTS_ARCHIVE, request.id)
          .then(() => {
            this.archiveRequestSuccess = true;
            this.$store.dispatch(UTILS_PROCESSING_END);
          })
          .catch(() => {
            this.error = 'В процессе архивирования заявки произошла ошибка. Повторите попытку через несколько минут.';
            this.$store.dispatch(UTILS_PROCESSING_END);
          });
      }
    },
    computed: {
      requests: function () {
        let requests = {
          active: [],
          archival: []
        };

        this.$store.getters.requests.forEach(function(request) {
          let description = [];

          switch (request.type) {
            case 'flat':
              description.push('Квартира');

              let flatRooms = [];

              request.flatRooms.forEach(function(flatRoom) {
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

              if (request.roomArea) {
                description.push('от ' + request.roomArea + ' м2');
              }
              break;
          }

          switch (request.term) {
            case 'long':
              description.push('длительно');
              break;
            case 'daily':
              description.push('посуточно');
              break;
          }

          description.push('для ' + request.tenants + ' чел.');

          if (request.family) {
            description.push('(семья)');
          }

          let additional = [];

          if (request.children) {
            additional.push('детьми');
          }

          if (request.animals) {
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

          let requestItem = {
            id: request._id,
            expired: request.expired,
            amount: request.amount,
            city: request.city.name,
            description: description.join(' '),
            userPhoto: process.env.VUE_APP_SERVER_URL + '/users/photo/' + request.user._id,
            responses: {
              total: request.responses.length,
              new: newResponses
            }
          };

          requests[request.status].push(requestItem);
        });

        return requests;
      }
    }
  }
</script>

<style scoped>
  .errorAlert,
  .archiveRequestSuccessAlert {
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
