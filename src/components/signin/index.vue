<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="signin">
    <div v-if="error" class="alert alert-danger error-signin">{{ error }}</div>
    <b-container>
      <b-row>
        <b-col>
          <b-form @submit.prevent="signIn" class="form-signin p-5">
            <h2 class="form-signin-heading">Вход в систему</h2>
            <b-form-group description="Номер телефона указанный при регистрации">
              <b-input-group prepend="+7">
                <b-form-input type="text" size="lg" v-model="form.phone" required placeholder="Телефон">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group>
              <b-form-input type="password" size="lg" v-model="form.password" required placeholder="Пароль">
              </b-form-input>
            </b-form-group>
            <b-button size="lg" type="submit" variant="primary" class="mt-2">Войти</b-button>
          </b-form>
        </b-col>
        <b-col>
          <img src="../../assets/signin.svg" fluid-grow class="p-5 signin-image">
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { USER_AUTH_REQUEST } from '../../store/actions/users'

  export default {
    name: 'signin',
    data () {
      return {
        error: false,
        form: {
          phone: '',
          password: ''
        }
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style scoped>
  .error-signin {
    border-radius: 0 !important;
  }
  .signin-image {
    max-height: 420px;
  }
  .form-signin .form-signin-heading {
    margin-bottom: 20px;
  }
</style>
