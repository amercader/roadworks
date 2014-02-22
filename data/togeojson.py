import json

import pyproj

bng = pyproj.Proj(init='epsg:27700')
wgs84 = pyproj.Proj(init='epsg:4326')

features = []

with open('roadworks.json', 'r') as f:

    feed = json.loads(f.read())


    for work in feed:

        if (work['point'].get('easting') and 
            work['point'].get('northing')):
            coordinates = pyproj.transform(bng, wgs84,
                        work['point']['easting'],
                        work['point']['northing'])

        properties = {}
        for key, value in work.iteritems():
            if key != 'point':
                if isinstance(value, dict):
                    for subkey in value.keys():
                        properties[key + '_' + subkey] = value[subkey]
                else:
                    properties[key] = value


        features.append({
            'type': 'Feature',
            'geometry': {'type': 'Point', 'coordinates': coordinates or None},
            'properties': properties})

with open('roadworks.geojson', 'w') as f:

    out = {
        'type': 'FeatureCollection',
        'features': features
    }
    f.write(json.dumps(out))
