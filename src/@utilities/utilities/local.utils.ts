import {ObjectUtils} from './object.utils';
import {EncryptUtils} from '@utilities/utilities/encrypt.utils';

export abstract class LocalUtils {
    private static codeKey(key: string): string {
        return btoa(key.toUpperCase());
    }
    static setStorage(key: string, value: any): void {
        if (EncryptUtils.hasEncryption()) {
            localStorage.setItem(this.codeKey(key), EncryptUtils.encrypt(value));
        } else {
            let val: any;
            if (ObjectUtils.isObject(value)) {
                val = JSON.stringify(value);
            } else {
                val = value;
            }
            localStorage.setItem(key, val);
        }
    }

    static deleteStorage(key: string): void {
        if (EncryptUtils.hasEncryption()) {
            localStorage.removeItem(this.codeKey(key));
        } else {
            localStorage.removeItem(key);
        }
    }

    static getstorage(key: string): any {
        if (EncryptUtils.hasEncryption()) {
            return EncryptUtils.decrypt(localStorage.getItem(this.codeKey(key)));
        } else {
            let val = localStorage.getItem(key);
            try {
                val = JSON.parse(val);
            } catch (e) {}
            return val;
        }
    }
}
