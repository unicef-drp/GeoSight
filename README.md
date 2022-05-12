# Gis-geo Analytics Platform (GAP) Dashboard

[![Tests](https://github.com/unicef-drp/gis_geo_analytics-platform/workflows/Tests/badge.svg)](https://github.com/unicef-drp/gis_geo_analytics-platform/actions/workflows/tests.yaml)
[![Flake8](https://github.com/unicef-drp/gis_geo_analytics-platform/workflows/Flake8/badge.svg)](https://github.com/unicef-drp/gis_geo_analytics-platform/actions/workflows/flake8.yml)
[![Documentation](https://github.com/unicef-drp/gis_geo_analytics-platform/workflows/Documentation/badge.svg)](https://unicef-drp.github.io/gis_geo_analytics-platform/)

## QUICK INSTALLATION GUIDE

### Production

```
git clone https://github.com/unicef-drp/gis_geo_analytics-platform
cd gis_geo_analytics-platform/deployment
docker-compose up -d
```

The web will be available at `http://127.0.0.1/`

To stop containers:

```
docker-compose kill
```

To stop and delete containers:

```
docker-compose down
```

### Development

```
git clone https://github.com/unicef-drp/gis_geo_analytics-platform
cd gis_geo_analytics-platform/deployment
cp .template.env .env
docker-compose.override.template.yml docker-compose.override.yml

cd gis_geo_analytics-platform
make up
make dev
```

Run the frontend dev with `frontend-dev`

#### Pycharm
Under Construction

The web will be available at `http://localhost:2000/`