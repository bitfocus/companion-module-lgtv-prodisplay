import type { CompanionVariableDefinition } from '@companion-module/base'

import type { LGProDisplayInstance } from './main.js'

export function UpdateVariableDefinitions(self: LGProDisplayInstance): void {
	const variables: CompanionVariableDefinition[] = []

	variables.push({
		name: 'Power State',
		variableId: 'power_state',
	})
	variables.push({
		name: 'Current Input',
		variableId: 'current_input',
	})
	variables.push({
		name: 'Screen Mute State',
		variableId: 'screen_mute_state',
	})
	variables.push({
		name: 'Volume Level',
		variableId: 'volume_level',
	})
	variables.push({
		name: 'Volume Mute State',
		variableId: 'volume_mute_state',
	})

	self.setVariableDefinitions(variables)
}
