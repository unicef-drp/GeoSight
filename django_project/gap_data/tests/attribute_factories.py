from django.contrib.gis.geos import Polygon, MultiPolygon


def polygon_sample() -> MultiPolygon:
    """ Create multi poylygon sample
    """
    return MultiPolygon(
        Polygon(((0.0, 0.0), (0.0, 50.0), (50.0, 50.0), (50.0, 0.0), (0.0, 0.0))), srid=4326
    )
