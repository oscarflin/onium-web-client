<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="requestTypeView">
    <b-alert
      v-if="initError"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ initError }}
    </b-alert>
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <template v-if="!initError">
      <div class="requestHeader">
        <b-button v-if="display.archiveAction" @click="archiveRequest" variant="outline-danger" class="float-right">Архивировать</b-button>
        <h2>Просмотр заявки</h2>
      </div>
      <b-tabs
        pills
        nav-class="ml-4 mr-4"
      >
        <b-tab
          title="Подробности"
          class="requestTab"
          active
        >
          <b-container>
            <b-row>
              <b-col>
                <b-container class="mb-4">
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Статус
                    </b-col>
                    <b-col class="requestCol">{{ this.request.status }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Дата создания
                    </b-col>
                    <b-col class="requestCol">{{ this.request.created }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Срок
                    </b-col>
                    <b-col class="requestCol">{{ this.request.term }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Тип</b-col>
                    <b-col class="requestCol">{{ this.request.type }}</b-col>
                  </b-row>
                  <b-row
                    class="requestRow"
                    v-if="this.display.flatRooms">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Кол-во комнат
                    </b-col>
                    <b-col class="requestCol">{{ this.request.flatRooms.join(' / ') }}</b-col>
                  </b-row>
                  <b-row
                    class="requestRow"
                    v-if="this.display.roomArea"
                  >
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Площадь комнаты
                    </b-col>
                    <b-col class="requestCol">от {{ this.request.roomArea }} м<sup>2</sup></b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Кол-во жильцов
                    </b-col>
                    <b-col class="requestCol">{{ request.tenants }} чел. <span v-if="request.family">(семья)</span></b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Дети
                    </b-col>
                    <b-col class="requestCol">{{ request.children ? 'есть' : 'нет' }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Живтоные
                    </b-col>
                    <b-col class="requestCol">{{ request.animals ? 'есть' : 'нет' }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Стоимость
                    </b-col>
                    <b-col class="requestCol">{{ request.amount }}</b-col>
                  </b-row>
                  <b-row class="requestRow">
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Город
                    </b-col>
                    <b-col class="requestCol">{{ request.city }}</b-col>
                  </b-row>
                  <b-row
                    class="requestRow"
                    v-if="request.districts.length"
                  >
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Районы
                    </b-col>
                    <b-col class="requestCol">{{ request.districts.join(' / ') }}</b-col>
                  </b-row>
                  <b-row
                    class="requestRow"
                    v-if="request.metro.length"
                  >
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Метро
                    </b-col>
                    <b-col class="requestCol">{{ request.metro.join(' / ') }}</b-col>
                  </b-row>
                  <b-row
                    class="requestRow"
                    v-if="request.comment"
                  >
                    <b-col
                      class="requestCol"
                      cols="4"
                    >
                      Комментарий
                    </b-col>
                    <b-col
                      class="requestCol"
                      style="white-space: pre-wrap"
                    >{{ request.comment }}</b-col>
                  </b-row>
                </b-container>
              </b-col>
              <b-col cols="4">
                <b-card class="mr-3">
                  <b-media>
                    <b-img
                      :src="request.user.photo"
                      rounded="circle"
                      slot="aside"
                      height="64"
                      width="64"
                    />
                    <h5 class="mt-0 mb-1">{{ request.user.name }}</h5>
                    {{ request.user.phone }}
                  </b-media>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>
        <b-tab
          :title-link-class="{ update_trigger_hack: request.realtorsResponses }"
          class="requestTab"
        >
          <template slot="title">
            Ответы
            <b-badge
              v-if="realtorsResponses.total"
              variant="primary"
            >
              <span v-if="!realtorsResponses.new">{{ realtorsResponses.total }}</span><span v-if="realtorsResponses.new">+{{ realtorsResponses.new }}</span>
            </b-badge>
          </template>
          <b-alert
            v-if="!Object.keys(realtorsResponses.realtors).length"
            show
            variant="warning"
            class="m-4"
          >
            Ответы не найдены
          </b-alert>
          <div
            v-for="(realtor, index) in realtorsResponses.realtors"
            :key="realtor.id"
          >
            <b-media
              v-b-toggle="'accordion-' + index"
              tag="li"
              @mouseover="showRealtorNavByIndex = realtor"
              @mouseout="showRealtorNavByIndex = null"
              class="realtorItem"
              :class="{
              'new': realtor.new
            }"
            >
              <b-button
                v-show="showRealtorNavByIndex === realtor"
                @click.stop="sendMessage(realtor)"
                variant="outline-danger"
                class="float-right m-2"
              >
                Написать
              </b-button>
              <b-img
                :src="realtor.user.photo"
                rounded="circle"
                slot="aside"
                height="64"
                width="64"
              />
              <h5 class="mt-0 mb-1">{{ realtor.user.name }}</h5>
              <p class="text-muted realtorPhone">{{ realtor.user.phone }}</p>
              <b-badge
                class="realtorResponsesBadge"
                :variant="realtor.new ? 'success' : 'light'"
              >
                <span v-if="!realtor.new">{{ realtor.total }}</span><span v-if="realtor.new">+{{ realtor.new }}</span>
              </b-badge>
            </b-media>
            <b-collapse :id="'accordion-' + index" accordion="responsesAccordion" role="tabpanel">
              <ul class="responsesList">
                <b-media
                  @click="viewResponse(response)"
                  v-for="response in realtor.responses"
                  :key="response.id"
                  tag="li"
                  class="responseItem"
                  :class="{
              'new': !response.seen
            }"
                >
                  <template slot="aside">
                    <b-badge
                      v-if="response.photo.count"
                      class="responsePhotoCounter"
                      variant="success"
                    >
                      {{ response.photo.count }}
                    </b-badge>
                    <img
                      v-if="response.photo.url"
                      :src="response.photo.url"
                      rounded="rounded"
                      width="64"
                      height="64"
                    />
                    <img
                      v-if="!response.photo.url"
                      src="../../../../assets/responsePhoto.png"
                      rounded="rounded"
                      width="64"
                      height="64"
                    />
                  </template>
                  <p class="text-muted responseCity">{{ response.city.name }}</p>
                  <h5 class="mt-0 mb-0">{{ response.description }}</h5>
                  <b-badge variant="light" class="responseAmount">Аренда {{ response.amount }}</b-badge>
                  <b-badge variant="light" class="responseCommission">Комиссия {{ response.commission.value }}% ({{ response.commission.sum }} руб.)</b-badge>
                  <b-badge variant="light" class="responseDeposit">Залог {{ response.deposit.value }}% ({{ response.deposit.sum }} руб.)</b-badge>
                  <p class="text-muted responseCreated">{{ response.created }}</p>
                </b-media>
              </ul>
            </b-collapse>
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </div>
</template>

<script>
  import {
    REQUESTS_FETCH,
    REQUESTS_ARCHIVE
  } from '../../../../store/actions/requests'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../../../store/actions/utils'

  export default {
    name: 'requestsTypeView',
    data() {
      return {
        initError: false,
        error: false,
        rawRequest: null,
        showRealtorNavByIndex: null
      }
    },
    methods: {
      archiveRequest: function() {
        this.error = false;

        this.$store.dispatch(UTILS_PROCESSING_BEGIN);

        this.$store.dispatch(REQUESTS_ARCHIVE, this.$route.params.id)
          .then(() => {
            this.$router.push({
              name: 'requests',
              params: {
                eventArchived: true
              }
            });

            this.$store.dispatch(UTILS_PROCESSING_END);
          })
          .catch(() => {
            this.error = 'В процессе архивирования заявки произошла ошибка. Повторите попытку через несколько минут.';
            this.$store.dispatch(UTILS_PROCESSING_END);
          });
      },
      sendMessage: function(realtor) {
        console.log('sendMessage');
        console.log(realtor);
      },
      viewResponse: function(response) {
        this.$router.push({
          name: 'viewRequestResponse',
          params: {
            id: response.id
          }
        });
      }
    },
    computed: {
      request: function () {
        let request = {
          user: {
            photo: null,
            name: null
          },
          status: null,
          created: null,
          term: null,
          type: null,
          flatRooms: [],
          roomArea: null,
          tenants: null,
          family: null,
          children: null,
          animals: null,
          amount: null,
          city: null,
          districts: [],
          metro: [],
          comment: null,
          responses: {
            total: 0,
            new: 0,
            list: []
          }
        };

        if (this.rawRequest === null) {
          return request;
        }

        let rawRequest = this.rawRequest;
        let newResponses = 0;
        let listResponses = [];

        this.rawRequest.responses.forEach(function(response) {
          if (!response.seen) {
            newResponses ++;
          }

          let amount = null;

          switch (rawRequest.term) {
            case 'long':
              amount = response.amount + ' руб./мес.';
              break;
            case 'daily':
              amount = response.amount + ' руб./сут.';
              break;
          }

          let description = [];

          switch (rawRequest.type) {
            case 'flat':
              switch (response.flatRooms) {
                case '1':
                  description.push('1-комн. квартира');
                  break;
                case '2':
                  description.push('2-комн. квартира');
                  break;
                case '3':
                  description.push('3-комн. квартира');
                  break;
                case '4+':
                  description.push('4+ комн. квартира');
                  break;
                case 'studio':
                  description.push('Квартира-студия');
                  break;
              }
              break;
            case 'room':
              description.push('Комната');

              if (response.roomArea) {
                description.push(response.roomArea + ' м2');
              }
              break;
          }

          let photo = [];

          response.photo.forEach(function(photoId) {
            photo.push(process.env.VUE_APP_SERVER_URL + '/requests/responses/photo/' + photoId);
          });

          listResponses.push({
            id: response._id,
            seen: response.seen,
            created: response.created,
            amount: amount,
            commission: {
              value: response.commission,
              sum: (response.amount / 100) * response.commission
            },
            deposit: {
              value: response.deposit,
              sum: (response.amount / 100) * response.deposit
            },
            city: response.city.name,
            description: description.join(' '),
            photo: {
              url: photo.length ? photo[0] : null,
              count: photo.length
            }
          });
        });

        request.responses = {
          total: this.rawRequest.responses.length,
          new: newResponses,
          list: listResponses
        };

        switch (this.rawRequest.status) {
          case 'active':
            request.status = 'активная';
            break;
          case 'archival':
            request.status = 'архивная';
            break;
          case 'rejected':
            request.status = 'отклоненная';
            break;
        }

        switch (this.rawRequest.term) {
          case 'long':
            request.term = 'длительно';
            break;
          case 'daily':
            request.term = 'посуточно';
            break;
        }

        switch (this.rawRequest.type) {
          case 'flat':
            request.type = 'квартира';
            let flatRooms = [];

            this.rawRequest.flatRooms.forEach(function(flatRoom) {
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

            request.flatRooms = flatRooms;
            break;
          case 'room':
            request.type = 'комната';
            if (this.rawRequest.roomArea) {
              request.roomArea = this.rawRequest.roomArea;
            }
            break;
        }

        request.created = this.rawRequest.created;
        request.comment = this.rawRequest.comment;
        request.tenants = this.rawRequest.tenants;
        request.family = (this.rawRequest.family);
        request.children = (this.rawRequest.children);
        request.animals = (this.rawRequest.animals);

        let amountPeriod = this.rawRequest.term === 'long' ? 'мес.' : 'сут.';

        if (this.rawRequest.amount === 150000) {
          request.amount = 'от ' + this.rawRequest.amount + ' руб./' + amountPeriod;
        } else {
          request.amount = 'до ' + this.rawRequest.amount + ' руб./' + amountPeriod;
        }

        request.city = this.rawRequest.city.name;

        let districtsList = [];

        this.rawRequest.districts.forEach(function(district) {
          districtsList.push(district.name);
        });

        request.districts = districtsList;

        let metroList = [];

        this.rawRequest.metro.forEach(function(metro) {
          metroList.push(metro.name);
        });

        request.metro = metroList;

        request.user = {
          photo: process.env.VUE_APP_SERVER_URL + '/users/photo/' + this.rawRequest.user._id,
          name: this.rawRequest.user.name,
          phone: this.rawRequest.user.phone
        };

        return request;
      },
      realtorsResponses: function() {
        let realtorsResponses = {
          total: 0,
          new: 0,
          realtors: []
        };

        if (this.rawRequest === null) {
          return realtorsResponses;
        }

        let rawRequest = this.rawRequest;
        let totalResponses = 0;
        let newResponses = 0;
        let listRealtorsResponses = {};

        this.rawRequest.responses.forEach(function(response) {
          totalResponses ++;

          if (!response.seen) {
            newResponses ++;
          }

          let amount = null;

          switch (rawRequest.term) {
            case 'long':
              amount = response.amount + ' руб./мес.';
              break;
            case 'daily':
              amount = response.amount + ' руб./сут.';
              break;
          }

          let description = [];

          switch (rawRequest.type) {
            case 'flat':
              switch (response.flatRooms) {
                case '1':
                  description.push('1-комн. квартира');
                  break;
                case '2':
                  description.push('2-комн. квартира');
                  break;
                case '3':
                  description.push('3-комн. квартира');
                  break;
                case '4+':
                  description.push('4+ комн. квартира');
                  break;
                case 'studio':
                  description.push('Квартира-студия');
                  break;
              }
              break;
            case 'room':
              description.push('Комната');

              if (response.roomArea) {
                description.push(response.roomArea + ' м2');
              }
              break;
          }

          let photo = [];

          response.photo.forEach(function(photoId) {
            photo.push(process.env.VUE_APP_SERVER_URL + '/requests/responses/photo/' + photoId);
          });

          const realtorResponse = {
            id: response._id,
            seen: response.seen,
            created: response.created,
            amount: amount,
            commission: {
              value: response.commission,
              sum: (response.amount / 100) * response.commission
            },
            deposit: {
              value: response.deposit,
              sum: (response.amount / 100) * response.deposit
            },
            city: response.city.name,
            description: description.join(' '),
            photo: {
              url: photo.length ? photo[0] : null,
              count: photo.length
            }
          };

          if (typeof listRealtorsResponses[response.user.realtor._id] === 'undefined') {
            listRealtorsResponses[response.user.realtor._id] = {
              user: {
                id: response.user.realtor._id,
                photo: process.env.VUE_APP_SERVER_URL + '/users/photo/' + response.user.realtor._id,
                phone: response.user.realtor.phone,
                name: response.user.realtor.name
              },
              total: 0,
              new: 0,
              responses: [realtorResponse]
            };
          } else {
            listRealtorsResponses[response.user.realtor._id].responses.push(realtorResponse);
          }
        });

        Object.keys(listRealtorsResponses).map(function(id) {
          listRealtorsResponses[id].responses.forEach(function(response) {
            listRealtorsResponses[id].total ++;

            if (!response.seen) {
              listRealtorsResponses[id].new ++;
            }
          });
        });

        realtorsResponses = {
          total: totalResponses,
          new: newResponses,
          realtors: listRealtorsResponses
        };

        return realtorsResponses;
      },
      display: function() {
        let data = {
          archiveAction: false,
          flatRooms: false,
          roomArea: false
        };

        if (this.rawRequest === null) {
          return data;
        }

        if (this.rawRequest.status === 'active') {
          data.archiveAction = true;
        }

        switch (this.rawRequest.type) {
          case 'flat':
            data.flatRooms = true;
            break;
          case 'room':
            data.flatRooms = false;

            if (this.rawRequest.roomArea) {
              data.roomArea = true;
            }
            break;
        }

        return data;
      }
    },
    mounted() {
      this.initError = false;

      this.$store.dispatch(UTILS_PROCESSING_BEGIN);

      this.$store.dispatch(REQUESTS_FETCH, this.$route.params.id)
        .then((request) => {
          this.rawRequest = request;
          this.$store.dispatch(UTILS_PROCESSING_END);
        })
        .catch(() => {
          this.initError = 'В процессе загрузки заявки произошла ошибка. Повторите попытку через несколько минут.';
          this.$store.dispatch(UTILS_PROCESSING_END);
        });
    }
  }
</script>

<style scoped>
  .errorAlert {
    border-radius: 0 !important;
    margin: 0;
  }
  .requestHeader {
    padding: 25px;
  }
  .requestTab {
    margin: 25px 0 0 0;
  }
  .requestRow {
    margin: 0;
    padding: 0;
  }
  .requestCol {
    margin: 0;
    padding: 10px 0;
  }

  .realtorItem {
    padding: 15px 20px;
    border-top: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .realtorItem:hover {
    background: #f5f5f5;
  }
  .realtorItem.new {
    background: #eaf5ff;
  }
  .realtorItem:not(.collapsed) {
    #background: #f5f5f5;
  }
  .realtorResponsesBadge {
    font-size: 16px;
    margin: 5px 0;
    padding: 7px;
  }
  .realtorPhone {
    margin: 0;
  }

  .responsesList {
    margin: 0;
    padding: 0;
  }
  .responseItem {
    padding: 15px 20px;
    border-top: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .responseItem:hover {
    background: #f5f5f5;
  }
  .responseItem.new {
    background: #eaf5ff;
  }
  .responsePhotoCounter {
    position: absolute;
    border-radius: 0 0 0.25rem 0;
    font-size: 15px;
    padding: 3px 6px;
  }
  .responseAmount,
  .responseCommission,
  .responseDeposit {
    font-size: 14px;
    font-weight: normal;
    border: 1px solid #e3e3e3;
    margin: 5px 5px 5px 0;
    padding: 8px;
  }
  .responseCity,
  .responseCreated {
    font-size: 13px;
    margin: 0;
  }
</style>
