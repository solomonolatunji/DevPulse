# Offline Strategy & Caching

DevPulse employs a stale-while-revalidate caching model:
1. Load cache instantly from AsyncStorage.
2. Dispatch background network fetch.
3. Update UI and persist fresh cache on success.
