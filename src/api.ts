import { InstanceStatus, TCPHelper } from '@companion-module/base'
import type { LGProDisplayInstance } from './main.js'

export function InitConnection(self: LGProDisplayInstance): void {
	self.log('debug', 'Initializing connection...')

	if (self.socket !== undefined) {
		self.socket?.destroy()
	}

	if (self.config.host) {
		if (self.config.port === undefined) {
			self.config.port = 9761
		}
		self.socket = new TCPHelper(self.config.host, self.config.port)

		self.socket?.on('error', (err: any) => {
			if (self.config.verbose) {
				self.log('debug', 'Network error: ' + String(err))
			}
		})

		self.socket?.on('connect', () => {
			self.updateStatus(InstanceStatus.Ok, 'Connected to Display')
			self.log('debug', 'Connected')
			StartPolling(self)
		})

		self.socket?.on('data', (data: Buffer) => {
			const response = data.toString().trim()
			if (self.config.verbose) {
				self.log('debug', `Received: ${response}`)
			}
			ProcessData(self, response)
		})
	}
}

function StartPolling(self: LGProDisplayInstance): void {
	if (self.pollTimer) {
		clearInterval(self.pollTimer)
	}

	self.pollTimer = setInterval(() => {
		SendCommand(self, 'ka', 'FF') // power state
		SendCommand(self, 'xb', 'FF') // input select
		SendCommand(self, 'kd', 'FF') // screen mute state
		SendCommand(self, 'kf', 'FF') // volume level
		SendCommand(self, 'ke', 'FF') // volume mute state
	}, self.config.pollInterval)
}

function ProcessData(self: LGProDisplayInstance, response: string): void {
	const parts = response.trim().split(' ')
	if (parts.length >= 3) {
		const [cmd2, _setId, statusWithValue] = parts
		const status = statusWithValue.substring(0, 2)
		const value = statusWithValue.substring(2).replace(/[^0-9A-Fa-f]/g, '')

		if (status !== 'OK') {
			if (self.config.verbose) {
				self.log('debug', `Received NG or malformed status: ${response}`)
			}
			return
		}

		switch (cmd2) {
			case 'a':
				self.powerState = parseInt(value, 16)
				const power_state = self.powerState === 1 ? 'On' : 'Off'
				self.setVariableValues({ power_state })
				self.checkFeedbacks('powerState')
				break
			case 'b':
				self.inputState = value
				const input_name = self.CHOICES_INPUTS.find((i) => i.id == value)?.label || `Unknown (${value})`
				self.setVariableValues({ current_input: input_name })
				self.checkFeedbacks('inputState')
				break
			case 'd':
				self.screenMuteState = parseInt(value, 16)
				const screen_mute_state = self.screenMuteState === 0 ? 'Unmuted' : 'Muted'
				self.setVariableValues({ screen_mute_state })
				self.checkFeedbacks('screenMuteState')
				break
			case 'e':
				self.volumeMuteState = parseInt(value, 16)
				const volume_mute_state = self.volumeMuteState === 0 ? 'Muted' : 'Unmuted'
				self.setVariableValues({ volume_mute_state })
				self.checkFeedbacks('volumeMuteState')
				break
			case 'f':
				self.volumeLevel = parseInt(value, 16)
				const volume_level = self.volumeLevel.toString()
				self.setVariableValues({ volume_level: volume_level })
				break
		}
	}

	self.checkFeedbacks()
}

export function SendCommand(self: LGProDisplayInstance, command: string, data: string = 'FF'): void {
	const setId = self.config.setId.toString(16).padStart(2, '0').toUpperCase()
	const payload = `${command} ${setId} ${data}\r`

	if (self.config.verbose) {
		self.log('debug', `Sending: ${payload.trim()}`)
	}

	if (self.socket !== undefined && self.socket?.isConnected) {
		self.socket?.send(payload)
	} else {
		self.log('debug', 'Socket not connected :(')
	}
}
