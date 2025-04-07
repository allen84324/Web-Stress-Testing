const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { spawn } = require('child_process')
const path = require('path')

const app = express()

// 確保 process 的 PATH 環境變數最先被設定
process.env.PATH = `${path.join(__dirname, 'node_modules', '.bin')}:${
	process.env.PATH
}`

app.use(cors())
app.use(express.json())

app.post('/start-test', (req, res) => {
	const { target, users, duration, rampUp } = req.body

	if (!target || typeof target !== 'string') {
		return res.status(400).json({ error: '請提供有效的 target 網址' })
	}

	// 建立 Artillery 測試配置
	const artilleryConfig = {
		config: {
			target,
			phases: [
				{ duration: rampUp, arrivalRate: 1, rampTo: users },
				{
					duration: duration - rampUp,
					arrivalRate: users,
				},
			],
		},
		scenarios: [{ flow: [{ get: { url: '/' } }] }],
	}

	// 把測試配置寫入 JSON 檔案
	const configPath = path.join(__dirname, 'test-config.json')
	fs.writeFileSync(configPath, JSON.stringify(artilleryConfig, null, 2))

	// 使用 npx 執行 Artillery
	const process = spawn('npx', ['artillery', 'run', configPath])

	let output = ''
	process.stdout.on('data', (data) => {
		output += data.toString()
		console.log(data.toString()) // 顯示即時輸出，方便 Debug
	})

	process.stderr.on('data', (data) => {
		console.error(`Artillery 錯誤: ${data}`)
	})

	process.on('close', (code) => {
		if (code === 0) {
			res.json({ message: '測試完成', report: output })
		} else {
			res.status(500).json({ error: 'Artillery 測試執行失敗' })
		}
	})

	// 捕捉進程錯誤
	process.on('error', (err) => {
		console.error('Error spawning process:', err)
		res.status(500).json({ error: '進程啟動失敗' })
	})
})

app.listen(3000, () => console.log('Server running on port 3000'))
