<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="events">
    <b-alert
      v-if="error"
      show
      variant="danger"
      class="errorAlert"
    >
      {{ error }}
    </b-alert>
    <div class="requestsHeader">
      <h2>События</h2>
    </div>
    <b-alert v-if="!events.length" show variant="warning" class="ml-4 mr-4 mb-4">События не найдены</b-alert>
    <ul class="eventsList">
      <b-media
        @click="viewEvent(event)"
        v-for="event in events"
        :key="event.id"
        tag="li"
        class="eventItem"
      >
        <img
          src="../../assets/event.png"
          rounded="circle"
          slot="aside"
          width="64"
          height="64"
        />
        <h5 class="mt-2 mb-1">{{ event.description }}</h5>
        <p class="text-muted eventCreated">{{ event.created }}</p>
      </b-media>
    </ul>
  </div>
</template>

<script>
  import {
    EVENTS_VIEW
  } from '../../store/actions/events'

  export default {
    name: 'events',
    data() {
      return {
        error: false
      }
    },
    methods: {
      viewEvent: function(event) {
        switch (event.type) {
          case 'moveActiveIncomingRequestToArchive':
            this.$router.push({
              name: 'viewRequest',
              params: {
                id: event.target
              }
            });
            break;
        }
      }
    },
    computed: {
      events: function () {
        let events = [];

        this.$store.getters.events.forEach(function(event) {
          let description = [];

          switch (event.type) {
            case 'moveActiveIncomingRequestToArchive':
              description.push('Перемещение заявки в архив');
              break;
          }

          let eventItem = {
            id: event._id,
            type: event.type,
            target: event.id,
            description: description.join(' '),
            created: event.created
          };

          events.push(eventItem);
        });

        return events;
      }
    },
    mounted() {
      if (this.$store.getters.eventsCounter) {
        this.error = false;
        this.$store.dispatch(EVENTS_VIEW)
          .catch(() => {
            this.error = 'В процессе обновления состояний событий произошла ошибка. Повторите попытку через несколько минут.';
          });
      }
    }
  }
</script>

<style scoped>
  .errorAlert {
    border-radius: 0 !important;
    margin: 0;
  }
  .requestsHeader {
    padding: 25px;
  }
  .eventsList {
    margin: 0;
    padding: 0;
  }
  .eventItem {
    padding: 15px 20px;
    border-top: 1px solid #e3e3e3;
    cursor: pointer;
  }
  .eventItem:hover {
    background: #f5f5f5;
  }
  .eventCreated {
    font-size: 13px;
    margin: 0;
  }
</style>
