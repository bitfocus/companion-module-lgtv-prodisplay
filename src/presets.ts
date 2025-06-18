import {
	type CompanionButtonPresetDefinition,
	type CompanionTextPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'

import type { LGProDisplayInstance } from './main.js'

export function UpdatePresets(self: LGProDisplayInstance): void {
	const presets: (CompanionButtonPresetDefinition | CompanionTextPresetDefinition)[] = []

	self.setPresetDefinitions(presets as unknown as CompanionPresetDefinitions)
}
