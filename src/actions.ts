import { CompanionActionDefinitions } from '@companion-module/base'
import type { LGProDisplayInstance } from './main.js'
import { SendCommand } from './api.js'

export function UpdateActions(self: LGProDisplayInstance): void {
	const actions: CompanionActionDefinitions = {}

	actions.powerOn = {
		name: 'Power On',
		options: [],
		callback: async () => await SendCommand(self, 'ka', '01'),
	}

	actions.powerOff = {
		name: 'Power Off',
		options: [],
		callback: async () => await SendCommand(self, 'ka', '00'),
	}

	actions.inputSelect = {
		name: 'Select Input',
		options: [
			{
				type: 'dropdown',
				id: 'input',
				label: 'Input',
				default: '90',
				choices: self.CHOICES_INPUTS,
			},
		],
		callback: async (event) => await SendCommand(self, 'xb', String(event.options.input)),
	}

	actions.screenMute = {
		name: 'Screen Mute On/Off',
		options: [
			{
				type: 'dropdown',
				id: 'state',
				label: 'Mute State',
				default: '00',
				choices: [
					{ id: '00', label: 'Mute On' },
					{ id: '01', label: 'Mute Off' },
				],
			},
		],
		callback: async (event) => await SendCommand(self, 'kd', String(event.options.state)),
	}

	actions.volumeMute = {
		name: 'Volume Mute On/Off',
		options: [
			{
				type: 'dropdown',
				id: 'state',
				label: 'Mute State',
				default: '00',
				choices: [
					{ id: '00', label: 'Mute On' },
					{ id: '01', label: 'Mute Off' },
				],
			},
		],
		callback: async (event) => await SendCommand(self, 'ke', String(event.options.state)),
	}

	actions.volumeLevel = {
		name: 'Volume Set Level',
		options: [
			{
				type: 'number',
				id: 'level',
				label: 'Volume Level',
				default: 50,
				min: 0,
				max: 100,
			},
		],
		callback: async (event) => {
			const level = event.options.level
			const levelHex = level?.toString(16).padStart(2, '0')
			await SendCommand(self, 'kf', levelHex)
		},
	}

	actions.volumeLevelInc = {
		name: 'Volume Increase Level',
		options: [
			{
				type: 'number',
				id: 'level',
				label: 'Amount',
				default: 1,
				min: 1,
				max: 10,
			},
		],
		callback: async (event) => {
			const currentLevel = self.volumeLevel
			let newLevel = currentLevel + Number(event.options.level)
			if (newLevel > 100) {
				newLevel = 100
			}
			const levelHex = newLevel?.toString(16).padStart(2, '0')
			await SendCommand(self, 'kf', levelHex)
		},
	}

	actions.volumeLevelDec = {
		name: 'Volume Decrease Level',
		options: [
			{
				type: 'number',
				id: 'level',
				label: 'Amount',
				default: 1,
				min: 1,
				max: 10,
			},
		],
		callback: async (event) => {
			const currentLevel = self.volumeLevel
			let newLevel = currentLevel - Number(event.options.level)
			if (newLevel < 0) {
				newLevel = 0
			}
			const levelHex = newLevel?.toString(16).padStart(2, '0')
			await SendCommand(self, 'kf', levelHex)
		},
	}

	self.setActionDefinitions(actions)
}
