import { ProgressInfo, UpdateInfo } from 'builder-util-runtime';

// Renderer --> Main (send/on)
export enum IpcMessages {
	SHOW_ERROR_DIALOG = 'SHOW_ERROR_DIALOG',
	RESTART_DVD = 'RESTART_DVD',
	QUIT_DVD = 'QUIT_CREWLINK',
	RESTART_AND_UPDATE = 'RESTART_AND_UPDATE',
}

export enum IpcRendererMessages {
	GET_VERSION = 'GET_VERSION',
	RETURN_VERSION = 'RETURN_VERSION',
	AUTO_UPDATER_STATE = 'AUTO_UPDATER_STATE',
	SAVE_SETTINGS = 'SAVE_SETTINGS',
	CLEAR_SETTINGS = 'CLEAR_SETTINGS'
}

export interface AutoUpdaterState {
	state: 'error' | 'available' | 'downloading' | 'downloaded' | 'unavailable';
	error?: string;
	progress?: ProgressInfo;
	info?: UpdateInfo;
}