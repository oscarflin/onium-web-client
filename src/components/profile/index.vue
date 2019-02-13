<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="profile">
    <div v-if="error" class="alert alert-danger alert-profile">{{ error }}</div>
    <div v-if="success" class="alert alert-success alert-profile">{{ success }}</div>
    <h2 class="profile-header">Профиль пользователя</h2>
    <b-container class="user-container">
      <b-row>
        <b-col cols="4">
          <picture-input
            @change="onChangePhoto"
            @remove="onRemovePhoto"
            :prefill="defaultPhoto.image"
            :prefillOptions="defaultPhoto.options"
            ref="pictureInput"
            margin="0"
            radius="50"
            accept="image/jpeg,image/png"
            size="10"
            :removable="true"
            buttonClass="btn btn-outline-primary"
            removeButtonClass="btn btn-outline-danger"
            :customStrings="uploadPhotoSettings"
          />
        </b-col>
        <b-col>
          <b-container class="user-container">
            <b-row class="user-row">
              <b-col class="user-col" cols="3">Тип</b-col>
              <b-col class="user-col">{{ this.$store.getters.userProfile.type }}</b-col>
            </b-row>
            <b-row class="user-row">
              <b-col class="user-col" cols="3">Телефон</b-col>
              <b-col class="user-col">{{ this.$store.getters.userProfile.phone }}</b-col>
            </b-row>
            <b-row class="user-row">
              <b-col class="user-col" cols="3">Статус</b-col>
              <b-col class="user-col">{{ this.$store.getters.userProfile.status }}</b-col>
            </b-row>
            <b-row class="user-row">
              <b-col class="user-col" cols="3">Имя</b-col>
              <b-col class="user-col">{{ this.$store.getters.userProfile.name }}</b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import axios from '../../axios'
  import qs from 'qs'
  import PictureInput from 'vue-picture-input'

  export default {
    name: 'profile',
    data() {
      return {
        defaultPhoto: {
          image: null,
          options: {
            mediaType: 'image/png'
          }
        },
        uploadPhotoSettings: {
          upload: '<p>Ваше устройство не поддерживает загрузку файлов</p>', // HTML allowed
          drag: 'Загрузите фотографию', // HTML allowed
          tap: 'Загрузите фотографию из вашей галереи', // HTML allowed
          change: 'Изменить', // Text only
          remove: 'Удалить', // Text only
          select: 'Выбрать', // Text only
          selected: '<p>Фотография успешно выбрана!</p>', // HTML allowed
          fileSize: 'Размер фотографии более 10 Мб!', // Text only
          fileType: 'Тип выбранного файла не поддерживается.', // Text only
          aspect: 'Landscape/Portrait' // Text only
        },
        error: false,
        success: false,
        photo: null
      }
    },
    mounted() {
      axios({
        url: 'users/photo',
        method: 'GET'
      })
        .then(userPhoto => {
          if (!userPhoto.data.result) {
            this.error = 'В процессе загрузки фотографии произошла ошибка. Повторите попытку через несколько минут.';
            return;
          }

          switch(userPhoto.data.result) {
            case 'success':
              if (userPhoto.data.photo) {
                this.defaultPhoto = {
                  image: userPhoto.data.photo.url,
                  options: {
                    mediaType: userPhoto.data.photo.file.contentType
                  }
                };
              }
              return;
            case 'error':
              this.error = 'В процессе загрузки фотографии произошла ошибка. Повторите попытку через несколько минут.';
              return;
          }
        })
        .catch(() => {
          this.error = 'В процессе загрузки фотографии произошла ошибка. Повторите попытку через несколько минут.';
        });
    },
    components: {
      PictureInput
    },
    methods: {
      onChangePhoto(image) {
        this.error = false;
        this.success = false;

        if (image) {
          const imageObject = {
            data: image.split(';')[1].split(',')[1],
            contentType: image.split(';')[0].split(':')[1]
          };

          axios({
            url: 'users/photo',
            data: qs.stringify(imageObject),
            method: 'PUT'
          })
            .then(() => {
              this.photo = imageObject;
              this.success = 'Фотография успешно обновлена';
            })
            .catch(() => {
              this.error = 'В процессе загрузки списка городов произошла ошибка. Повторите попытку через несколько минут.';
            });
        } else {
          this.error = 'Ваш браузер не поддерживает FileReader API. Попробуйте другой браузер.';
        }
      },
      onRemovePhoto() {
        axios({
          url: 'users/photo',
          method: 'PUT'
        })
          .then(() => {
            this.photo = null;
            this.success = 'Фотография успешно удалена';
          })
          .catch(() => {
            this.error = 'В процессе удаления фотографии произошла ошибка. Повторите попытку через несколько минут.';
          });
      }
    }
  }
</script>

<style scoped>
  .profile {
    padding: 0;
  }
  .alert-profile {
    border-radius: 0 !important;
    margin: 0;
  }
  .profile-header {
    padding: 20px 20px 0 20px;
    margin: 0;
  }
  .user-container {
    margin: 20px;
    padding: 0;
  }
  .user-row {
    margin: 0;
    padding: 0;
  }
  .user-col {
    margin: 0;
    padding: 10px 0;
  }
</style>
