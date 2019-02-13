<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="signup">
    <template v-if="error">
      <div class="alert alert-danger error-signup">{{ error }}</div>
    </template>
    <template v-if="show.main">
      <b-container>
        <b-row>
          <b-col>
            <b-form @submit.prevent="setMain" class="form-signup p-5">
              <h2 class="form-signup-heading">Регистрация пользователя</h2>
              <b-form-group class="mb-4">
                <b-form-radio-group v-model="form.type.selected" :options="form.type.options"/>
              </b-form-group>
              <b-form-group description="На этот номер будет отправлен код подтверждения">
                <b-input-group prepend="+7">
                  <b-form-input type="text" size="lg" v-model="form.phone" required autofocus placeholder="Телефон"/>
                </b-input-group>
              </b-form-group>
              <b-form-group>
                <b-form-input type="text" size="lg" v-model="form.name" required placeholder="Имя"/>
              </b-form-group>
              <template v-if="form.type.selected === 'realtor'">
                <b-form-group label="Выберите города в которых вы работаете" label-for="formSettingsRealtorCity">
                  <multiselect
                    id="formSettingsRealtorCity"
                    v-model="form.settings.realtor.city.selected"
                    :options="form.settings.realtor.city.options"
                    track-by="name"
                    label="name"
                    :allow-empty="true"
                    placeholder="Выберите город"
                    :show-labels="false"
                    :loading="form.settings.realtor.city.loading"
                    :multiple="true"
                    :close-on-select="false"
                  >
                    <span slot="noResult">Города не найдены</span>
                  </multiselect>
                </b-form-group>
                <b-form-group label="Выберите типы заявок с которыми вы работаете" label-for="formSettingsRealtorTerm">
                  <multiselect
                    id="formSettingsRealtorTerm"
                    v-model="form.settings.realtor.term.selected"
                    :options="form.settings.realtor.term.options"
                    track-by="name"
                    label="name"
                    :allow-empty="true"
                    placeholder="Выберите типы"
                    :show-labels="false"
                    :multiple="true"
                    :close-on-select="false"
                  >
                    <span slot="noResult">Типы не найдены</span>
                  </multiselect>
                </b-form-group>
              </template>
              <b-form-group>
                <b-form-checkbox value="accept" v-model="form.acceptTerms">Принимаю <b-link to="/about/terms">условия использования</b-link></b-form-checkbox>
              </b-form-group>
              <b-button size="lg" type="submit" variant="primary" class="mt-2">Далее</b-button>
            </b-form>
          </b-col>
          <b-col>
            <img src="../../assets/signup.svg" fluid-grow class="p-5 signup-image">
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template v-if="show.password">
      <b-container>
        <b-row>
          <b-col>
            <b-form @submit.prevent="setPassword" class="form-signup p-5">
              <h2 class="form-signup-heading">Установите пароль</h2>
              <b-form-group>
                <b-form-input size="lg" type="password" v-model="form.password" required autofocus placeholder="Пароль">
                </b-form-input>
              </b-form-group>
              <b-form-group>
                <b-form-input size="lg" type="password" v-model="form.rePassword" required placeholder="Повторите пароль">
                </b-form-input>
              </b-form-group>
              <b-button size="lg" type="submit" variant="primary" class="mt-2">Далее</b-button>
            </b-form>
          </b-col>
          <b-col>
            <img src="../../assets/signup.svg" fluid-grow class="p-5 signup-image">
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template v-if="show.pin">
      <b-container>
        <b-row>
          <b-col>
            <b-form @submit.prevent="setPin" class="form-signup p-5">
              <h2 class="form-signup-heading">Введите код из SMS</h2>
              <b-form-group>
                <b-form-input id="pinInput" size="lg" type="text" v-model="form.pin" required autofocus>
                </b-form-input>
              </b-form-group>
              <b-button size="lg" type="submit" variant="primary" class="mt-2">Подтвердить</b-button>
            </b-form>
          </b-col>
          <b-col>
            <img src="../../assets/signup.svg" fluid-grow class="p-5 signup-image">
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template v-if="show.finish">
      <b-container>
        <b-row>
          <b-col>
            <b-form @submit.prevent="signIn" class="form-signup p-5">
              <h2 class="form-signup-heading">Вы успешно зарегистрировались!</h2>
              <b-button size="lg" type="submit" variant="primary" class="mt-2">Войти</b-button>
            </b-form>
          </b-col>
          <b-col>
            <img src="../../assets/signup.svg" fluid-grow class="p-5 signup-image">
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
  import qs from 'qs'
  import { USER_AUTH_REQUEST } from '../../store/actions/users'

  export default {
    name: 'signup',
    data () {
      return {
        error: false,
        form: {
          type: {
            selected: 'seeker',
            options: [
              { value: 'seeker', text: 'Соискатель' },
              { value: 'realtor', text: 'Риелтор / агентство' }
            ]
          },
          name: '',
          phone: '',
          acceptTerms: '',
          password: '',
          rePassword: '',
          pin: '',
          settings: {
            realtor: {
              city: {
                loading: true,
                selected: [],
                options: [],
              },
              term: {
                selected: [{
                  id: 'long',
                  name: 'Длительный срок'
                }, {
                  id: 'daily',
                  name: 'Посуточно'
                }],
                options: [{
                  id: 'long',
                  name: 'Длительный срок'
                }, {
                  id: 'daily',
                  name: 'Посуточно'
                }],
              },
            }
          }
        },
        show: {
          main: true,
          password: false,
          pin: false,
          finish: false
        }
      }
    },
    methods: {
      setMain: function () {
        this.error = false;

        if (!this.form.name) {
          this.error = 'Не указано имя';
          return;
        }

        if (!this.form.phone) {
          this.error = 'Не указан номер телефона';
          return;
        }

        if (!this.form.acceptTerms) {
          this.error = 'Для продолжения необходимо принять условия использования';
          return;
        }

        if (this.form.type.selected === 'realtor') {
          console.log(this.form.settings.realtor.city.selected.length);

          if (!this.form.settings.realtor.city.selected.length) {
            this.error = 'Не выбраны города в которых вы работаете';
            return;
          }
        }

        this.show = {
          main: false,
          password: true,
          pin: false,
          finish: false
        };
      },
      setPassword: function () {
        this.error = false;

        if (this.form.password !== this.form.rePassword) {
          this.error = 'Введенные пароли не совпадают';
          return;
        }

        let settingsRealtorCityValue = [];
        let settingsRealtorTermValue = [];

        this.form.settings.realtor.city.selected.forEach(function(item) {
          settingsRealtorCityValue.push(item._id);
        });

        this.form.settings.realtor.term.selected.forEach(function(item) {
          settingsRealtorTermValue.push(item.id);
        });

        this.$http({
          url: 'users',
          data: qs.stringify({
            type: this.form.type.selected,
            name: this.form.name,
            phone: this.form.phone,
            password: this.form.password,
            settings: {
              realtor: {
                city: settingsRealtorCityValue,
                term: settingsRealtorTermValue
              }
            }
          }),
          method: 'POST'
        })
          .then(resp => {
            if (!resp.data.result) {
              this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
              return;
            }

            switch(resp.data.result) {
              case 'success':
                this.show = {
                  main: false,
                  password: false,
                  pin: true,
                  finish: false
                };
                return;
              case 'error':
                switch(resp.data.code) {
                  case 'invalid':
                    this.error = 'Данные не соответствует формату';
                    return;
                  case 'exist':
                    this.error = 'Номер телефона уже зарегистрирован';
                    return;
                  case 'unknown':
                    this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
                    return;
                }
                return;
            }
          })
          .catch(() => {
            this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
          });
      },
      setPin: function () {
        this.error = false;

        if (!this.form.pin) {
          this.error = 'Не введен код подтверждения';
          return;
        }

        this.$http({
          url: 'users/activate',
          data: qs.stringify({
            phone: this.form.phone,
            pin: this.form.pin
          }),
          method: 'POST'
        })
          .then(resp => {
            if (!resp.data.result) {
              this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
              return;
            }

            switch(resp.data.result) {
              case 'success':
                this.show = {
                  main: false,
                  password: false,
                  pin: false,
                  finish: true
                };
                return;
              case 'error':
                switch(resp.data.code) {
                  case 'invalid':
                    this.error = 'Неверные данные для активации';
                    return;
                  case 'unknown':
                    this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
                    return;
                }
                return;
            }
          })
          .catch(() => {
            this.error = 'В процессе регистрации произошла ошибка. Повторите попытку через несколько минут.';
          });
      },
      signIn: function () {
        this.error = false;
        const { phone, password } = this.form;

        this.$store.dispatch(
          USER_AUTH_REQUEST,
          {
            phone,
            password
          }
        )
          .then(() => {
            this.$router.push({ name: 'home' });
          })
          .catch(() => {
            this.error = 'Ошибка входа';
          });
      },

      pullCityList: function() {
        this.$http({
          url: 'geo/city',
          method: 'GET'
        })
          .then(resp => {
            if (!resp.data.result) {
              this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
              return;
            }

            switch(resp.data.result) {
              case 'success':
                this.form.settings.realtor.city.options = resp.data.list;
                this.form.settings.realtor.city.loading = false;
                return;
              case 'error':
                this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
                return;
            }
          })
          .catch(() => {
            this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
          });
      }
    },
    mounted(){
      this.pullCityList();
    }
  }
</script>

<style scoped>
  .error-signup {
    border-radius: 0 !important;
  }
  .signup-image {
    max-height: 420px;
  }
  .form-signup .form-signup-heading {
    margin-bottom: 20px;
  }
  #pinInput {
    width: 90px;
  }
</style>
