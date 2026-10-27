"""
GitWit High-Performance In-Memory & Redis-Compatible Cache Manager
Author: Sanskar Sontakke (@sanskar-code)
"""

import time
from typing import Any, Optional, Dict
from collections import OrderedDict

class MemoryCacheManager:
    def __init__(self, default_ttl_seconds: int = 300, max_items: int = 1000):
        self.default_ttl = default_ttl_seconds
        self.max_items = max_items
        self._store: Dict[str, Dict[str, Any]] = OrderedDict()

    def get(self, key: str) -> Optional[Any]:
        """Retrieve key if not expired, refreshing LRU position"""
        if key not in self._store:
            return None

        entry = self._store[key]
        if time.time() > entry["expires_at"]:
            del self._store[key]
            return None

        # Move to end for LRU refresh
        self._store.move_to_end(key)
        return entry["value"]

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        """Set value with TTL and evict oldest if capacity reached"""
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        expires_at = time.time() + ttl

        if key in self._store:
            self._store.move_to_end(key)
        self._store[key] = {"value": value, "expires_at": expires_at}

        if len(self._store) > self.max_items:
            # Evict oldest item
            self._store.popitem(last=False)

    def delete(self, key: str):
        """Manually purge cache entry"""
        if key in self._store:
            del self._store[key]

    def clear(self):
        """Flush entire cache"""
        self._store.clear()

    def get_stats(self) -> Dict[str, Any]:
        """Return cache health metrics"""
        active_count = sum(1 for entry in self._store.values() if time.time() <= entry["expires_at"])
        return {
            "total_keys": len(self._store),
            "active_keys": active_count,
            "max_capacity": self.max_items,
            "default_ttl_seconds": self.default_ttl
        }

cache_manager = MemoryCacheManager()
