import { IUserDto } from '../user/user.dto';
import cluster from 'cluster';

export class MasterInMemoryDB {
  public async get(value: any): Promise<IUserDto | undefined> {
    const user = await this.sendCommandToMasterProcess('getUserById', [value]);
    return user;
  }

  public async save(value: any): Promise<void> {
    await this.sendCommandToMasterProcess('createUser', [value]);
  }

  public async delete(value: any): Promise<void> {
    await this.sendCommandToMasterProcess('deleteUser', [value]);
  }

  public async clear(): Promise<void> {
    return await this.sendCommandToMasterProcess('clearAll');
  }

  public async getAll(): Promise<IUserDto[]> {
    return await this.sendCommandToMasterProcess('getAllUsers');
  }

  private async sendCommandToMasterProcess(method: string, parameters: any[] = []): Promise<any> {
    return await new Promise((resolve, reject) => {
      process.send!({ method, parameters });
      cluster.worker!.once('message', (msg) => {
        if (msg.method === method) {
          resolve(msg.data);
        } else {
          reject(msg);
        }
      });
    });
  }
}
