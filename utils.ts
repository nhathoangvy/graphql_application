import { uuid as genId} from " https://deno.land/x/uuid/mod.ts";

const directoryExists = async (dir: string, parent: string) => {
	for await (const entry of Deno.readDir(parent)) {
		if (entry.isDirectory && entry.name === dir) {
			return true
		}
	}
	return false
}

const mkdir = async (path: string) => {
	const parent = Deno.cwd()
	const segments = path.replace(parent, '').split('/')
	let exists = true

	for (let i = 0; i < segments.length; i++) {
		const s = segments[i]

		if (!s || !i && s === '.') {
			continue
		}
		else if (s === '..') {
			return
		}

		if (!await directoryExists(s, parent + segments.slice(0, i).join('/'))) {
			exists = false
			break
		}
	}

	if (!exists) {
		await Deno.mkdir(path, {
			recursive: true
		})
		return path
	}
}

function IdentifiableSubclass<T extends Base>(SuperClass: Constructor<T>) {
	class C extends (<Constructor<Base>>SuperClass) {
		public id = null;
	}
	return <Constructor<Identifiable & T>>C;
}

export { genId, mkdir, directoryExists, IdentifiableSubclass }