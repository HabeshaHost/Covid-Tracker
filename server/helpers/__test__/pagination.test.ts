import { paginate } from "../pagination";


describe('paginate function', () => {
  it('should return an empty array when the input array is empty', () => {
    const result = paginate([], { page: 1, pageSize: 10 });
    expect(result).toEqual({ page: 1, pageSize: 10, total: 0, data: [] });
  });

  it('should return all elements when the array has fewer elements than pageSize', () => {
    const result = paginate([1, 2, 3], { page: 1, pageSize: 10 });
    expect(result).toEqual({ page: 1, pageSize: 10, total: 3, data: [1, 2, 3] });
  });

  it('should return the first page with default page and pageSize', () => {
    const result = paginate([1, 2, 3, 4, 5], { page: 1, pageSize: 2 });
    expect(result).toEqual({ page: 1, pageSize: 2, total: 5, data: [1, 2] });
  });

  it('should return an empty array when the page is greater than the number of pages available', () => {
    const result = paginate([1, 2, 3, 4, 5], { page: 3, pageSize: 2 });
    expect(result).toEqual({ page: 3, pageSize: 2, total: 5, data: [5] });
  });

  it('should return the correct elements for a valid page and pageSize', () => {
    const result = paginate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { page: 2, pageSize: 3 });
    expect(result).toEqual({ page: 2, pageSize: 3, total: 10, data: [4, 5, 6] });
  });
});
