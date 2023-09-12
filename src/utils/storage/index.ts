import { LocalStorage } from './LocalStorage';

export enum ClientStorageType {
    LOCAL_STORAGE = 'LOCAL_STORAGE',
  }
  
  export interface ClientStorage {
    set: (key: string, value: any, ttl?: number) => void;
    has: (key: string) => boolean;
    get: (key: string) => any;
    delete: (key: string) => void;
    refresh: (key: string, ttl?: number) => boolean;
  }
  
  export function ClientStorageFactory(type: ClientStorageType): ClientStorage {
    switch (type) {
      case ClientStorageType.LOCAL_STORAGE:
        return new LocalStorage();
      default:
        throw new Error("Unsupported storage type");
    }
  }
  
  class StorageSingleton implements ClientStorage {
    // Moved the environment variable check to a static field
    private static storageType = process.env.REACT_APP_API_CLIENT_STORAGE ?? ClientStorageType.LOCAL_STORAGE;
    private static instance: ClientStorage | null = null;
    
    // Lazy initialization of the ClientStorage instance
    private static getInstance(): ClientStorage {
      if (!this.instance) {
        this.instance = ClientStorageFactory(this.storageType as ClientStorageType);
      }
      return this.instance;
    }
  
    public set(key: string, value: any, ttl?: number): void {
      StorageSingleton.getInstance().set(key, value, ttl);
    }
  
    public has(key: string): boolean {
      return StorageSingleton.getInstance().has(key);
    }
  
    public get(key: string): any {
      return StorageSingleton.getInstance().get(key);
    }
  
    public delete(key: string): void {
      StorageSingleton.getInstance().delete(key);
    }
  
    public refresh(key: string, ttl?: number): boolean {
      return StorageSingleton.getInstance().refresh(key, ttl);
    }
  }
  
const session = new StorageSingleton();
export default session;