<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="settingsType">
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <b-alert
      v-if="processing"
      show
      variant="warning"
      class="processingAlert"
    >
      Сохранение настроек...
    </b-alert>
    <div class="settingsTypeHeader">
      <h2>Настройки входящих заявок</h2>
    </div>
    <b-container>
      <b-row>
        <b-col>
          <b-form
            @submit.prevent="saveSettings"
            class="settingsTypeForm"
          >
            <b-form-group label="Выберите города в которых вы работаете" label-for="formSettingsCity">
              <multiselect
                id="formSettingsCity"
                v-model="form.city.selected"
                :options="form.city.options"
                track-by="name"
                label="name"
                :allow-empty="true"
                placeholder="Выберите город"
                :show-labels="false"
                :loading="form.city.loading"
                :multiple="true"
                :close-on-select="false"
              >
                <span slot="noResult">Города не найдены</span>
              </multiselect>
            </b-form-group>
            <b-form-group label="Выберите типы заявок с которыми вы работаете" label-for="formSettingsTerm">
              <multiselect
                id="formSettingsTerm"
                v-model="form.term.selected"
                :options="form.term.options"
                track-by="name"
                label="name"
                :allow-empty="true"
                placeholder="Выберите типы"
                :show-labels="false"
                :loading="form.term.loading"
                :multiple="true"
                :close-on-select="false"
              >
                <span slot="noResult">Типы не найдены</span>
              </multiselect>
            </b-form-group>
            <b-form-group class="mt-4">
              <b-button
                :disabled="processing"
                size="lg"
                type="submit"
                variant="primary"
                class="mt-1"
              >
                Сохранить
              </b-button>
              <b-button
                :to="{ name: 'requests' }"
                size="lg"
                variant="link"
                class="mt-1"
              >
                Назад
              </b-button>
            </b-form-group>
          </b-form>
        </b-col>
        <b-col>
          <img
            src="../../../assets/settings.png"
            fluid-grow
            class="settingsTypeImage"
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import qs from 'qs'

  import {
    REQUESTS_FETCH_LIST
  } from '../../../store/actions/requests'

  export default {
    name: 'settingsType',
    data() {
      return {
        error: false,
        processing: false,
        form: {
          city: {
            loading: true,
            selected: [],
            options: [],
          },
          term: {
            loading: true,
            selected: [],
            options: [{
              id: 'long',
              name: 'Длительный срок'
            }, {
              id: 'daily',
              name: 'Посуточно'
            }]
          }
        }
      }
    },
    methods: {
      saveSettings: function () {
        this.error = false;
        this.processing = true;

        if (!this.form.city.selected.length) {
          this.error = 'Города не выбраны';
          this.processing = false;
          return;
        }

        if (!this.form.term.selected.length) {
          this.error = 'Условия не выбраны';
          this.processing = false;
          return;
        }

        let settingsRealtorCityValue = [];
        let settingsRealtorTermValue = [];

        this.form.city.selected.forEach(function(item) {
          settingsRealtorCityValue.push(item._id);
        });

        this.form.term.selected.forEach(function(item) {
          settingsRealtorTermValue.push(item.id);
        });

        this.$http({
          url: 'users/settings',
          data: qs.stringify({
            city: settingsRealtorCityValue,
            term: settingsRealtorTermValue
          }),
          method: 'PUT'
        })
          .then(resp => {
            if (!resp.data.result) {
              this.error = 'В процессе сохранения настроек произошла ошибка. Повторите попытку через несколько минут.';
              this.processing = false;
              return;
            }

            switch(resp.data.result) {
              case 'success':
                this.$store.dispatch(REQUESTS_FETCH_LIST)
                  .then(() => {
                    this.$router.push({
                      name: 'requests',
                      params: {
                        eventUpdateSettings: true
                      }
                    });
                  })
                  .catch(() => {
                    this.error = 'В процессе обновления списка заявок произошла ошибка. Повторите попытку через несколько минут.';
                    this.processing = false;
                  });
                return;
              case 'error':
                switch(resp.data.code) {
                  case 'city':
                    this.error = 'Города не соответствуют формату';
                    this.processing = false;
                    return;
                  case 'term':
                    this.error = 'Условия не соответствуют формату';
                    this.processing = false;
                    return;
                  case 'unknown':
                    this.error = 'В процессе сохранения настроек произошла ошибка. Повторите попытку через несколько минут.';
                    this.processing = false;
                    return;
                }
                return;
            }
          })
          .catch(() => {
            this.error = 'В процессе сохранения настроек произошла ошибка. Повторите попытку через несколько минут.';
            this.processing = false;
          });
      }
    },
    mounted() {
      this.$http({
        url: 'users/settings',
        method: 'GET'
      })
        .then(userSettings => {
          this.$http({
            url: 'geo/city',
            method: 'GET'
          })
            .then(city => {
              if (!city.data.result) {
                this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
                return;
              }

              let selectedCity = [];

              switch(city.data.result) {
                case 'success':
                  city.data.list.forEach(function(city) {
                    if (userSettings.data.city.indexOf(city._id) !== -1) {
                      selectedCity.push(city);
                    }
                  });

                  this.form.city = {
                    selected: selectedCity,
                    options: city.data.list,
                    loading: false
                  };
                  return;
                case 'error':
                  this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
                  return;
              }
            })
            .catch(() => {
              this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
            });

          let selectedTerm = [];

          this.form.term.options.forEach(function(term) {
            if (userSettings.data.term.indexOf(term.id) !== -1) {
              selectedTerm.push(term);
            }
          });

          this.form.term.selected = selectedTerm;
          this.form.term.loading = false;
        })
        .catch(() => {
          this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
        });
    }
  }
</script>

<style scoped>
  .errorAlert,
  .processingAlert {
    border-radius: 0 !important;
    margin: 0;
  }
  .settingsTypeHeader {
    padding: 25px;
  }
  .settingsTypeForm{
    margin: 0 10px 30px 10px;
  }
  .settingsTypeImage {
    max-height: 350px;
    margin: 80px;
  }
</style>
