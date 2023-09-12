import { ClientStorage } from ".";

export class LocalStorage implements ClientStorage {
    public set(key: string, value: any, ttl?: number): void {
      const data = JSON.stringify({ value, ttl: ttl ? Date.now() + ttl : null });
      window.localStorage.setItem(key, data);
    }
  
    public has(key: string): boolean {
      return window.localStorage.getItem(key) !== null;
    }
  
    public get(key: string): any {
      const data = window.localStorage.getItem(key);
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.ttl && Date.now() > parsedData.ttl) {
          this.delete(key);
          return null;
        }
        return parsedData.value;
      }
      return null;
    }
  
    public delete(key: string): void {
      window.localStorage.removeItem(key);
    }
  
    public refresh(key: string, ttl?: number): boolean {
      const data = this.get(key);
      if (data) {
        this.set(key, data, ttl);
        return true;
      }
      return false;
    }
  }
  