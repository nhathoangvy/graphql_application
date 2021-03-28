/// <reference path='./models.d.ts' />

import { join } from 'https://deno.land/std@0.61.0/path/mod.ts'
import { mkdir } from './utils.ts'
import {
	ARCHIVE_NAME,
	ARCHIVE_PATH,
	DATA_PATH,
	COLUMN_NAME,
	CARD_NAME
} from './constants.ts'

namespace Repositories {
	export abstract class Store<T> {
		public args: StoreArgs
	
		private filePath: string
		private dirExists: boolean
		private data: Array<Identifiable & T> = new Array<Identifiable & T>()
		
		protected constructor(opts: StoreArgs) {
			const {
				name = '.datastore',
				path = '.'
			} = opts || {}
			
			this.args = <StoreArgs> {
				name: name,
				path: path.startsWith('/') ? path : join(Deno.cwd(), path)
			}
			this.filePath = join(path, name)
			this.dirExists = false
		}
	
		private async load():Promise<Array<Identifiable & T>> {
			let data = this.data
			if (data.length > 0) return data
			try {
				const content = new TextDecoder().decode(await Deno.readFile(this.filePath))
				data = content && JSON.parse(content)
				this.dirExists = true
			}
			catch (e) {
				if (e.name !== 'NotFound') {
					throw e
				}
			}
	
			data = data || {}
			this.data = data
			return data
		}
	
		private async replace():Promise<void> {
			const { data, filePath } = this
	
			if (!this.data) {
				return
			}
	
			if (!this.dirExists) {
				await mkdir(this.args.path)
			}
	
			try {
				await Deno.writeFile(filePath, new TextEncoder().encode(JSON.stringify(data)), {
					mode: 0o0600
				})
			}
			catch (e) {
				throw e
			}
		}

		protected async get(
			{
				id,
				name,
				type
			}
		:Identifiable)
		:Promise<Identifiable & T> {
			await this.load();
			for(let item of this.data) {
				try {
					if (
						(type && item.type == type) ||
						(id && item.id == id) ||
						(name && item.name == name)
					) return item;
				} catch (e) {}
			}
			return <Identifiable & T>{};
		}
	
		protected async set(key: Identifiable & T):Promise<void> {
			await this.load();
			const now = new Date().toISOString();
			const obj = Object.assign(
				{
					created: now,
					updated: now
				}, 
			key);
			this.data.push(obj);
			this.replace();
		}
	
		protected async list():Promise<Array<Identifiable & T>> {
			return this.data.length > 0 ? this.data : await this.load()
		}

		protected async save(args: Array<Identifiable & T>):Promise<Boolean> {
			this.data = args;
			this.replace();
			return true;
		}
	}
	
	export class _Column extends Store<Column> implements StoreOptions<Column> {
		constructor(
			opts:StoreArgs = {
				name: COLUMN_NAME,
				path: DATA_PATH
			}
		){
			super(opts)
		}
		public async get(args: Identifiable):Promise<Identifiable & Column> {
			return super.get(args)
		}
	
		public async set(keys: any):Promise<void> {
			return super.set(keys)
		}
	
		public async lists():Promise<Array<Identifiable & Column>> {
			return super.list()
		}

		public async existed(keys: Column):Promise<Boolean> {
			const columns = await this.list();
			for (var col of columns) if (col.name == keys.name || col.order == keys.order) return true;
			return false;
		}

		public async update(keys:Column):Promise<Boolean> {
			const existed = await this.existed(keys);
			if (existed) return false;
			let onChange = false;
			const columns = await this.list();
			for (var col of columns) {
				if (col.id == keys.id) {
					if (keys.name) col.name = keys.name;
					if (keys.order) col.order = keys.order;
					col.updated = new Date().toISOString();
					onChange = true;
				}
			}
			
			if (onChange) await super.save(columns);
			return onChange;
		}

		public async remove(keys:Column):Promise<Boolean> {
			let onChange = false,
			 	columns = await this.list(),
				len = columns.length;
			columns = columns.filter(x => x.id != keys.id);
			if (len > columns.length) onChange = true;
			if (onChange) await super.save(columns);
			return onChange;
		}
		
	}

	export class _Card extends Store<Card> implements StoreOptions<Card> {
		constructor(
			opts: StoreArgs = {
				name: CARD_NAME,
				path: DATA_PATH
			}
		){
			super(opts)
		}
		public async get(args: Identifiable):Promise<Identifiable & Card> {
			return super.get(args)
		}
	
		public async set(keys: Card):Promise<void> {
			return super.set(keys)
		}
	
		public async lists(columnId?: string):Promise<Array<Identifiable & Card>> {
			const list = await super.list();
			return columnId ? list.filter(x => x.columnId == columnId): list;
		}

		public async existed(keys: Card):Promise<Boolean> {
			const cards = await this.list();
			for (var card of cards) if (card.name == keys.name || card.order == keys.order) return true;
			return false;
		}

		public async update(keys:Card):Promise<Boolean> {
			const existed = await this.existed(keys);
			if (existed) return false;
			let onChange = false;
			const cards = await this.list();
			for (var card of cards) {
				if (card.id == keys.id) {
					if (keys.name) card.name = keys.name;
					if (keys.order) card.order = keys.order;
					if (keys.status) card.status = keys.status;
					if (keys.description) card.description = keys.description;
					card.updated = new Date().toISOString();
					onChange = true;
				}
			}
			
			if (onChange) await super.save(cards);
			return onChange;
		}

		public async remove(keys:Card):Promise<Boolean> {
			let onChange = false,
			 	cards = await this.list(),
				len = cards.length;
			cards = cards.filter(x => x.id != keys.id);
			if (len > cards.length) onChange = true;
			if (onChange) await super.save(cards);
			return onChange;
		}
	}

	export class _Archive extends Store<Archive<object>> implements StoreOptions<Archive<object>> {
		public info: any
		constructor(
			opts: StoreArgs = {
				name: ARCHIVE_NAME,
				path: ARCHIVE_PATH
			}
		){
			super(opts);
		}

		private async installize():Promise<void> {
			const storage = await super.get({type: this.info});
			if (storage) return;
			const init:Archive<object> = {
				type: this.info,
				contents: Array<object>()
			};
			await super.set(init);
		}

		public async get(args: Identifiable):Promise<Identifiable & Archive<object>> {
			return super.get(args)
		}
	
		public async set(keys: Archive<object>):Promise<void> {
			return super.set(keys)
		}

		public async create_block(info: string):Promise<void> {
			this.info = info;
			await this.installize();
		}

		public async push(name: string, keys: any):Promise<Boolean> {
			const storages = await super.list();
			for (var storage of storages) if (storage.type == name) storage.contents.push(keys);
			return super.save(storages);
		}
	}
}

const createInstance = <A extends Repositories.Store<T & any>, T>(c: new () => A ): A => {
	return new c();
}

const archive = createInstance(
	Repositories._Archive
)

/* Create schema block type for archiving */
archive.create_block("column"); 
archive.create_block("card");

const column = createInstance(
	Repositories._Column
)

const card = createInstance(
	Repositories._Card
)

export {archive, column, card};