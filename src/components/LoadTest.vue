<template>
	<div>
		<h2>網頁壓力測試設定</h2>
		<form @submit.prevent="startTest">
			<label>目標網址：</label>
			<input v-model="config.target" type="text" required style="width: 50%" />
			<br />

			<label>人數：</label>
			<input v-model.number="config.users" type="number" required />

			<label>持續時間 (秒)：</label>
			<input v-model.number="config.duration" type="number" required />

			<label>幾秒後人數達巔峰：</label>
			<input v-model.number="config.rampUp" type="number" required />
			<br />
			<button
				type="submit"
				style="
					margin-top: 10px;
					background-color: white;
					color: black;
					border: 1px solid black;
				"
			>
				開始測試
			</button>
		</form>

		<p v-if="loading">測試進行中...</p>
		<p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

		<TestResults v-if="results" :report="results.report" />
	</div>
</template>

<script setup>
import { ref } from 'vue'
import TestResults from './TestResults.vue'
import axios from 'axios'

const config = ref({
	target: 'https://events.novatapmeeting.com/cro0314/live', // 預設值
	users: 10,
	duration: 30,
	rampUp: 10,
})

const results = ref([])
const loading = ref(false)
const errorMessage = ref('')

const startTest = async () => {
	loading.value = true
	errorMessage.value = ''
	try {
		const response = await axios.post(
			'http://localhost:3000/start-test',
			config.value
		)
		results.value = response.data
	} catch (error) {
		console.error('壓力測試失敗:', error)
		errorMessage.value = '測試請求失敗，請檢查伺服器'
	} finally {
		loading.value = false
	}
}
</script>
