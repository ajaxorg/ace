<!--
Things to verify:
- comments (this block) are properly highlighted
- expressions are highlighted as JS
- <script> highlights ES2015 syntax
- <style> highlights as CSS
-->

<template>
  <div>
    {{ foo * 10 + 'hi' }}
    <span
        v-text="foo * 10 + 'hi'" :id="foo + 'baz'"
        @click="onClick('hello')"
        @click.prevent="onClick('hello')">
      Hello
    </span>
    <router-link v-bind:to="item.url"/>
    <!-- v-bind with dynamic key -->
    <div v-bind:[key]="value"></div>

    <!-- v-bind shorthand with dynamic key -->
    <div :[key]="value"></div>

    <!-- v-on with dynamic event -->
    <div v-on:[event]="handler"></div>

    <!-- v-on shorthand with dynamic event -->
    <div @[event]="handler"></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    foo: 'bar'
  })
};
</script>

<style>
div {
  color: red;
}
</style>

<style lang="sass">
// sass ace mode;

@import url(http://fonts.googleapis.com/css?family=Ace:700)

html, body
  :background-color #ace
  text-align: center
  height: 100%
  /*;*********;
    ;comment  ;
    ;*********;


  &:before
    $radius: $size * 0.845
    $glow: $size * 0.125

    box-shadow: 0 0 $glow $glow / 2 #fff
    border-radius: $radius

    &:active
      ~ .button
        box-shadow: 0 15px 25px -4px rgba(0, 0, 0, 0.4)

      ~ .label
        font-size: 40px
        color: rgba(0, 0, 0, 0.45)

    &:checked
      ~ .button
        box-shadow: 0 15px 25px -4px #ace

      ~ .label
        font-size: 40px
        color: #c9c9c9
</style>

<style lang="scss">
/* style.scss */

#navbar {
  $navbar-width: 800px;
  $items: 5;
  $navbar-color: #ce4dd6;

  width: $navbar-width;
  border-bottom: 2px solid $navbar-color;

  li {
    float: left;
    width: $navbar-width/$items - 10px;

    background-color: lighten($navbar-color, 20%);

    &:hover {
      background-color: lighten($navbar-color, 10%);
    }
  }
}

</style>

<template lang="jade">
  mixin article(obj, parents)
    -var x = "0";

  - var items = ["one", "two", "three"]
  each item in items
    li= item
</template>
