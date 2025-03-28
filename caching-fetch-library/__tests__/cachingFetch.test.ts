import {
  renderHook,
  waitFor,
} from "@testing-library/react";

import {
  initializeCache,
  preloadCachingFetch,
  serializeCache,
  useCachingFetch,
  wipeCache,
} from "../cachingFetch";

// Mock the global fetch
const mockFetch = global.fetch as jest.Mock;

describe("cachingFetch", () => {
  beforeEach(() => {
    wipeCache();
    mockFetch.mockClear();
  });

  describe("useCachingFetch", () => {
    it("should return loading state initially", () => {
      const { result } = renderHook(() => useCachingFetch("/api/people"));

      expect(result.current).toEqual({
        isLoading: true,
        data: null,
        error: null,
      });
    });

    it("should fetch data and update state", async () => {
      const mockData = [{ name: "Test User" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useCachingFetch("/api/people"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toEqual({
        isLoading: false,
        data: mockData,
        error: null,
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("/api/people");
    });

    it("should return cached data without fetching again", async () => {
      // First request
      const mockData = [{ name: "Test User" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result: result1 } = renderHook(() =>
        useCachingFetch("/api/people"),
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      // Second request to the same URL should use cache
      const { result: result2 } = renderHook(() =>
        useCachingFetch("/api/people"),
      );

      expect(result2.current).toEqual({
        isLoading: false,
        data: mockData,
        error: null,
      });

      // Fetch should only be called once for both hooks
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch errors", async () => {
      const errorMessage = "Network error";
      mockFetch.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useCachingFetch("/api/people"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(errorMessage);
      expect(result.current.data).toBeNull();
    });
  });

  describe("preloadCachingFetch", () => {
    it("should fetch and cache data", async () => {
      const mockData = [{ name: "Test User" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await preloadCachingFetch("/api/people");

      // Check that data is cached by using useCachingFetch
      const { result } = renderHook(() => useCachingFetch("/api/people"));

      // Data should be available immediately
      expect(result.current).toEqual({
        isLoading: false,
        data: mockData,
        error: null,
      });

      // Fetch should only be called once by preloadCachingFetch
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch errors", async () => {
      const errorMessage = "Network error";
      mockFetch.mockRejectedValueOnce(new Error(errorMessage));

      await expect(preloadCachingFetch("/api/people")).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("serializeCache and initializeCache", () => {
    it("should serialize and deserialize cache", async () => {
      const mockData = [{ name: "Test User" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Populate the cache
      await preloadCachingFetch("/api/people");

      // Serialize the cache
      const serializedCache = serializeCache();
      expect(serializedCache).toBeTruthy();
      expect(typeof serializedCache).toBe("string");

      // Clear the cache
      wipeCache();

      // Initialize from serialized cache
      initializeCache(serializedCache);

      // Check that data is available
      const { result } = renderHook(() => useCachingFetch("/api/people"));
      expect(result.current).toEqual({
        isLoading: false,
        data: mockData,
        error: null,
      });

      // No fetch should occur
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should handle invalid serialized cache", () => {
      // Won't throw, but will console.error
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      initializeCache("invalid json");

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("wipeCache", () => {
    it("should clear the cache", async () => {
      const mockData = [{ name: "Test User" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // First populate the cache
      await preloadCachingFetch("/api/people");

      // Wipe the cache
      wipeCache();

      // Set up a new mock for the second request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Data should be fetched again
      const { result } = renderHook(() => useCachingFetch("/api/people"));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Fetch should be called twice total
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
