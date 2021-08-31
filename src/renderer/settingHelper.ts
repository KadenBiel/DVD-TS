import Store from 'electron-store';
import { ISettings } from '../common/ISettings';
import { IpcRendererMessages } from '../common/ipc-messages'
import { ipcRenderer } from 'electron';

const store = new Store<ISettings>();

let colorDiv;

let colors = [];

ipcRenderer.send(IpcRendererMessages.GET_SETTINGS)
ipcRenderer.on(IpcRendererMessages.RETURN_SETTINGS, (event, settings) => {
    ipcRenderer.removeAllListeners(IpcRendererMessages.RETURN_SETTINGS);
	colorDiv = document.getElementById('colorDiv')
    store.set('size', settings.size);
	store.set('speed', settings.dvdSpeed);
    store.set('colors', settings.colors);
	store.set('askUpdate', settings.askUpdate);
    for (var i=0; i<settings.colors.length; i++) {
		var nColor = document.createElement('input');
		nColor.className = 'color';
		nColor.id = 'color'+i.toString;
		nColor.type = 'color';
		nColor.value = settings.colors[i];
		nColor.onchange = () => colorChange();
		colors[i] = nColor
		colorDiv.appendChild(nColor)
	}
	if (settings.colors === 0) {
		setDefaultSettings()
	}
});

export function setDefaultSettings() {
	var defColors = ['#0079fe','#0ed145','#ff7f27','#b83dba','#ec1c24','#fff200','#ff71ff','#ffffff'];
	store.set('size', 54);
	store.set('speed', 1);
	store.set('colors', defColors);
	store.set('askUpdate', true)
}

export function newColor(val='#ffffff') {
	colorDiv = document.getElementById('colorDiv')
    var nColor = document.createElement('input');
    nColor.className = 'color';
    nColor.id = 'color'+colors.length.toString;
    nColor.type = 'color';
    nColor.value = val;
	nColor.onchange = () => colorChange();
    colors[colors.length] = nColor;
    colorDiv.appendChild(nColor);
	colorChange()
}

export function remColor() {
	var oColor = colors.pop();
	oColor.remove();
	colorChange();
}

export function colorChange() {
	var dColor = []
	for (var i=0; i<colors.length; i++) {
		dColor[i] = colors[i].value
	}
	store.set('colors', dColor)
}

export function saveSettings() {
	console.log('saving settings')
	var size = store.get('size')
	var speed = store.get('speed')
	var colors = store.get('colors')
	var askUpdate = store.get('askUpdate')
	ipcRenderer.send(IpcRendererMessages.SAVE_SETTINGS, {
		size: size,
		dvdSpeed: speed,
		colors: colors,
		askUpdate: askUpdate
	})
}

export function get(setting) {
	return store.get(setting)
}

export function set(setting, value) {
	store.set(setting, value)
}