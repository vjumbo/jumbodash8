import SimpleCrypto from 'simple-crypto-js';

export abstract class EncryptUtils {
    private static _key: string;
    private static _SimpleCrypto: any;
    static setKey(key: string): void {
        if (key && key !== null && key.length > 0) {
            this._key = key;
            this._SimpleCrypto = new SimpleCrypto(this._key);
        }
    }
    static hasEncryption(): boolean {
        return (this._key && this._key.length > 0 && this._SimpleCrypto);
    }
    static encrypt(data: any): string {
        if (this.hasEncryption() && data && data !== null) {
            return this._SimpleCrypto.encrypt(data);
        } else {
            return '';
        }
    }
    static decrypt(ciphered: string): any {
        if (this.hasEncryption() && ciphered && ciphered !== null && ciphered.length > 0) {
            let val: any = this._SimpleCrypto.decrypt(ciphered);
            try {
                val = JSON.parse(val);
            } catch (e) {}
            return val;
        } else {
            return null;
        }
    }

    static generateKey(): any {
        return SimpleCrypto.generateRandom();
    }
}
