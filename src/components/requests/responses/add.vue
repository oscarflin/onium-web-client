<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="addRequestResponse">
    <b-alert
      v-if="initError"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ initError }}
    </b-alert>
    <b-alert
      v-if="formError"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ formError }}
    </b-alert>
    <template v-if="!initError">
      <div class="addRequestResponseHeader">
        <h2>Ответ на заявку</h2>
      </div>
      <template v-if="show.main">
        <b-container>
          <b-row>
            <b-col>
              <b-form
                @submit.prevent="goToLocation"
                class="addRequestResponseForm"
              >
                <b-form-group
                  label="Кол-во комнат в квартире"
                  v-if="display.flatRooms"
                >
                  <b-form-radio-group
                    v-model="form.flatRooms.selected"
                    :options="form.flatRooms.options"
                    name="radioInline"/>
                </b-form-group>
                <b-form-group
                  label="Площадь комнаты"
                  v-if="display.roomArea"
                >
                  <b-input-group
                    prepend="от"
                    append="м<sup>2</sup>"
                  >
                    <b-form-input
                      type="text"
                      v-model="form.roomArea"
                      class="formRoomArea"
                    />
                  </b-input-group>
                </b-form-group>
                <hr>
                <b-form-group>
                  <div class="mb-2">{{ amountLabel }}</div>
                  <vue-slider
                    v-model="form.amount"
                    ref="slider"
                    :value="1000"
                    :min="1000"
                    :max="150000"
                    :interval="1000"
                    :tooltip="false"
                    :start-animation="true"
                  />
                </b-form-group>
                <hr>
                <b-form-group>
                  <div class="mb-2">{{ commissionLabel }}</div>
                  <vue-slider
                    v-model="form.commission"
                    ref="slider"
                    :value="0"
                    :min="0"
                    :max="100"
                    :interval="1"
                    :tooltip="false"
                    :start-animation="true"
                  />
                </b-form-group>
                <hr>
                <b-form-group>
                  <div class="mb-2">{{ depositLabel }}</div>
                  <vue-slider
                    v-model="form.deposit"
                    ref="slider"
                    :value="0"
                    :min="0"
                    :max="100"
                    :interval="1"
                    :tooltip="false"
                    :start-animation="true"
                  />
                </b-form-group>
                <hr>
                <b-form-group
                  label="Комментарий в свободной форме"
                  label-for="formComment"
                >
                  <b-form-textarea
                    v-model="form.comment"
                    :rows="6"
                    :max-rows="10"
                    id="formComment"
                  />
                </b-form-group>
                <b-form-group class="mt-4">
                  <b-button
                    size="lg"
                    type="submit"
                    variant="primary"
                  >
                    Далее
                  </b-button>
                  <b-button
                    :to="{ name: 'requests' }"
                    size="lg"
                    variant="link"
                  >
                    Назад
                  </b-button>
                </b-form-group>
              </b-form>
            </b-col>
            <b-col>
              <!--
              <img
                src="../../assets/addRequest.svg"
                fluid-grow
                class="addRequestImage"
              >
              -->
            </b-col>
          </b-row>
        </b-container>
      </template>
      <template v-if="show.location">
        <b-container>
          <b-row>
            <b-col>
              <b-form
                @submit.prevent="goToPhoto"
                class="addRequestResponseForm"
              >
                <b-form-group
                  label="Город"
                  label-for="formCity"
                >
                  <multiselect
                    id="formCity"
                    v-model="form.city.selected"
                    :options="form.city.options"
                    track-by="name"
                    label="name"
                    :allow-empty="false"
                    placeholder="Выберите город"
                    :show-labels="false"
                    :disabled="true"
                  />
                </b-form-group>
                <b-form-group
                  v-if="display.districts"
                  label="Район"
                  label-for="formDistricts"
                >
                  <multiselect
                    id="formDistricts"
                    v-model="form.districts.selected"
                    :options="form.districts.options"
                    track-by="name"
                    label="name"
                    :allow-empty="false"
                    placeholder="Выберите район"
                    :show-labels="false"
                    :close-on-select="true"
                  >
                    <span slot="noResult">Район не найден</span>
                  </multiselect>
                </b-form-group>
                <b-form-group
                  v-if="display.metro"
                  label="Метро"
                  label-for="formMetro"
                >
                  <multiselect
                    id="formMetro"
                    v-model="form.metro.selected"
                    :options="form.metro.options"
                    track-by="name"
                    label="name"
                    :allow-empty="true"
                    placeholder="Выберите станции"
                    :show-labels="false"
                    :multiple="true"
                    :close-on-select="false"
                  >
                    <span slot="noResult">Станции не найдены</span>
                  </multiselect>
                </b-form-group>
                <b-form-group class="mt-4">
                  <b-button
                    size="lg"
                    type="submit"
                    variant="primary"
                    :disabled="!this.form.city.selected"
                  >
                    Далее
                  </b-button>
                  <b-button
                    @click="goToMain"
                    size="lg"
                    variant="link"
                  >
                    Назад
                  </b-button>
                </b-form-group>
              </b-form>
            </b-col>
            <b-col>
              <!--
              <img
                src="../../assets/addRequest.svg"
                fluid-grow
                class="addRequestImage"
              >
              -->
            </b-col>
          </b-row>
        </b-container>
      </template>
      <template v-if="show.photo">
        <b-container>
          <b-row>
            <b-col>
              <b-form
                @submit.prevent="addResponse"
                class="addRequestResponseForm"
              >
                <b-form-group>
                  <div class="photoContainer" v-for="photo in form.photo.options" :key="photo.id">
                    <picture-input
                      ref="photoInput"
                      @change="changePhoto(photo.id)"
                      accept="image/jpeg,image/png"
                      :id="photo.id"
                      :hideChangeButton="true"
                      :customStrings="form.photo.settings"
                      width="250"
                      height="250"
                    />
                    <b-button
                      v-if="photo.selected"
                      type="button"
                      size="sm"
                      variant="outline-danger"
                      class="deletePhoto"
                      @click="deletePhoto(photo.id)"
                    >
                      Удалить
                    </b-button>
                  </div>
                </b-form-group>
                <b-form-group class="mt-4">
                  <b-button
                    size="lg"
                    type="submit"
                    variant="primary"
                  >
                    Отправить
                  </b-button>
                  <b-button
                    @click="goToLocation"
                    size="lg"
                    variant="link"
                  >
                    Назад
                  </b-button>
                </b-form-group>
              </b-form>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </template>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import pictureInput from 'vue-picture-input'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../../store/actions/utils'

  import {
    REQUESTS_FETCH,
    REQUESTS_RESPONSE_POST
  } from '../../../store/actions/requests'

  export default {
    name: 'addRequestResponse',
    components: {
      vueSlider,
      pictureInput
    },
    props: [
      'id'
    ],
    data() {
      return {
        initError: false,
        formError: false,
        request: null,
        form: {
          flatRooms: {
            options: [
              { value: '1', text: '1' },
              { value: '2', text: '2' },
              { value: '3', text: '3' },
              { value: '4+', text: '4+' },
              { value: 'studio', text: 'студия' }
            ],
            selected: null
          },
          roomArea: null,
          city: {
            selected: null,
            options: this.$store.getters.cities,
          },
          districts: {
            selected: null,
            options: [],
          },
          metro: {
            selected: [],
            options: [],
          },
          amount: 0,
          commission: 0,
          deposit: 0,
          comment: '',
          photo: {
            settings: {
              upload: '<p>Ваше устройство не поддерживает загрузку файлов</p>', // HTML allowed
              drag: 'Добавить<br>фотографию', // HTML allowed
              tap: 'Добавьте фотографию из вашей галереи', // HTML allowed
              selected: '<p>Фотография успешно добавлена!</p>', // HTML allowed
              fileSize: 'Размер фотографии более 10 Мб!', // Text only
              fileType: 'Тип выбранного файла не поддерживается.', // Text only
              aspect: 'Landscape/Portrait' // Text only
            },
            options: [],
            limit: 8
          }
        },
        show: {
          main: true,
          location: false,
          photo: false
        }
      }
    },
    methods: {
      goToMain: function () {
        this.formError = false;

        this.show = {
          main: true,
          location: false,
          photo: false
        };
      },
      goToLocation: function () {
        this.formError = false;

        if (this.request.outgoingRequest.type === 'flat') {
          if (this.form.flatRooms.selected === null) {
            this.formError = 'Выберите кол-во комнат';
            return;
          }
        }

        this.show = {
          main: false,
          location: true,
          photo: false
        };
      },
      goToPhoto: function () {
        this.formError = false;

        if ((this.request.outgoingRequest.districts.length) && (this.form.districts.selected === null)) {
          this.formError = 'Выберите район из списка';
          return;
        }

        if ((this.request.outgoingRequest.metro.length) && (!this.form.metro.selected.length)) {
          this.formError = 'Выберите метро из списка';
          return;
        }

        this.form.photo.options = [];
        this.addPhoto();

        this.show = {
          main: false,
          location: false,
          photo: true
        };
      },

      selectCity: function(value) {
        this.form.districts.selected = null;

        if (this.request.outgoingRequest.districts.length) {
          let targetDistricts = [];

          this.request.outgoingRequest.districts.forEach(function(requestDistrict) {
            value.districts.forEach(function(cityDistrict) {
              if (requestDistrict._id === cityDistrict._id) {
                targetDistricts.push(cityDistrict);
              }
            });
          });

          this.form.districts.options = targetDistricts;
        } else {
          this.form.districts.options = value.districts;
        }

        this.form.metro.selected = [];

        if (this.request.outgoingRequest.metro.length) {
          let targetMetro = [];

          this.request.outgoingRequest.metro.forEach(function(requestMetro) {
            value.metro.forEach(function(cityMetro) {
              if (requestMetro._id === cityMetro._id) {
                targetMetro.push(cityMetro);
              }
            });
          });

          this.form.metro.options = targetMetro;
        } else {
          this.form.metro.options = value.metro;
        }
      },

      addPhoto: function() {
        if (this.form.photo.options.length < this.form.photo.limit) {
          this.form.photo.options.push({
            id: Math.random().toString(36).substr(2, 9),
            selected: false
          });
        }
      },
      changePhoto(id) {
        let photoOptions = [];
        let addPhoto = false;

        this.form.photo.options.forEach(function(photo) {
          if (photo.id === id) {
            photoOptions.push({
              id: photo.id,
              selected: true
            });

            if (!photo.selected) {
              addPhoto = true;
            }
          } else {
            photoOptions.push(photo);
          }
        });

        this.form.photo.options = photoOptions;

        if (addPhoto) {
          this.addPhoto();
        }
      },
      deletePhoto: function(id) {
        let photoOptions = [];
        let photoSelected = 0;

        this.form.photo.options.forEach(function(photo) {
          if (photo.id !== id) {
            photoOptions.push(photo);
          }

          if (photo.selected) {
            photoSelected ++;
          }
        });

        if (photoSelected === this.form.photo.limit) {
          photoOptions.push({
            id: Math.random().toString(36).substr(2, 9),
            selected: false
          });
        }

        this.form.photo.options = photoOptions;
      },

      addResponse: function() {
        this.formError = false;

        let data = {
          request: this.$route.params.id,
          flatRooms: this.form.flatRooms.selected,
          roomArea: this.form.roomArea,
          city: this.form.city.selected._id,
          district: this.form.districts.selected ? this.form.districts.selected._id : null,
          metro: [],
          amount: this.form.amount,
          commission: this.form.commission,
          deposit: this.form.deposit,
          comment: this.form.comment,
          photo: []
        };

        this.form.metro.selected.forEach(function(item) {
          data.metro.push(item._id);
        });

        this.$refs.photoInput.forEach(function(photo) {
          if (photo.imageSelected) {
            data.photo.push({
              data: photo.image.split(';')[1].split(',')[1],
              contentType: photo.image.split(';')[0].split(':')[1]
            });
          }
        });

        this.$store.dispatch(UTILS_PROCESSING_BEGIN);

        this.$store.dispatch(
          REQUESTS_RESPONSE_POST,
          data
        )
          .then(() => {
            this.$store.dispatch(UTILS_PROCESSING_END);

            this.$router.push({
              name: 'viewRequest',
              params: {
                id: this.$route.params.id,
                eventCreateResponse: true
              }
            });
          })
          .catch(() => {
            this.formError = 'В процессе создании ответа произошла ошибка. Повторите попытку через несколько минут.';
            this.$store.dispatch(UTILS_PROCESSING_END);
          });
      },
    },
    computed: {
      display: function () {
        let data = {
          flatRooms: false,
          roomArea: false,
          districts: false,
          metro: false
        };

        if (this.request === null) {
          return data;
        }

        switch (this.request.outgoingRequest.type) {
          case 'flat':
            data.flatRooms = true;
            break;
          case 'room':
            data.roomArea = true;
            break;
        }

        data.districts = Boolean(this.form.city.selected);

        if (this.form.city.selected) {
          data.metro = Boolean(this.form.city.selected.metro.length);
        }

        return data;
      },
      amountLabel: function () {
        let period = null;

        if (this.request) {
          period = this.request.outgoingRequest.term === 'long' ? 'мес.' : 'сут.';
        }

        return 'Стоимость аренды ' + this.form.amount + ' руб. / ' + period;
      },
      commissionLabel: function () {
        return 'Комиссия ' + this.form.commission + '% (' + ((this.form.amount / 100) * this.form.commission) + ' руб.)';
      },
      depositLabel: function () {
        return 'Депозит ' + this.form.deposit + '% (' + ((this.form.amount / 100) * this.form.deposit) + ' руб.)';
      }
    },
    mounted() {
      this.initError = false;
      this.formError = false;

      this.$store.dispatch(UTILS_PROCESSING_BEGIN);

      this.$store.dispatch(REQUESTS_FETCH, this.$route.params.id)
        .then((request) => {
          this.request = request;

          if (request.status === 'archival') {
            this.initError = 'Ответ на архивную заявку невозможен.';
            this.$store.dispatch(UTILS_PROCESSING_END);
            return;
          }

          const requestCityName = request.outgoingRequest.city.name;
          let selectedCity = null;

          this.$store.getters.cities.forEach(function(city) {
            if (city.name === requestCityName) {
              selectedCity = city;
            }
          });

          if (selectedCity) {
            this.form.city.selected = selectedCity;
            this.selectCity(selectedCity);
          }

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
  .addRequestResponseHeader {
    padding: 25px;
  }
  .addRequestResponseForm {
    margin: 0 10px 30px 10px;
  }
  .formRoomArea {
    max-width: 80px;
  }
  .photoContainer {
    width: 230px;
    float: left;
    margin: 0 20px 20px 0;
  }
  .deletePhoto {
    margin-top: 10px;
    clear: both;
  }
</style>
