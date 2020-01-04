import {SessionUtils} from './session.utils';

export abstract class CurruserUtils {
    static setCurrentUser(value: any): void {
        SessionUtils.setSession('currentUser', value);
    }

    static getCurrentUser(): any {
        return SessionUtils.getSession('currentUser');
    }

    static getToken(): any {
        const curr = this.getCurrentUser();
        if (!curr) { return {username: null, token: null};}
        const {user_name = null, DashUser = null} = curr;
        return {username: user_name, token: DashUser && DashUser.token ? DashUser.token : null};
    }
}
