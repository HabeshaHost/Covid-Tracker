import { toCamelCase } from "../toCamelCase";

describe('toCamelCase', () => {
    it('should convert object keys to camelCase', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        age: 30,
      };
      const result = toCamelCase(obj);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
    });
  
    it('should handle nested objects', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        address: {
          street_name: 'Main St',
          zip_code: '12345',
        },
      };
      const result = toCamelCase(obj);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        address: {
          streetName: 'Main St',
          zipCode: '12345',
        },
      });
    });
  
    it('should handle arrays', () => {
      const arr = [
        { first_name: 'John', last_name: 'Doe' },
        { first_name: 'Jane', last_name: 'Doe' },
      ];
      const result = toCamelCase(arr);
      expect(result).toEqual([
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' },
      ]);
    });
  
    it('should return the same value for non-objects and non-arrays', () => {
      expect(toCamelCase(42)).toBe(42);
      expect(toCamelCase('hello')).toBe('hello');
      expect(toCamelCase(null)).toBe(null);
      expect(toCamelCase(undefined)).toBe(undefined);
    });
  });