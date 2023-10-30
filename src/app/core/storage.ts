import { countryConfig } from 'src/country-config/country-config';
import { environment } from '../../environments/environment';

declare var require: any;

/**
 * Clase para el Manejo de los datos almacenados en el Storage del navegador.
 */
export class Storage {
	
	static get prefix() {
		const prefix = countryConfig.isColombia ? 'c0l' : 'v3n';
		const version= countryConfig.version;
		return `${version}m0n${prefix}`;
	}

	/**
	 * @ignore
	 */
	static CryptoJS = require('crypto-js');

	/**
	 * Remueve un valor en el almacenamiento local.
	 * @param {string} key key Nombre del valor a remover
	 */
	static remove ( key:string ) { localStorage.removeItem(`${Storage.prefix}_${key.toLowerCase()}`) }
	// para sessionStorage
	static removeSession ( key:string ) { sessionStorage.removeItem(`${Storage.prefix}_${key.toLowerCase()}`) }

	/**
	 * Obtiene Un valor tipo String del almacenamiento local.
	 * @param {string} key Nombre del valor a recuperar.
	 * @return {string} Retorna un string con el valor.
	 */
	static getOne ( key:string ) : string {
		return JSON.parse(this.decrypt(localStorage.getItem(`${Storage.prefix}_${key.toLowerCase()}`)));
	}
	// para sessionStorage
	static getOneSession ( key:string ) : string {
		return JSON.parse(this.decrypt(sessionStorage.getItem(`${Storage.prefix}_${key.toLowerCase()}`)));
	}

	
	/**
	 * Obtiene un Objeto almacenado en el almacenamiento local.
	 * @param {string} key Clave el Objeto a recuperar.
	 * @return {Object} Retorna Objeto recuperado del Storage.
	 */
	 static getAll ( key:string ) : any {
		let info = localStorage.getItem( `${Storage.prefix}_${key.toLowerCase()}` );
		if(info) {
			let dcp = this.decrypt(info);
			try {
				return (dcp && typeof dcp === 'string') ? JSON.parse( dcp ) : dcp;
			} catch {
				return dcp;
			}
		} else {
			return undefined;
		}
	}
	// para sessionStorage
	static getAllSession ( key:string ) : any {
		let info = sessionStorage.getItem( `${Storage.prefix}_${key.toLowerCase()}` );
		if(info) {
			let dcp = this.decrypt(info);
			try {
				return (dcp && typeof dcp === 'string') ? JSON.parse( dcp ) : dcp;
			} catch {
				return dcp;
			}
		} else {
			return undefined;
		}
	}

	/**
	 * Almacena un valor String en el almacenamiento local.
	 * @param {string}	key		Clave del valor .
	 * @param {string}	Value	Valor a almacenar.
	 */
	 static setOne ( key:string, value:string ) {
		return localStorage.setItem( `${Storage.prefix}_${key.toLowerCase()}`, this.encrypt(JSON.stringify(value)) );
	}
	// para sessionStorage
	static setOneSession ( key:string, value:string ) {
		return sessionStorage.setItem( `${Storage.prefix}_${key.toLowerCase()}`, this.encrypt(JSON.stringify(value)) );
	}

	

	/**
	 * Recupera Objecto desde el Storage del navegador.
	 * @param {string}	key		Clave del Objeto para almacenar.
	 * @param {any}		value	Objecto para Almacenar.
	 * @returns {void}	No tiene retorno de información.
	 */
	 static setAll ( key:string, value:any ) : void {
		let data = this.encrypt( JSON.stringify(value) );
		localStorage.setItem( `${Storage.prefix}_${key.toLowerCase()}`, data );
	}
	// para sessionStorage
	static setAllSession ( key:string, value:any ) : void {
		let data = this.encrypt( JSON.stringify(value) );
		sessionStorage.setItem( `${Storage.prefix}_${key.toLowerCase()}`, data );
	}
	
	/**
	 * Remueve todos los datos del almacenamiento local.
	 * @returns {void} No retorna valor.
	 */
	 static clear () : void { localStorage.clear(); }
	// para sessionStorage
	 static clearSession () : void { sessionStorage.clear(); }

	/**
	 * Comprueba existencia de un valor en el Storage del navegador.
	 * @param {boolean} return Valor boolean si existe valor en el Storage del navegador.
	 */
	 static check ( key:string ) : boolean {
		let data = localStorage.getItem( `${Storage.prefix}_${key.toLowerCase()}` );
		return data !== null;
	}
	// para sessionStorage
	static checkSession ( key:string ) : boolean {
		let data = sessionStorage.getItem( `${Storage.prefix}_${key.toLowerCase()}` );
		return data !== null;
	}

	/**
	 * Remove un objeto almacenado en SesionStorage
	 * @param key nombre del objeto a remover.
	 */
	static removeOne(key: string) : void {
		localStorage.removeItem( `${Storage.prefix}_${key.toLowerCase()}` )
	}

	/**
	 * Remove un objeto almacenado en SesionStorage
	 * @param key nombre del objeto a remover.
	 */
	static removeOneSession(key: string) : void {
		sessionStorage.removeItem( `${Storage.prefix}_${key.toLowerCase()}` )
	}

	/**
	 * Convierte una cadena de texto en una encriptada.
	 * @param {string} Cadena para encriptación
	 */
	static encrypt(data:string){
		if(environment.production)
			return this.CryptoJS.AES.encrypt(data, 'm0n1t0rFtD_');
		else
			return data;
	}

	/**
	 * Desencriptar una cadena de texto encriptada previamente.
	 * @param {string} Cadena de texto para desencriptación
	 */
	static decrypt(ciphertext:string) {
		let resp = '';
		let stringfy = '';
		if(ciphertext) {
			if(environment.production) {
				let bytes  = this.CryptoJS.AES.decrypt(ciphertext, 'm0n1t0rFtD_');
				stringfy = bytes.toString(this.CryptoJS.enc.Utf8);
			}else {
				stringfy = ciphertext;
			}
			try {
				return stringfy;
			} catch {
				return null;
			}
		}
		return null;
	}

}
