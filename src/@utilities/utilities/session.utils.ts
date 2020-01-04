import {ObjectUtils} from './object.utils';
import {EncryptUtils} from '@utilities/utilities/encrypt.utils';

export abstract class SessionUtils {
    private static codeKey(key: string): string {
        return btoa(key.toUpperCase());
    }

    static setSession(key: string, value: any): void {
        if (EncryptUtils.hasEncryption()) {
            sessionStorage.setItem(this.codeKey(key), EncryptUtils.encrypt(value));
        } else {
            let val: any;
            if (ObjectUtils.isObject(value)) {
                val = JSON.stringify(value);
            } else {
                val = value;
            }
            sessionStorage.setItem(key, val);
        }
    }
    static deleteSession(key: string): void {
        if (EncryptUtils.hasEncryption()) {
            sessionStorage.removeItem(this.codeKey(key));
        } else {
            sessionStorage.removeItem(key);
        }
    }
    static getSession(key: string): any {
        if (EncryptUtils.hasEncryption()) {
            return EncryptUtils.decrypt(sessionStorage.getItem(this.codeKey(key)));
        } else {
            let val = sessionStorage.getItem(key);
            try {
                val = JSON.parse(val);
            } catch (e) {}
            return val;
        }
    }
}
