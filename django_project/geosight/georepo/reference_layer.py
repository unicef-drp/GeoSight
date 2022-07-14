"""Reference Layer Control."""

from core.models.preferences import SitePreferences


class ReferenceLayer:
    """Reference Layer Control."""

    def __init__(self, identifier: str):
        """Init Class."""
        self.identifier = identifier
        self.georepo_url = SitePreferences.preferences().georepo_url.strip('/')

    @property
    def detail_url(self):
        """Return API link for reference detail."""
        return f'{self.georepo_url}/api/reference-layer/{self.identifier}/'
