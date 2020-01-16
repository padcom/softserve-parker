<template>
  <v-dialog v-model="visible" :max-width="width">
    <v-card>
      <v-card-title>
        <slot name="title">
          {{ title }}
        </slot>
      </v-card-title>
      <v-card-text>
        <slot>
          {{ body }}
        </slot>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <slot name="actions">
          <v-spacer />
          <v-btn @click="action('ok')">OK</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

type ResolveCallback<T> = (value?: T | PromiseLike<T>) => void

@Component({})
export default class Modal extends Vue {
  visible = false
  title = 'Hello'
  body = 'Use the default slot to fill in this area'
  resolve: ResolveCallback<string> = () => {}

  @Prop({ type: String, default: '50%' }) width?: string

  async show (): Promise<string> {
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
    })
  }

  action (value: string) {
    this.visible = false
    this.resolve(value)
  }
}
</script>
