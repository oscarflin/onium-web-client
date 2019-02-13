<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="requestResponseTypeView">
    <b-alert
      v-if="initError"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ initError }}
    </b-alert>
    <template v-if="!initError">
      <div class="responseHeader">
        <h2>Просмотр ответа на заявку</h2>
      </div>
      <b-container>
        <b-row>
          <b-col>
            <b-container>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Объект
                </b-col>
                <b-col v-if="display.flatRooms" class="responseCol">{{ response.flatRooms }}</b-col>
                <b-col v-if="display.roomArea" class="responseCol">{{ response.roomArea.join(' ') }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Стоимость
                </b-col>
                <b-col class="responseCol">{{ response.amount }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Комиссия
                </b-col>
                <b-col class="responseCol">{{ response.commission }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Залог
                </b-col>
                <b-col class="responseCol">{{ response.deposit }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Город
                </b-col>
                <b-col class="responseCol">{{ response.city }}</b-col>
              </b-row>
              <b-row
                v-if="response.district"
                class="responseRow"
              >
                <b-col
                  class="responseCol"
                >
                  Район
                </b-col>
                <b-col class="responseCol">{{ response.district }}</b-col>
              </b-row>
              <b-row
                v-if="response.metro.length"
                class="responseRow"
              >
                <b-col
                  class="responseCol"
                >
                  Метро
                </b-col>
                <b-col class="responseCol">{{ response.metro.join(' / ') }}</b-col>
              </b-row>
              <b-row
                class="responseRow"
                v-if="response.comment"
              >
                <b-col
                  class="responseCol"
                >
                  Комментарий
                </b-col>
                <b-col
                  class="responseCol"
                  style="white-space: pre-wrap"
                >{{ response.comment }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Дата создания
                </b-col>
                <b-col class="responseCol">{{ response.created }}</b-col>
              </b-row>
              <b-row class="responseRow">
                <b-col
                  class="responseCol"
                >
                  Состояние
                </b-col>
                <b-col class="responseCol">{{ response.seen ? 'ответ просмотрен соискателем' : 'ответ не просмотрен соискателем' }}</b-col>
              </b-row>
            </b-container>
            <b-button
              @click="goToRequest"
              size="lg"
              variant="primary"
              class="mt-4 ml-2 mb-4"
            >
              Перейти к заявке
            </b-button>
          </b-col>
          <b-col>
            <img class="responsePhoto" v-for="(image, i) in response.photo" :src="image" @click="showPhoto(i)">
            <vue-gallery-slide-show :images="response.photo" :index="photo" @close="photo = null"></vue-gallery-slide-show>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
  import VueGallerySlideShow from 'vue-gallery-slideshow'

  import {
    REQUESTS_RESPONSE_FETCH
  } from '../../../../../store/actions/requests'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../../../../store/actions/utils'

  export default {
    name: 'requestResponseTypeView',
    components: {
      VueGallerySlideShow
    },
    data() {
      return {
        initError: false,
        rawResponse: null,
        photo: null
      }
    },
    methods: {
      showPhoto(i) {
        this.photo = i;
      },
      goToRequest: function() {
        this.$router.push({
          name: 'viewRequest',
          params: {
            id: this.rawResponse.incomingRequest._id
          }
        });
      }
    },
    computed: {
      response: function () {
        let response = {
          id: null,
          created: null,
          seen: null,
          amount: null,
          commission: null,
          deposit: null,
          flatRooms: null,
          roomArea: [],
          photo: [],
          city: null,
          district: null,
          metro: [],
          comment: null
        };

        if (this.rawResponse === null) {
          return response;
        }

        response.id = this.rawResponse._id;
        response.created = this.rawResponse.created;
        response.seen = this.rawResponse.seen;
        response.commission = this.rawResponse.commission + '% (' + (this.rawResponse.amount / 100) * this.rawResponse.commission + ' руб.)';
        response.deposit = this.rawResponse.deposit + '% (' + (this.rawResponse.amount / 100) * this.rawResponse.deposit + ' руб.)';
        response.comment = this.rawResponse.comment;

        switch (this.rawResponse.incomingRequest.outgoingRequest.term) {
          case 'long':
            response.amount = this.rawResponse.amount + ' руб./мес.';
            break;
          case 'daily':
            response.amount = this.rawResponse.amount + ' руб./сут.';
            break;
        }

        switch (this.rawResponse.incomingRequest.outgoingRequest.type) {
          case 'flat':
            switch (this.rawResponse.flatRooms) {
              case '1':
                response.flatRooms = '1-комн. квартира';
                break;
              case '2':
                response.flatRooms = '2-комн. квартира';
                break;
              case '3':
                response.flatRooms = '3-комн. квартира';
                break;
              case '4+':
                response.flatRooms = '4+ комн. квартира';
                break;
              case 'studio':
                response.flatRooms = 'Квартира-студия';
                break;
            }
            break;
          case 'room':
            response.roomArea.push('Комната');

            if (this.rawResponse.roomArea) {
              response.roomArea.push(this.rawResponse.roomArea + ' м2');
            }
            break;
        }

        if (this.rawResponse.photo) {
          this.rawResponse.photo.forEach(function(photoId) {
            response.photo.push(process.env.VUE_APP_SERVER_URL + '/requests/responses/photo/' + photoId);
          });
        }

        if (this.rawResponse.city) {
          response.city = this.rawResponse.city.name;
        }

        if (this.rawResponse.district) {
          response.district = this.rawResponse.district.name;
        }

        if (this.rawResponse.metro) {
          this.rawResponse.metro.forEach(function(metro) {
            response.metro.push(metro.name);
          });
        }

        return response;
      },
      display: function () {
        let data = {
          flatRooms: false,
          roomArea: false
        };

        if (this.rawResponse === null) {
          return data;
        }

        switch (this.rawResponse.incomingRequest.outgoingRequest.type) {
          case 'flat':
            data.flatRooms = true;
            break;
          case 'room':
            data.roomArea = true;
            break;
        }

        return data;
      }
    },
    mounted() {
      this.initError = false;

      this.$store.dispatch(UTILS_PROCESSING_BEGIN);

      this.$store.dispatch(REQUESTS_RESPONSE_FETCH, this.$route.params.id)
        .then((response) => {
          this.rawResponse = response;
          this.$store.dispatch(UTILS_PROCESSING_END);
        })
        .catch(() => {
          this.initError = 'В процессе загрузки ответа на заявку произошла ошибка. Повторите попытку через несколько минут.';
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
  .responseHeader {
    padding: 25px;
  }
  .responseRow {
    margin: 0;
    padding: 0;
  }
  .responseCol {
    margin: 0;
    padding: 10px 0;
  }
  .responsePhoto {
    height: 100px;
    background-size: contain;
    cursor: pointer;
    margin: 10px;
    border-radius: 3px;
  }
</style>
