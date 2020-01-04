import {SessionUtils} from './session.utils';
import {EncryptUtils} from '@utilities/utilities/encrypt.utils';
import {CurruserUtils} from '@utilities/utilities/curruser.utils';
import {ObjectUtils} from '@utilities/utilities/object.utils';

export abstract class LoginUtils {
    private static LoginKey(): string {
        if (EncryptUtils.hasEncryption()) {
            return btoa(EncryptUtils.encrypt(CurruserUtils.getToken()));
        } else {
            return btoa(JSON.stringify(CurruserUtils.getToken()));
        }
    }
    static isLoggedin(): boolean {
        let key: string;
        if (EncryptUtils.hasEncryption()) {
            key = EncryptUtils.decrypt(atob(SessionUtils.getSession('isLoggedin')));
            return ObjectUtils.areEquals(key, CurruserUtils.getToken());
        } else {
            const log = SessionUtils.getSession('isLoggedin');
            if (log === null) {
                return false;
            }
            key = atob(log);
            return ObjectUtils.areEquals(JSON.parse(key), CurruserUtils.getToken());
        }
    }

    static setLoggedin(): void {
        SessionUtils.setSession('isLoggedin', this.LoginKey());
    }

    static logOff(): void {
        sessionStorage.clear();
    }
}
