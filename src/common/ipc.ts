import { ProgressInfo } from 'builder-util-runtime';

// Renderer --> Main (send/on)
export enum IpcMessages {
	SHOW_ERROR_DIALOG = 'SHOW_ERROR_DIALOG',
	QUIT_DVD = 'QUIT_CREWLINK',
}

// Renderer --> Main (sendSync/on)
export enum IpcSyncMessages {
	GET_INITIAL_STATE = 'GET_INITIAL_STATE',
}

// Main --> Renderer (send/on)
export enum IpcRendererMessages {
	ERROR = 'ERROR',
	AUTO_UPDATER_STATE = 'AUTO_UPDATER_STATE',
}

export interface AutoUpdaterState {
	state: 'error' | 'available' | 'downloading' | 'downloaded' | 'unavailable';
	error?: string;
	progress?: ProgressInfo;
}