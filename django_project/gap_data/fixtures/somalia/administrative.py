"""Import somalia geometry."""
import json
import os

from django.contrib.gis.geos import GEOSGeometry, MultiPolygon, Polygon

from core.settings.utils import DJANGO_ROOT
from gap_data.models import Geometry, GeometryLevelName, Instance


def run():
    """Run importer geometries of somalia."""
    folder = os.path.join(DJANGO_ROOT, 'gap_data', 'fixtures', 'somalia')

    try:
        instance = Instance.objects.get(name__iexact='Somalia')

        # country level
        country_level = GeometryLevelName.objects.get(
            name__iexact='country')
        geojson = json.load(
            open(os.path.join(folder, 'som_adm_0.geojson'))
        )
        for feature in geojson['features']:
            properties = feature['properties']
            Geometry.objects.get_or_create(
                instance=instance,
                identifier=properties['admin0Pcod'],
                defaults={
                    'name': properties['admin0Name'],
                    'geometry': GEOSGeometry(
                        json.dumps(feature['geometry'])
                    ),
                    'geometry_level': country_level
                }
            )

        # region level
        region_level = GeometryLevelName.objects.get(
            name__iexact='region')
        geojson = json.load(
            open(os.path.join(folder, 'som_adm_1.geojson'))
        )
        for feature in geojson['features']:
            properties = feature['properties']

            # get the country
            country = Geometry.objects.get(
                instance=instance,
                identifier=properties['admin0Pcod']
            )
            # save the geometry
            Geometry.objects.get_or_create(
                instance=instance,
                identifier=properties['admin1Pcod'],
                defaults={
                    'name': properties['admin1Name'],
                    'alias': properties['admin1AltN'],
                    'geometry': GEOSGeometry(
                        json.dumps(feature['geometry'])
                    ),
                    'geometry_level': region_level,
                    'child_of': country
                }
            )

        # district level
        district_level = GeometryLevelName.objects.get(
            name__iexact='district')
        geojson = json.load(
            open(os.path.join(folder, 'som_adm_2.geojson'))
        )
        for feature in geojson['features']:
            properties = feature['properties']
            # get the country
            region = Geometry.objects.get(
                instance=instance,
                identifier=properties['admin1Pcod']
            )
            # save the geometry
            geometry = GEOSGeometry(
                json.dumps(feature['geometry'])
            )
            if isinstance(geometry, Polygon):
                geometry = MultiPolygon(geometry)
            Geometry.objects.get_or_create(
                instance=instance,
                identifier=properties['admin2Pcod'],
                defaults={
                    'name': properties['admin2Name'],
                    'alias': properties['admin2AltN'],
                    'geometry': geometry,
                    'geometry_level': district_level,
                    'child_of': region
                }
            )
    except (
            Geometry.DoesNotExist,
            GeometryLevelName.DoesNotExist,
            Instance.DoesNotExist
    ):
        pass
