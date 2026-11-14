"""Rate limiting dependency using slowapi."""
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings

_settings = get_settings()

limiter = Limiter(key_func=get_remote_address)

# Exported limit string used in route decorators
analyze_rate_limit = f"{_settings.rate_limit_per_minute}/minute"
