import { InstanceBase, runEntrypoint, type SomeCompanionConfigField } from '@companion-module/base'
import type { TCPHelper } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpdatePresets } from './presets.js'
import { InitConnection } from './api.js'

export class LGProDisplayInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	socket!: TCPHelper | null

	CHOICES_INPUTS: { id: string; label: string }[] = [
		{ id: '00', label: 'Digital TV Tuner' },
		{ id: '10', label: 'Analog TV Tuner' },
		{ id: '20', label: 'AV Composite Input' },
		{ id: '40', label: 'Component YPbPr' },
		{ id: '60', label: 'RGB D-Sub / PC Input' },
		{ id: '90', label: 'HDMI 1' },
		{ id: '91', label: 'HDMI 2' },
		{ id: '92', label: 'HDMI 3' },
		{ id: '93', label: 'HDMI 4' },
	]

	pollTimer: NodeJS.Timeout | null = null
	powerState: number = 0 // 0 = Off, 1 = On
	inputState: string = '90' // HDMI 1
	screenMuteState: number = 0 // 0 = Muted, 1 = Unmuted
	volumeLevel: number = 0 // Volume level (0-100)
	volumeMuteState: number = 0 // 0 = Muted, 1 = Unmuted

	constructor(internal: unknown) {
		super(internal)

		this.socket as TCPHelper | null
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		await InitConnection(this)
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.socket?.destroy()

		if (this.pollTimer) {
			clearInterval(this.pollTimer)
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		await InitConnection(this)
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}
}

runEntrypoint(LGProDisplayInstance, UpgradeScripts)
