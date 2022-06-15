# GeoSight

[![Tests](https://github.com/unicef-drp/GeoSight/workflows/Tests/badge.svg)](https://github.com/unicef-drp/GeoSight/actions/workflows/tests.yaml)
[![Flake8](https://github.com/unicef-drp/GeoSight/workflows/Flake8/badge.svg)](https://github.com/unicef-drp/GeoSight/actions/workflows/flake8.yml)
[![Documentation](https://github.com/unicef-drp/GeoSight/workflows/Documentation/badge.svg)](https://unicef-drp.github.io/GeoSight/)

## QUICK INSTALLATION GUIDE

### Production

```
git clone https://github.com/unicef-drp/GeoSight
cd GeoSight/deployment
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
git clone https://github.com/unicef-drp/GeoSight
cd GeoSight/deployment
cp .template.env .env
docker-compose.override.template.yml docker-compose.override.yml

cd GeoSight
make up
make dev
```

Run the frontend dev with `frontend-dev`

#### Pycharm
Under Construction

The web will be available at `http://localhost:2000/`