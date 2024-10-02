const week9 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 450,
  "height": 550,
  "projection": {
    "type": "mercator",
    "center": [
      149,
      -18
    ],
    "scale": 2100,
    "translate": [
      300,
      300
    ]
  },
  "title": "Live Coral Cover in the Great Barrier Reef in the 2020s",
  "layer": [
    {
      "data": {
        "url": "oceanland.json",
        "format": {
          "type": "topojson",
          "feature": "ne_50m_land"
        }
      },
      "mark": {
        "type": "geoshape",
        "fill": "#DDA15E",
        "stroke": "black"
      }
    },
    {
      "data": {
        "url": "oceanland.json",
        "format": {
          "type": "topojson",
          "feature": "ne_50m_ocean"
        }
      },
      "mark": {
        "type": "geoshape",
        "fill": "#ADD8E6",
        "stroke": "black"
      }
    },
    {
      "data": {
        "url": "ne_10m_geography_marine_polys.json",
        "format": {
          "type": "topojson",
          "feature": "ne_10m_geography_marine_polys"
        }
      },
      "mark": {
        "type": "geoshape",
        "fill": "#6495ED",
        "stroke": "rgba(0, 0, 0, 0.5)"
      }
    },
    {
      "data": {
        "url": "graticules_5.json",
        "format": {
          "type": "topojson",
          "feature": "ne_50m_graticules_5"
        }
      },
      "mark": {
        "type": "geoshape",
        "fill": "#808080",
        "stroke": "rgba(0, 0, 0, 0.5)"
      }
    },
    {
      "data": {
        "url": "Unique_Reefs_for_2020-2023.csv",
        "format": {
          "type": "csv"
        }
      },
      "transform": [
        {
          "calculate": "datum.MEAN_LIVE_CORAL <= 20 ? '0-20%' : datum.MEAN_LIVE_CORAL <= 40 ? '20-40%' : datum.MEAN_LIVE_CORAL <= 60 ? '40-60%' : datum.MEAN_LIVE_CORAL <= 80 ? '60-80%' : '80-100%'",
          "as": "Live_Coral_Category"
        }
      ],
      "mark": {
        "type": "circle",
        "tooltip": true
      },
      "encoding": {
        "longitude": {
          "field": "LONGITUDE",
          "type": "quantitative"
        },
        "latitude": {
          "field": "LATITUDE",
          "type": "quantitative"
        },
        "color": {
          "field": "Live_Coral_Category",
          "type": "nominal",
          "title": "Live Coral Category",
          "scale": {
            "domain": [
              "0-20%",
              "20-40%",
              "40-60%",
              "60-80%",
              "80-100%"
            ],
            "range": [
              "#d7191c",
              "#fdae61",
              "#ffffbf",
              "#a6d96a",
              "#1a9641"
            ]
          }
        },
        "size": {
          "value": 50
        },
        "tooltip": [
          {
            "field": "REEF_NAME",
            "title": "Reef Name"
          },
          {
            "field": "MEAN_LIVE_CORAL",
            "title": "Mean Live Coral (%)"
          },
          {
            "field": "REPORT_YEAR",
            "title": "Reported Year"
          }
        ]
      }
    }
  ]
}

const week10 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Draw a rectangular brush to show (first 20) selected reefs in a table.",
  "width": 450,
  "height": 550,
  "projection": {
    "type": "mercator",
    "center": [149, -18],
    "scale": 2100,
    "translate": [300, 300]
  },
  "hconcat": [
    {
      "params": [{"name": "brush", "select": {"type": "interval", "encodings": ["x", "y"]}}],
      "layer": [
        {
          "data": {
            "url": "oceanland.json",
            "format": {
              "type": "topojson",
              "feature": "ne_50m_land"
            }
          },
          "mark": {
            "type": "geoshape",
            "fill": "#DDA15E",
            "stroke": "black"
          }
        },
        {
          "data": {
            "url": "oceanland.json",
            "format": {
              "type": "topojson",
              "feature": "ne_50m_ocean"
            }
          },
          "mark": {
            "type": "geoshape",
            "fill": "#ADD8E6",
            "stroke": "black"
          }
        },
        {
          "data": {
            "url": "manta-tow-by-reef.csv",
            "format": {
              "type": "csv"
            }
          },
          "transform": [
            {
              "calculate": "datum.MEAN_LIVE_CORAL <= 20 ? '0-20%' : datum.MEAN_LIVE_CORAL <= 40 ? '20-40%' : datum.MEAN_LIVE_CORAL <= 60 ? '40-60%' : datum.MEAN_LIVE_CORAL <= 80 ? '60-80%' : '80-100%'",
              "as": "Live_Coral_Category"
            }
          ],
          "mark": "circle",
          "encoding": {
            "longitude": {
              "field": "LONGITUDE",
              "type": "quantitative"
            },
            "latitude": {
              "field": "LATITUDE",
              "type": "quantitative"
            },
            "color": {
              "condition": {
                "param": "brush",
                "field": "Live_Coral_Category",
                "type": "nominal"
              },
              "value": "grey"
            },
            "size": {"value": 50},
            "tooltip": [
              {"field": "REEF_NAME", "title": "Reef Name"},
              {"field": "MEAN_LIVE_CORAL", "title": "Mean Live Coral (%)"},
              {"field": "REPORT_YEAR", "title": "Reported Year"}
            ]
          }
        }
      ]
    },
    {
      "transform": [
        {"filter": {"param": "brush"}},
        {"window": [{"op": "rank", "as": "rank"}]},
        {"filter": {"field": "rank", "lt": 20}}
      ],
      "hconcat": [
        {
          "width": 100,
          "title": "Reef Name",
          "mark": "text",
          "encoding": {
            "text": {"field": "REEF_NAME", "type": "nominal"},
            "y": {"field": "rank", "type": "ordinal", "axis": null}
          }
        },
        {
          "width": 100,
          "title": "Live Coral (%)",
          "mark": "text",
          "encoding": {
            "text": {"field": "MEAN_LIVE_CORAL", "type": "nominal"},
            "y": {"field": "rank", "type": "ordinal", "axis": null}
          }
        },
        {
          "width": 100,
          "title": "Report Year",
          "mark": "text",
          "encoding": {
            "text": {"field": "REPORT_YEAR", "type": "nominal"},
            "y": {"field": "rank", "type": "ordinal", "axis": null}
          }
        }
      ]
    }
  ]
}

