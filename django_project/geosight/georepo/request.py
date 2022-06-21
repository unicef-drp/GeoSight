"""Reference Layer Control."""

from core.models.preferences import SitePreferences


class GeorepoUrl:
    """Reference Layer Control."""

    def __init__(self):
        """Init Class."""
        self.georepo_url = SitePreferences.preferences().georepo_url.strip('/')

    @property
    def reference_layer_list(self):
        return f'{self.georepo_url}/api/reference-layer/list'
