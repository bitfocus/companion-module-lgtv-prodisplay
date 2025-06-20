import { CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import type { LGProDisplayInstance } from './main.js'

export function UpdateFeedbacks(self: LGProDisplayInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	feedbacks.powerState = {
		type: 'boolean',
		name: 'Power On',
		description: 'True if display is on',
		defaultStyle: {
			color: combineRgb(255, 255, 255), // White text
			bgcolor: combineRgb(0, 255, 0), // Green background
		},
		options: [],
		callback: () => self.powerState == 1,
	}

	feedbacks.inputState = {
		type: 'boolean',
		name: 'Current Input',
		description: 'True if selected input is active',
		defaultStyle: {
			color: combineRgb(255, 255, 255), // White text
			bgcolor: combineRgb(0, 255, 0), // Green background
		},
		options: [
			{
				type: 'dropdown',
				id: 'input',
				label: 'Input',
				default: '90',
				choices: self.CHOICES_INPUTS,
			},
		],
		callback: (feedback) => self.inputState === feedback.options.input,
	}

	feedbacks.screenMuteState = {
		type: 'boolean',
		name: 'Screen Mute Active',
		description: 'True if screen mute is on',
		defaultStyle: {
			color: combineRgb(255, 255, 255), // White text
			bgcolor: combineRgb(0, 255, 0), // Green background
		},
		options: [],
		callback: () => self.screenMuteState == 0,
	}

	feedbacks.volumeMuteState = {
		type: 'boolean',
		name: 'Volume Mute Active',
		description: 'True if volume mute is on',
		defaultStyle: {
			color: combineRgb(255, 255, 255), // White text
			bgcolor: combineRgb(0, 255, 0), // Green background
		},
		options: [],
		callback: () => self.volumeMuteState == 0,
	}

	self.setFeedbackDefinitions(feedbacks)
}
