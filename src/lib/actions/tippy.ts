import tippy, { type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function (node: HTMLElement, options?: Partial<Props>) {
	const instance = tippy(node, options);
	return {
		update(newOptions: Partial<Props>) {
			instance.setProps(newOptions);
		},
		destroy() {
			instance.destroy();
		}
	};
}
