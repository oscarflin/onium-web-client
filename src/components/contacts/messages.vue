<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="contactsMessages">
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <div class="contactsMessagesHeader">
      <h2>Сообщения</h2>
    </div>
    <div
      class="contactsMessagesList"
      :style="{
        height: listHeight + 'px'
      }
    ">
      <b-media
        v-for="message in messages"
        :key="message.id"
        class="p-3 contactMessage"
        :class="{
          'new': ((message.sender.id === message.recepient) && (!message.seen))
        }"
      >
        <b-img
          slot="aside"
          :src="message.sender.photo"
          rounded="circle"
          height="64"
          width="64"
        />
        <h5 class="mt-0 mb-1">{{ message.sender.name }}</h5>
        <p
          v-if="message.sender.id ===  message.recepient"
          class="m-0 dialogMessage"
        >
          {{ message.message }}
        </p>
        <p
          v-if="message.sender.id !==  message.recepient"
          class=" m-0 dialogMessage"
          :class="{
            'new': !message.seen
          }"
        >
          {{ message.message }}
        </p>
        <p class="text-muted messageCreated">
          {{ message.created }}
        </p>
      </b-media>
    </div>
    <div
      class="contactsMessagesForm"
      :style="{
        height: formHeight + 'px'
      }
    ">
      <b-container>
        <b-row>
          <b-col
            cols="10"
            class="m-0 p-0 inputMessageHolder"
          >
            <b-form-textarea
              v-model="message"
              placeholder="Введите ваше сообщение"
              :rows="1"
              :max-rows="6"
              class="inputMessage"
              id="inputMessage"
              @input="calculateFormHeight"
            >
            </b-form-textarea>
          </b-col>
          <b-col
            cols="2"
            class="m-0 p-0"
          >
            <b-button
              variant="primary"
              :block="true"
              class="sendButton"
              size="lg"
            >
              Отправить
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
  import { DIALOGS_FETCH_MESSAGES_LIST } from '../../store/actions/dialogs'

  import {
    UTILS_PROCESSING_BEGIN,
    UTILS_PROCESSING_END
  } from '../../store/actions/utils'

  export default {
    name: 'contactsMessages',
    props: [
      'id'
    ],
    data() {
      return {
        error: false,
        message: '',
        listHeight: 0,
        formHeight: 48
      }
    },
    methods: {
      calculateListHeight: function() {
        this.listHeight = window.innerHeight - 224 - this.formHeight;
      },
      calculateFormHeight: function() {
        this.$nextTick(function () {
          this.formHeight = document.getElementById('inputMessage').clientHeight;
          this.calculateListHeight();
        });
      }
    },
    computed: {
      messages: function () {
        let messages = [];

        const contact = this.$store.getters.contactDialog.contact;

        this.$store.getters.contactDialog.messages.forEach(function(message) {
          let messageItem = {
            id: message._id,
            created: message.created,
            message: message.message,
            recepient: contact,
            sender: {
              id: message.sender._id,
              photo: process.env.VUE_APP_SERVER_URL + '/users/photo/' + message.sender._id,
              name: message.sender.name
            }
          };

          messages.push(messageItem);
        });

        console.log(messages);

        return messages;
      }
    },
    mounted() {
      this.$store.dispatch(UTILS_PROCESSING_BEGIN);

      this.calculateListHeight();

      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.calculateListHeight();
        });
      });

      this.$store.dispatch(
        DIALOGS_FETCH_MESSAGES_LIST,
        this.$route.params.id
      )
        .then(() => {
          this.$store.dispatch(UTILS_PROCESSING_END);
        })
        .catch(() => {
          this.error = 'В процессе получения списка сообщений произошла ошибка. Повторите попытку через несколько минут.';
          this.$store.dispatch(UTILS_PROCESSING_END);
        });
    },
    destroyed() {
      console.log('destroyed');
    }
  }
</script>

<style scoped>
  .contactsMessagesHeader {
    padding: 25px;
  }
  .contactsMessagesList {
    overflow-y: scroll;
    overflow-x: hidden;
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
  }
  .contactMessage.new {
    background: #eaf5ff;
  }
  .dialogMessage.new {
    background: #eaf5ff;
    padding: 8px;
  }
  .messageCreated {
    font-size: 13px;
    margin-top: 4px;
    margin-bottom: 0;
  }
  .contactsMessagesForm {

  }
  .inputMessage {
    margin: 0;
    padding: 12px;
    border: none !important;
    overflow: auto !important;
    outline: none !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
    resize: none;
  }
  .inputMessage:hover,
  .inputMessage:focus {
    outline: 0px !important;
    -webkit-appearance:none !important;
  }
  .inputMessageHolder {
    border-right: 1px solid #e3e3e3;
  }
  .sendButton {
    border-radius: 0;
  }
</style>
