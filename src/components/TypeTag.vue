<script setup>
const props = defineProps({
  type: String,
})

const variantes = ['tag-a', 'tag-b', 'tag-c']

function variante(type) {
  if (!type) {
    return variantes[0]
  }
  let total = 0
  for (let i = 0; i < type.length; i++) {
    total += type.codePointAt(i)
  }
  return variantes[total % variantes.length]
}
</script>

<template>
  <span class="tag" :class="variante(props.type)">
    {{ type }}
  </span>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: var(--spacing-050) 10px;
  border-radius: var(--radius-500);
  font-size: var(--font-size-small);
  line-height: var(--line-height-medium);
  font-weight: 500;
  border: var(--border-width-050) solid transparent;
}
.tag::first-letter {
  text-transform: uppercase;
}
.tag-a {
  background: var(--color-tag-type-a-bg);
  border-color: var(--color-tag-type-a-border);
  color: var(--color-tag-type-a-text);
}
.tag-b {
  background: var(--color-tag-type-b-bg);
  border-color: var(--color-tag-type-b-border);
  color: var(--color-tag-type-b-text);
}
.tag-c {
  background: var(--color-tag-type-c-bg);
  border-color: var(--color-tag-type-c-border);
  color: var(--color-tag-type-c-text);
}
</style>
