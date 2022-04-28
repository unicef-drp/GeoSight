"""Geometry form."""
import json
import os
import shutil
import zipfile

from django import forms
from django.conf import settings
from django.contrib.gis.gdal import DataSource, GDALException
from django.core.exceptions import ValidationError

from gap_data.models.geometry import GeometryLevelName

ADD_JUST_NEW = 'Just add new geometry'
REPLACE_AND_ADD = 'Replace and add everything'
CHOICES = (
    (ADD_JUST_NEW, ADD_JUST_NEW),
    # TODO:
    #  Need to implement it
    # (REPLACE_AND_ADD, REPLACE_AND_ADD)
)


class GeometryForm(forms.Form):
    """Form to upload CSV file."""

    label_suffix = ""
    level = forms.ModelChoiceField(
        GeometryLevelName.objects.all()
    )
    code_column = forms.CharField(
        help_text='Column name on the geojson that is code.',
    )
    name_column = forms.CharField(
        help_text='Column name on the geojson that is name.',
    )
    parent_code_column = forms.CharField(
        help_text=(
            '[Optional] Column code on the geojson that is code of parent.'
        ),
        required=False
    )
    replace_method = forms.ChoiceField(
        choices=CHOICES
    )
    file_type = forms.CharField(
        required=False
    )
    file = forms.FileField(
        widget=forms.FileInput(
            attrs={
                'accept': '.geojson, .cpg, .dbf, .prj, .shp, .shx, .zip',
                'multiple': 'multiple'
            }
        ),
        help_text='Can receive geojson or shapefile',
    )

    def __init__(self, *args, **kwargs):
        """Init."""
        level = None
        self.uuid = None
        try:
            level = kwargs.pop("level")
            self.uuid = kwargs.pop("uuid")
        except KeyError:
            pass
        super().__init__(*args, **kwargs)
        if level:
            self.fields['level'].choices = [(u.id, u.name) for u in level]

    def temporary_folder(self):
        """Temporary folder."""
        folder = os.path.join(settings.MEDIA_ROOT, 'temp', str(self.uuid))
        if not os.path.exists(folder):
            os.makedirs(folder)
        return folder

    def temporary_filename(self, filename):
        """Temporary filename."""
        return os.path.join('temp', str(self.uuid), filename)

    def clean_file(self):
        """Clean file."""
        try:
            SHAPEFILE = 'shapefile'
            GEOJSON = 'geojson'
            ZIPFILE = 'zipfile'
            file_type = self.cleaned_data['file_type']
            name_column = self.cleaned_data['name_column']
            code_column = self.cleaned_data['code_column']
            parent_code_column = self.cleaned_data['parent_code_column']

            # check files
            file = None
            for (dirpath, dirnames, filenames) in os.walk(
                    self.temporary_folder()
            ):
                for filename in filenames:
                    just_filename, file_extension = os.path.splitext(filename)
                    if (file_type, file_extension) in [
                        (SHAPEFILE, '.shp'),
                        (GEOJSON, '.geojson'),
                        (ZIPFILE, '.zip')
                    ]:
                        file = os.path.join(self.temporary_folder(), filename)

            # extract file if it is zipfile
            # and recheck the shapefile
            if file and file_type == ZIPFILE:
                with zipfile.ZipFile(file, 'r') as zip_ref:
                    zip_ref.extractall(self.temporary_folder())

                file = None
                for (dirpath, dirnames, filenames) in os.walk(
                        self.temporary_folder()):
                    for filename in filenames:
                        just_filename, file_extension = os.path.splitext(
                            filename)
                        if file_extension == '.shp':
                            file = os.path.join(self.temporary_folder(),
                                                filename)

            if not file:
                shutil.rmtree(self.temporary_folder())
                raise ValidationError('File does not recognized')

            features = []
            if file_type == GEOJSON:
                objects = json.load(open(file, "rb"))
                for feature in objects['features']:
                    properties = feature['properties']
                    try:
                        feature['properties'] = {
                            'name': properties[name_column],
                            'identifier': f'{properties[code_column]}',
                            'parent_identifier': (
                                f'{properties.get(parent_code_column)}'
                            ),
                        }
                        features.append(feature)
                    except KeyError as e:
                        shutil.rmtree(self.temporary_folder())
                        raise ValidationError(f'No column named {e}')
            else:
                try:
                    data_source = DataSource(file)
                    for feature in data_source[0]:
                        parent_identifier = feature.get(
                            parent_code_column) if parent_code_column else None
                        feature = {
                            "type": "Feature",
                            "geometry": feature.geom.json,
                            "properties": {
                                'name': feature[name_column],
                                'identifier': f'{feature[code_column]}',
                                'parent_identifier': f'{parent_identifier}',
                            }
                        }
                        features.append(feature)
                except (KeyError, IndexError) as e:
                    shutil.rmtree(self.temporary_folder())
                    raise ValidationError(f'No column named {e}')
                except GDALException:
                    shutil.rmtree(self.temporary_folder())
                    raise ValidationError('Shapefile is broken')

            shutil.rmtree(self.temporary_folder())
            return {
                "type": "FeatureCollection",
                "features": features
            }
        except ValidationError as e:
            shutil.rmtree(self.temporary_folder())
            raise ValidationError(e)
