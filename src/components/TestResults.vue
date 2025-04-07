<template>
	<div>
		<h3>測試結果</h3>
		<p v-if="!report">目前沒有測試結果</p>
		<pre
			v-else
			style="
				color: black;
				white-space: pre-wrap;
				background: #f0f0f0;
				padding: 1rem;
			"
		>
			{{ report }}
		</pre
		>
	</div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	report: {
		type: String,
		default: '',
	},
})
</script>
