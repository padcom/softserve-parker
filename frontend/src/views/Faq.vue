<template>
  <div class="faq-page">
    <h5 class="faq-page__head">FAQ</h5>
    <h5 class="faq-page__header">1. What is Parker?</h5>
    <p class="faq-page__paragraph">
      Parker is an in-house SoftServe app, that allows employees and associates working in Wrocław office to reserve parking spots. Please check Terms and Conditions.
    </p>
    <h5 class="faq-page__header">2. How to use Parker comfortably?</h5>
    <p class="faq-page__paragraph">
      Parker is a Progressive Web App. We advise you to open a link in your mobile browser and add it to the home screen (Android Chrome: Menu → Add to home screen; iPhone Safari: Share → Add to Home Screen).
    </p>
    <h5 class="faq-page__header">3. How does Parker work?</h5>
    <p class="faq-page__paragraph">
      You have to log in and use one of the two options: Pick tomorrow' [to request a parking spot for the following day] or 'Pick a parking date' [to request a parking spot for any day within the next 30 days range].
    </p>
    <p class="faq-page__paragraph">
      After 'daily cut off time' = 7:55 pm each day ranking is being calculated, and parking spots are being assigned.
    </p>
    <h5 class="faq-page__header">4. How can I check if I have a parking spot for the next day? Is it possible to have confirmed parking spaces for other days in the future?</h5>
    <p class="faq-page__paragraph">
      You can check permission for parking for tomorrow in the application. It will appear after cutoff time. It is not possible to receive confirmation for other days - all parking spots are assigned only one day before the parking date.
    </p>
    <h5 class="faq-page__header">5. How is the ranking calculated?</h5>
    <p class="faq-page__paragraph">
      Ranking is calculated based on your  parking history to allow equal and fair parking spots distribution. For each successful parking request, you get points [1 point per successful request/parking spot allocation]. Ranking is based on points: less points = higher position in the ranking = better chance to grab a parking spot next time.
    </p>
    <p class="faq-page__paragraph">
      The period that is taken into consideration for calculating the ranking is 30 working days.
    </p>
    <h5 class="faq-page__header">6. Can I request a parking spot for somebody else?</h5>
    <p class="faq-page__paragraph">
      No, you can only request a parking spot for yourself.
    </p>
    <h5 class="faq-page__header">7. What does it mean that my parking request was rejected by Parker?</h5>
    <p class="faq-page__paragraph">
      It means that based on your ranking position you were not eligible for parking on requested date [i.e. if you requested a parking spot and your rank after calculation for that date was 11/37, where 37 is the total number of Users, but at this particular location only 10 parking spots are available etc.].
    </p>
    <h5 class="faq-page__header">8. What happens if I use a parking spot without reservation [I haven’t requested it at all or my parking request was rejected by Parker]?</h5>
    <p class="faq-page__paragraph">
      You will be banned from using the parking permanently.
    </p>
    <h5 class="faq-page__header">9. What happens if a parking spot was granted, and I will not use it and I will not cancel it?</h5>
    <p class="faq-page__paragraph">
      You will be banned from using the parking for a week.
    </p>
    <h5 class="faq-page__header">10. How can I cancel my request?</h5>
    <p class="faq-page__paragraph">
      In order to cancel your request you need to:
    </p>
    <p class="faq-page__paragraph">
      MOBILE VERSION: on the main screen find the date you requested and want to cancel, swipe it to the left, and then confirm that you want to cancel it
    </p>
    <p class="faq-page__paragraph">
      DESKTOP VERSION: on the main screen find the date you requested and want to cancel, hover your cursor over it – ‘X’ button will appear, click ‘X’ button, and then confirm that you want to cancel it.
    </p>
    <h5 class="faq-page__header">11. Will I receive points for cancellation?</h5>
    <p class="faq-page__paragraph">
      - If you cancel your request before parking spot allocation for that particular date – you will NOT receive any points.
    </p>
    <p class="faq-page__paragraph">
      - If you cancel your request after parking spot allocation [successful in your case] for that particular date, your parking spot becomes available to others. If somebody takes the parking spot: you will NOT receive any points [that person will get the points]. If no one will take the parking slot: you WILL receive point.
    </p>
    <p class="faq-page__paragraph">
      After 09:00 am the next day after parking slots allocation you cannot cancel your parking slot. If you have booked a parking slot and have not managed to cancel your reservation by 09:00 am the next day, you will receive 1 point regardless of whether you take the parking slot or not.
    </p>
    <h5 class="faq-page__header">12. Can I resign from Parker?</h5>
    <p class="faq-page__paragraph">
      Yes, you can resign at any time.
    </p>
    <h5 class="faq-page__header">13. What will happen to my personal data?</h5>
    <p class="faq-page__paragraph">
      After resignation, your personal data will be anonymized.
    </p>
    <h5 class="faq-page__header">14. When can I use Parker?</h5>
    <p class="faq-page__paragraph">
      You can use Parker 7 days a week.
    </p>
    <h5 class="faq-page__header">15. Can I request a parking for Saturday/Sunday or Bank Holiday?</h5>
    <p class="faq-page__paragraph">
      Parker will allow you to request a parking spot only for the working days [Monday – Friday, excluding Bank Holidays].
    </p>
    <h5 class="faq-page__header">16. Where can I see my rank?</h5>
    <p class="faq-page__paragraph">
      To see your rank, you need to click on your avatar [top right corner].
    </p>
    <h5 class="faq-page__header">17. How can I log out of Parker?</h5>
    <p class="faq-page__paragraph">
      In order to log out, you need to click on your avatar [top right corner] and choose ‘Logout’.
    </p>
    <h5 class="faq-page__header">18. Can I change my avatar?</h5>
    <p class="faq-page__paragraph">
      Yes, you can change your avatar through <a href="https://gravatar.com" target="_blank">gravatar.com</a>.
    </p>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

import { query } from '../graphql'

@Component()
export default class Faq extends Vue {
  async mounted () {
    await query('query { isLoggedIn }')
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.faq-page {
  font-family: $font-family-proxima-nova;
  padding: 0 15px 15px 20px;

  &__head {
    font-size: 14px;
    font-weight: $font-weight-extra-bold;
    margin-block-start: 16px;
  }

  &__header {
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__paragraph {
    font-size: 14px;
    font-family: $font-family-open-sans;
    line-height: 30px;
  }
}
</style>
