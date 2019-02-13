<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="addRequest">
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <div class="addRequestHeader">
      <h2>Новая заявка на аренду</h2>
    </div>
    <template v-if="show.main">
      <b-container>
        <b-row>
          <b-col>
            <b-form
              @submit.prevent="goToLocation"
              class="addRequestForm"
            >
              <b-form-group>
                <b-form-radio-group
                  v-model="form.term.selected"
                  :options="form.term.options"
                />
              </b-form-group>
              <hr>
              <b-form-group>
                <b-form-radio-group
                  v-model="form.type.selected"
                  :options="form.type.options"
                />
              </b-form-group>
              <hr>
              <b-form-group
                label="Кол-во комнат"
                v-if="form.type.selected === 'flat'"
              >
                <b-form-checkbox-group
                  v-model="form.flatRooms.selected"
                  :options="form.flatRooms.options"
                />
              </b-form-group>
              <b-form-group
                v-if="form.type.selected === 'room'"
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
              <b-form-group
                label="Кол-во жильцов"
                label-for="formTenants"
              >
                <b-form-select
                  v-model="form.tenants.selected"
                  :options="form.tenants.options"
                  id="formTenants"
                />
                <b-form-checkbox
                  v-model="form.family"
                  value="yes"
                >
                  семья
                </b-form-checkbox>
              </b-form-group>
              <hr>
              <b-form-group>
                <b-form-checkbox
                  v-model="form.children"
                  value="yes"
                >
                  Можно с детьми
                </b-form-checkbox>
              </b-form-group>
              <b-form-group>
                <b-form-checkbox
                  v-model="form.animals"
                  value="yes"
                >
                  Можно с животными
                </b-form-checkbox>
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
              @submit.prevent="goToComment"
              class="addRequestForm"
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
                  @input="selectCity"
                >
                  <span slot="noResult">Города не найдены</span>
                </multiselect>
              </b-form-group>
              <b-form-group
                v-if="form.districts.show"
                label="Районы"
                label-for="formDistricts"
                description="Если районы не выбраны — риелторы будут отправлять предложения в любых районах выбранного города."
              >
                <multiselect
                  id="formDistricts"
                  v-model="form.districts.selected"
                  :options="form.districts.options"
                  track-by="name"
                  label="name"
                  :allow-empty="true"
                  placeholder="Выберите районы"
                  :show-labels="false"
                  :multiple="true"
                  :close-on-select="false"
                >
                  <span slot="noResult">Районы не найдены</span>
                </multiselect>
              </b-form-group>
              <b-form-group
                v-if="form.metro.show"
                label="Метро"
                label-for="formMetro"
                description="Если стании метро не выбраны — риелторы будут отправлять предложения рядом с любыми станциями метро."
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
    <template v-if="show.comment">
      <b-container>
        <b-row>
          <b-col>
            <b-form
              @submit.prevent="addRequest"
              class="addRequestForm"
            >
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
                  Создать
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
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'

  import {
    REQUESTS_POST
  } from '../../store/actions/requests'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../store/actions/utils'

  export default {
    name: 'addRequest',
    components: {
      vueSlider
    },
    data() {
      return {
        error: false,
        form: {
          term: {
            selected: 'long',
            options: [
              { value: 'long', text: 'Длительный срок' },
              { value: 'daily', text: 'Посуточно' }
            ]
          },
          type: {
            selected: 'flat',
            options: [
              { value: 'flat', text: 'Квартира' },
              { value: 'room', text: 'Комната' }
            ]
          },
          flatRooms: {
            selected: [],
            options: [
              { value: '1', text: '1' },
              { value: '2', text: '2' },
              { value: '3', text: '3' },
              { value: '4+', text: '4+' },
              { value: 'studio', text: 'студия' }
            ],
          },
          roomArea: 0,
          tenants: {
            selected: '1',
            options: [
              { value: '1', text: '1' },
              { value: '2', text: '2' },
              { value: '3', text: '3' },
              { value: '4+', text: '4+' }
            ],
          },
          family: false,
          children: false,
          animals: false,
          amount: 0,
          city: {
            selected: null,
            options: this.$store.getters.cities,
          },
          districts: {
            show: false,
            selected: [],
            options: [],
          },
          metro: {
            show: false,
            selected: [],
            options: [],
          },
          comment: ''
        },
        show: {
          main: true,
          location: false,
          comment: false
        }
      }
    },
    methods: {
      goToMain: function () {
        this.error = false;
        this.show = {
          main: true,
          location: false,
          comment: false
        };
      },
      goToLocation: function () {
        this.error = false;
        this.show = {
          main: false,
          location: true,
          comment: false
        };
      },
      goToComment: function () {
        this.error = false;
        this.show = {
          main: false,
          location: false,
          comment: true
        };
      },
      selectCity: function(value) {
        this.form.districts.selected = [];
        this.form.districts.options = value.districts;
        this.form.districts.show = true;

        if (value.metro.length) {
          this.form.metro.selected = [];
          this.form.metro.options = value.metro;
          this.form.metro.show = true;
        } else {
          this.form.metro.selected = [];
          this.form.metro.options = [];
          this.form.metro.show = false;
        }
      },
      addRequest: function () {
        this.error = false;

        let districtsValue = [];
        let metroValue = [];

        this.form.districts.selected.forEach(function(item) {
          districtsValue.push(item._id);
        });

        this.form.metro.selected.forEach(function(item) {
          metroValue.push(item._id);
        });

        this.$store.dispatch(UTILS_PROCESSING_BEGIN);

        this.$store.dispatch(
          REQUESTS_POST,
          {
            term: this.form.term.selected,
            type: this.form.type.selected,
            flatRooms: this.form.flatRooms.selected,
            roomArea: this.form.roomArea,
            tenants: this.form.tenants.selected,
            family: this.form.family,
            children: this.form.children,
            animals: this.form.animals,
            amount: this.form.amount,
            city: this.form.city.selected._id,
            districts: districtsValue,
            metro: metroValue,
            comment: this.form.comment
          }
        )
          .then(() => {
            this.$store.dispatch(UTILS_PROCESSING_END);

            this.$router.push({
              name: 'requests',
              params: {
                eventCreate: true
              }
            });
          })
          .catch(() => {
            this.$store.dispatch(UTILS_PROCESSING_END);
            this.error = 'В процессе создании заявки произошла ошибка. Повторите попытку через несколько минут.';
          });
      }
    },
    computed: {
      amountLabel: function () {
        let prefix = this.form.amount === 150000 ? 'от' : 'до';
        let period = this.form.term.selected === 'long' ? 'мес.' : 'сут.';

        return 'Стоимость аренды ' + prefix + ' ' + this.form.amount + ' руб. / ' + period;
      }
    }
  }
</script>

<style scoped>
  .errorAlert {
    border-radius: 0 !important;
    margin: 0;
  }
  .addRequestHeader {
    padding: 25px;
  }
  .addRequestForm{
    margin: 0 10px 30px 10px;
  }
  .formRoomArea {
    max-width: 80px;
  }
  #formTenants {
    max-width: 80px;
    margin-right: 10px;
  }
</style>
