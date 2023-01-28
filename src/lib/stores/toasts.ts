import { writable } from 'svelte/store';
import uniqid from 'uniqid';

type ToastMessage = {
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
	id: string;
};

function createToastsStore() {
	const { subscribe } = writable<ToastMessage[]>([
		{
			type: 'warning',
			message: 'some message',
			id: uniqid()
		},
		{
			type: 'error',
			message: 'some message',
			id: uniqid()
		}
	]);
	return {
		subscribe
	};
}

export default createToastsStore();
