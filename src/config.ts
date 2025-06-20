import type { SomeCompanionConfigField } from '@companion-module/base'
import { Regex } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
	setId: number
	pollInterval: number
	verbose: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls LG Professional Displays.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Display IP Address',
			default: '',
			width: 6,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'TCP Port',
			default: 9761,
			min: 1,
			max: 65535,
			required: true,
			width: 6,
		},
		{
			type: 'number',
			id: 'setId',
			label: 'Set ID (0–99)',
			default: 0,
			min: 0,
			max: 99,
			required: true,
			width: 6,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Polling Interval (ms)',
			default: 5000,
			min: 1000,
			max: 60000,
			required: true,
			width: 6,
		},
		{
			type: 'static-text',
			id: 'hr1',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false,
			width: 4,
		},
	]
}
