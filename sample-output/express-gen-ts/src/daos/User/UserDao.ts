import { IUser } from '@entities';

export interface IUserDao {
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export class UserDao implements IUserDao {

    /**
     *
     */
    public async getAll(): Promise<IUser[]> {
        // TODO
        return [] as any;
    }

    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<void> {
        // TODO
        return {} as any;
    }

    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
        // TODO
        return {} as any;
    }

    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }
}
