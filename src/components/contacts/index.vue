<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="contacts">
    <div class="contactsHeader">
      <h2>Контакты</h2>
    </div>
    <b-alert v-if="!dialogs.length" show variant="warning" class="ml-4 mr-4 mb-4">Диалоги не найдены</b-alert>
    <ul class="dialogsList">
      <b-media
        @click="viewDialog(dialog)"
        v-for="dialog in dialogs"
        :key="dialog.id"
        class="dialogItem"
        :class="{
          'new': ((dialog.contact.id === dialog.sender.id) && (!dialog.seen))
        }"
      >
        <p class="text-muted m-0 dialogCreated float-right">{{ dialog.created }}</p>
        <b-img
          slot="aside"
          :src="dialog.contact.photo"
          rounded="circle"
          height="64"
          width="64"
        />
        <h5 class="mt-0 mb-1">{{ dialog.contact.name }}</h5>
        <p
          v-if="dialog.contact.id === dialog.sender.id"
          class="text-muted m-0 dialogMessage"
        >
          {{ dialog.message }}
        </p>
        <b-media
          v-if="dialog.contact.id !== dialog.sender.id"
          tag="li"
          class="mt-2 mb-2"
        >
          <b-img
            slot="aside"
            :src="dialog.sender.photo"
            rounded="circle"
            height="32"
            width="32"
          />
          <p
            class="text-muted m-0 p-1 dialogMessage"
            :class="{
              'new': !dialog.seen
            }"
          >
            {{ dialog.message }}
          </p>
        </b-media>
      </b-media>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'contacts',
    methods: {
      viewDialog: function(dialog) {
        this.$router.push({
          name: 'contactsMessages',
          params: {
            id: dialog.id
          }
        });
      }
    },
    computed: {
      dialogs: function () {
        let dialogs = [];

        this.$store.getters.dialogs.forEach(function(dialog) {
          let slicedMessage = dialog.message.slice(0, 100);

          if (slicedMessage.length < dialog.message.length) {
            slicedMessage += '...';
          }

          let dialogItem = {
            id: dialog._id,
            contact: {
              id: dialog.contact._id,
              photo: process.env.VUE_APP_SERVER_URL + '/users/photo/' + dialog.contact._id,
              name: dialog.contact.name
            },
            sender: {
              id: dialog.sender._id,
              photo: process.env.VUE_APP_SERVER_URL + '/users/photo/' + dialog.sender._id
            },
            message: slicedMessage,
            seen: dialog.seen,
            created: dialog.created,
          };

          dialogs.push(dialogItem);
        });

        return dialogs;
      }
    }
  }
</script>

<style scoped>
  .contactsHeader {
    padding: 25px;
  }
  .dialogsList {
    margin: 0;
    padding: 0;
  }
  .dialogItem {
    padding: 15px 20px;
    border-top: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .dialogItem:hover {
    background: #f5f5f5;
  }
  .dialogItem.new {
    background: #eaf5ff;
  }
  .dialogMessage {
    font-size: 15px;
  }
  .dialogMessage.new {
    background: #eaf5ff;
  }
  .dialogCreated {
    font-size: 12px;
  }
</style>
