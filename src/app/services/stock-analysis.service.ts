import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockAnalysisModel {
  ticker: string;
  mean_change: number;
  max_price: number;
  min_price: number;
  graph_data: any;
}

@Injectable({
  providedIn: 'root'
})
export class StockAnalysisService {
  private apiUrl = 'http://localhost:8001/analyze';

  constructor(private http: HttpClient) {}
  //
  // analyzeStock(ticker: string): Observable<StockAnalysisModel> {
  //   return this.http.get<StockAnalysisModel>(`${this.apiUrl}?ticker=${ticker}`);
  // }
  analyzeStock(ticker: string): any{
    return {
      "ticker": "OPEN",
      "anomaly_count": 0,
      "anomaly_dates": [],
      "graph_data": {
        "data": [
          {
            "mode": "lines",
            "name": "Test MSE",
            "x": [
              "2025-02-07T14:48:00-05:00",
              "2025-02-07T14:49:00-05:00",
              "2025-02-07T14:50:00-05:00",
              "2025-02-07T14:51:00-05:00",
              "2025-02-07T14:52:00-05:00",
              "2025-02-07T14:53:00-05:00",
              "2025-02-07T14:54:00-05:00",
              "2025-02-07T14:55:00-05:00",
              "2025-02-07T14:56:00-05:00",
              "2025-02-07T14:57:00-05:00",
              "2025-02-07T14:58:00-05:00",
              "2025-02-07T14:59:00-05:00",
              "2025-02-07T15:00:00-05:00",
              "2025-02-07T15:01:00-05:00",
              "2025-02-07T15:02:00-05:00",
              "2025-02-07T15:03:00-05:00",
              "2025-02-07T15:04:00-05:00",
              "2025-02-07T15:05:00-05:00",
              "2025-02-07T15:06:00-05:00",
              "2025-02-07T15:07:00-05:00",
              "2025-02-07T15:08:00-05:00",
              "2025-02-07T15:09:00-05:00",
              "2025-02-07T15:10:00-05:00",
              "2025-02-07T15:11:00-05:00",
              "2025-02-07T15:12:00-05:00",
              "2025-02-07T15:13:00-05:00",
              "2025-02-07T15:14:00-05:00",
              "2025-02-07T15:15:00-05:00",
              "2025-02-07T15:16:00-05:00",
              "2025-02-07T15:17:00-05:00",
              "2025-02-07T15:18:00-05:00",
              "2025-02-07T15:19:00-05:00",
              "2025-02-07T15:20:00-05:00",
              "2025-02-07T15:21:00-05:00",
              "2025-02-07T15:22:00-05:00",
              "2025-02-07T15:23:00-05:00",
              "2025-02-07T15:24:00-05:00",
              "2025-02-07T15:25:00-05:00",
              "2025-02-07T15:26:00-05:00",
              "2025-02-07T15:27:00-05:00",
              "2025-02-07T15:28:00-05:00",
              "2025-02-07T15:29:00-05:00",
              "2025-02-07T15:30:00-05:00",
              "2025-02-07T15:31:00-05:00",
              "2025-02-07T15:32:00-05:00",
              "2025-02-07T15:33:00-05:00",
              "2025-02-07T15:34:00-05:00",
              "2025-02-07T15:35:00-05:00",
              "2025-02-07T15:36:00-05:00",
              "2025-02-07T15:37:00-05:00",
              "2025-02-07T15:38:00-05:00",
              "2025-02-07T15:39:00-05:00",
              "2025-02-07T15:40:00-05:00",
              "2025-02-07T15:41:00-05:00",
              "2025-02-07T15:42:00-05:00",
              "2025-02-07T15:43:00-05:00",
              "2025-02-07T15:44:00-05:00",
              "2025-02-07T15:45:00-05:00",
              "2025-02-07T15:46:00-05:00",
              "2025-02-07T15:47:00-05:00",
              "2025-02-07T15:48:00-05:00",
              "2025-02-07T15:49:00-05:00",
              "2025-02-07T15:50:00-05:00",
              "2025-02-07T15:51:00-05:00",
              "2025-02-07T15:52:00-05:00",
              "2025-02-07T15:53:00-05:00",
              "2025-02-07T15:54:00-05:00",
              "2025-02-07T15:55:00-05:00",
              "2025-02-07T15:56:00-05:00",
              "2025-02-07T15:57:00-05:00",
              "2025-02-07T15:58:00-05:00",
              "2025-02-07T15:59:00-05:00"
            ],
            "y": {
              "dtype": "f8",
              "bdata": "ijw+1B/D4z+skhV9vtXjPy1BkvSYiOM/v1nhg6GZ4z8fDgW9+JrjP/obIEI4QuM/TMWAY0zJ5D+h4tj7IXrkP1UM1KcqheQ/9HLlqOdq5D9XFmJiWMzkP3ckvc/0b+Q/xYndcUng4T8vfq7xPXHiP+tA/ioVleI/x7Bi4Yzm4j+fxa4xesziP84SKzgSTeA/arPtNdFW4D8/a0qop3HgPyLF6gxckOE/Cmu23EiR4T83MKhMOKXhP3xf+P9IjOE/Em6GOi2b4T8njWuPl3zhPx8rjidiruE/WhqU6/om4T9ncUBvAEHhP2ZcSplbb+E/iixuMt6H4T+j9RaDy+HhP41Z3nhLCeI/rt+70qq54D8nAjDacPHgP3bKv0IBz+M/CpRN3Wv74j9KL01DMvjiP4sAFJEyJeM/J7icG+xa4z9kmIXAyV3jP6dW7/GLruM/4sdSN3o65D++0yxCAWbkP8JSe7VjRuU/QqEXZwFf5T8vTD9tq/TlP2uSbWVAkeY/MYrZ1j5e5z8LpkAe4eDnP7e0bK8pSec/zXwSZ8QD6T9Nh/4vOJrpP9IQKZ9QA+o/EW6QLkVf6j+O1u5vEhrtPxeg0OCcKe0/K2WLxz727D+DfagkbNDuP2Gfaahiiu4/z18l033B7j9NeNO+Kj/vP3zMlm6/wfM/QEk/HfSt8z+CT7tnzrPzP/QaSd3HqvI/lnqji43n8j/Pq0HS7nj0PxvMxhHKEPU/H0UgnZ+W9D9KEVeWn/rzP5Q1pO8cU/M/"
            },
            "type": "scatter"
          },
          {
            "line": {
              "color": "red",
              "dash": "dash"
            },
            "mode": "lines",
            "name": "Threshold",
            "x": [
              "2025-02-07T14:48:00-05:00",
              "2025-02-07T15:59:00-05:00"
            ],
            "y": [
              1.821539701788119,
              1.821539701788119
            ],
            "type": "scatter"
          }
        ],
        "layout": {
          "template": {
            "data": {
              "histogram2dcontour": [
                {
                  "type": "histogram2dcontour",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  },
                  "colorscale": [
                    [
                      0,
                      "#0d0887"
                    ],
                    [
                      0.1111111111111111,
                      "#46039f"
                    ],
                    [
                      0.2222222222222222,
                      "#7201a8"
                    ],
                    [
                      0.3333333333333333,
                      "#9c179e"
                    ],
                    [
                      0.4444444444444444,
                      "#bd3786"
                    ],
                    [
                      0.5555555555555556,
                      "#d8576b"
                    ],
                    [
                      0.6666666666666666,
                      "#ed7953"
                    ],
                    [
                      0.7777777777777778,
                      "#fb9f3a"
                    ],
                    [
                      0.8888888888888888,
                      "#fdca26"
                    ],
                    [
                      1,
                      "#f0f921"
                    ]
                  ]
                }
              ],
              "choropleth": [
                {
                  "type": "choropleth",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  }
                }
              ],
              "histogram2d": [
                {
                  "type": "histogram2d",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  },
                  "colorscale": [
                    [
                      0,
                      "#0d0887"
                    ],
                    [
                      0.1111111111111111,
                      "#46039f"
                    ],
                    [
                      0.2222222222222222,
                      "#7201a8"
                    ],
                    [
                      0.3333333333333333,
                      "#9c179e"
                    ],
                    [
                      0.4444444444444444,
                      "#bd3786"
                    ],
                    [
                      0.5555555555555556,
                      "#d8576b"
                    ],
                    [
                      0.6666666666666666,
                      "#ed7953"
                    ],
                    [
                      0.7777777777777778,
                      "#fb9f3a"
                    ],
                    [
                      0.8888888888888888,
                      "#fdca26"
                    ],
                    [
                      1,
                      "#f0f921"
                    ]
                  ]
                }
              ],
              "heatmap": [
                {
                  "type": "heatmap",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  },
                  "colorscale": [
                    [
                      0,
                      "#0d0887"
                    ],
                    [
                      0.1111111111111111,
                      "#46039f"
                    ],
                    [
                      0.2222222222222222,
                      "#7201a8"
                    ],
                    [
                      0.3333333333333333,
                      "#9c179e"
                    ],
                    [
                      0.4444444444444444,
                      "#bd3786"
                    ],
                    [
                      0.5555555555555556,
                      "#d8576b"
                    ],
                    [
                      0.6666666666666666,
                      "#ed7953"
                    ],
                    [
                      0.7777777777777778,
                      "#fb9f3a"
                    ],
                    [
                      0.8888888888888888,
                      "#fdca26"
                    ],
                    [
                      1,
                      "#f0f921"
                    ]
                  ]
                }
              ],
              "contourcarpet": [
                {
                  "type": "contourcarpet",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  }
                }
              ],
              "contour": [
                {
                  "type": "contour",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  },
                  "colorscale": [
                    [
                      0,
                      "#0d0887"
                    ],
                    [
                      0.1111111111111111,
                      "#46039f"
                    ],
                    [
                      0.2222222222222222,
                      "#7201a8"
                    ],
                    [
                      0.3333333333333333,
                      "#9c179e"
                    ],
                    [
                      0.4444444444444444,
                      "#bd3786"
                    ],
                    [
                      0.5555555555555556,
                      "#d8576b"
                    ],
                    [
                      0.6666666666666666,
                      "#ed7953"
                    ],
                    [
                      0.7777777777777778,
                      "#fb9f3a"
                    ],
                    [
                      0.8888888888888888,
                      "#fdca26"
                    ],
                    [
                      1,
                      "#f0f921"
                    ]
                  ]
                }
              ],
              "surface": [
                {
                  "type": "surface",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  },
                  "colorscale": [
                    [
                      0,
                      "#0d0887"
                    ],
                    [
                      0.1111111111111111,
                      "#46039f"
                    ],
                    [
                      0.2222222222222222,
                      "#7201a8"
                    ],
                    [
                      0.3333333333333333,
                      "#9c179e"
                    ],
                    [
                      0.4444444444444444,
                      "#bd3786"
                    ],
                    [
                      0.5555555555555556,
                      "#d8576b"
                    ],
                    [
                      0.6666666666666666,
                      "#ed7953"
                    ],
                    [
                      0.7777777777777778,
                      "#fb9f3a"
                    ],
                    [
                      0.8888888888888888,
                      "#fdca26"
                    ],
                    [
                      1,
                      "#f0f921"
                    ]
                  ]
                }
              ],
              "mesh3d": [
                {
                  "type": "mesh3d",
                  "colorbar": {
                    "outlinewidth": 0,
                    "ticks": ""
                  }
                }
              ],
              "scatter": [
                {
                  "fillpattern": {
                    "fillmode": "overlay",
                    "size": 10,
                    "solidity": 0.2
                  },
                  "type": "scatter"
                }
              ],
              "parcoords": [
                {
                  "type": "parcoords",
                  "line": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scatterpolargl": [
                {
                  "type": "scatterpolargl",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "bar": [
                {
                  "error_x": {
                    "color": "#2a3f5f"
                  },
                  "error_y": {
                    "color": "#2a3f5f"
                  },
                  "marker": {
                    "line": {
                      "color": "#E5ECF6",
                      "width": 0.5
                    },
                    "pattern": {
                      "fillmode": "overlay",
                      "size": 10,
                      "solidity": 0.2
                    }
                  },
                  "type": "bar"
                }
              ],
              "scattergeo": [
                {
                  "type": "scattergeo",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scatterpolar": [
                {
                  "type": "scatterpolar",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "histogram": [
                {
                  "marker": {
                    "pattern": {
                      "fillmode": "overlay",
                      "size": 10,
                      "solidity": 0.2
                    }
                  },
                  "type": "histogram"
                }
              ],
              "scattergl": [
                {
                  "type": "scattergl",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scatter3d": [
                {
                  "type": "scatter3d",
                  "line": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  },
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scattermap": [
                {
                  "type": "scattermap",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scattermapbox": [
                {
                  "type": "scattermapbox",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scatterternary": [
                {
                  "type": "scatterternary",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "scattercarpet": [
                {
                  "type": "scattercarpet",
                  "marker": {
                    "colorbar": {
                      "outlinewidth": 0,
                      "ticks": ""
                    }
                  }
                }
              ],
              "carpet": [
                {
                  "aaxis": {
                    "endlinecolor": "#2a3f5f",
                    "gridcolor": "white",
                    "linecolor": "white",
                    "minorgridcolor": "white",
                    "startlinecolor": "#2a3f5f"
                  },
                  "baxis": {
                    "endlinecolor": "#2a3f5f",
                    "gridcolor": "white",
                    "linecolor": "white",
                    "minorgridcolor": "white",
                    "startlinecolor": "#2a3f5f"
                  },
                  "type": "carpet"
                }
              ],
              "table": [
                {
                  "cells": {
                    "fill": {
                      "color": "#EBF0F8"
                    },
                    "line": {
                      "color": "white"
                    }
                  },
                  "header": {
                    "fill": {
                      "color": "#C8D4E3"
                    },
                    "line": {
                      "color": "white"
                    }
                  },
                  "type": "table"
                }
              ],
              "barpolar": [
                {
                  "marker": {
                    "line": {
                      "color": "#E5ECF6",
                      "width": 0.5
                    },
                    "pattern": {
                      "fillmode": "overlay",
                      "size": 10,
                      "solidity": 0.2
                    }
                  },
                  "type": "barpolar"
                }
              ],
              "pie": [
                {
                  "automargin": true,
                  "type": "pie"
                }
              ]
            },
            "layout": {
              "autotypenumbers": "strict",
              "colorway": [
                "#636efa",
                "#EF553B",
                "#00cc96",
                "#ab63fa",
                "#FFA15A",
                "#19d3f3",
                "#FF6692",
                "#B6E880",
                "#FF97FF",
                "#FECB52"
              ],
              "font": {
                "color": "#2a3f5f"
              },
              "hovermode": "closest",
              "hoverlabel": {
                "align": "left"
              },
              "paper_bgcolor": "white",
              "plot_bgcolor": "#E5ECF6",
              "polar": {
                "bgcolor": "#E5ECF6",
                "angularaxis": {
                  "gridcolor": "white",
                  "linecolor": "white",
                  "ticks": ""
                },
                "radialaxis": {
                  "gridcolor": "white",
                  "linecolor": "white",
                  "ticks": ""
                }
              },
              "ternary": {
                "bgcolor": "#E5ECF6",
                "aaxis": {
                  "gridcolor": "white",
                  "linecolor": "white",
                  "ticks": ""
                },
                "baxis": {
                  "gridcolor": "white",
                  "linecolor": "white",
                  "ticks": ""
                },
                "caxis": {
                  "gridcolor": "white",
                  "linecolor": "white",
                  "ticks": ""
                }
              },
              "coloraxis": {
                "colorbar": {
                  "outlinewidth": 0,
                  "ticks": ""
                }
              },
              "colorscale": {
                "sequential": [
                  [
                    0,
                    "#0d0887"
                  ],
                  [
                    0.1111111111111111,
                    "#46039f"
                  ],
                  [
                    0.2222222222222222,
                    "#7201a8"
                  ],
                  [
                    0.3333333333333333,
                    "#9c179e"
                  ],
                  [
                    0.4444444444444444,
                    "#bd3786"
                  ],
                  [
                    0.5555555555555556,
                    "#d8576b"
                  ],
                  [
                    0.6666666666666666,
                    "#ed7953"
                  ],
                  [
                    0.7777777777777778,
                    "#fb9f3a"
                  ],
                  [
                    0.8888888888888888,
                    "#fdca26"
                  ],
                  [
                    1,
                    "#f0f921"
                  ]
                ],
                "sequentialminus": [
                  [
                    0,
                    "#0d0887"
                  ],
                  [
                    0.1111111111111111,
                    "#46039f"
                  ],
                  [
                    0.2222222222222222,
                    "#7201a8"
                  ],
                  [
                    0.3333333333333333,
                    "#9c179e"
                  ],
                  [
                    0.4444444444444444,
                    "#bd3786"
                  ],
                  [
                    0.5555555555555556,
                    "#d8576b"
                  ],
                  [
                    0.6666666666666666,
                    "#ed7953"
                  ],
                  [
                    0.7777777777777778,
                    "#fb9f3a"
                  ],
                  [
                    0.8888888888888888,
                    "#fdca26"
                  ],
                  [
                    1,
                    "#f0f921"
                  ]
                ],
                "diverging": [
                  [
                    0,
                    "#8e0152"
                  ],
                  [
                    0.1,
                    "#c51b7d"
                  ],
                  [
                    0.2,
                    "#de77ae"
                  ],
                  [
                    0.3,
                    "#f1b6da"
                  ],
                  [
                    0.4,
                    "#fde0ef"
                  ],
                  [
                    0.5,
                    "#f7f7f7"
                  ],
                  [
                    0.6,
                    "#e6f5d0"
                  ],
                  [
                    0.7,
                    "#b8e186"
                  ],
                  [
                    0.8,
                    "#7fbc41"
                  ],
                  [
                    0.9,
                    "#4d9221"
                  ],
                  [
                    1,
                    "#276419"
                  ]
                ]
              },
              "xaxis": {
                "gridcolor": "white",
                "linecolor": "white",
                "ticks": "",
                "title": {
                  "standoff": 15
                },
                "zerolinecolor": "white",
                "automargin": true,
                "zerolinewidth": 2
              },
              "yaxis": {
                "gridcolor": "white",
                "linecolor": "white",
                "ticks": "",
                "title": {
                  "standoff": 15
                },
                "zerolinecolor": "white",
                "automargin": true,
                "zerolinewidth": 2
              },
              "scene": {
                "xaxis": {
                  "backgroundcolor": "#E5ECF6",
                  "gridcolor": "white",
                  "linecolor": "white",
                  "showbackground": true,
                  "ticks": "",
                  "zerolinecolor": "white",
                  "gridwidth": 2
                },
                "yaxis": {
                  "backgroundcolor": "#E5ECF6",
                  "gridcolor": "white",
                  "linecolor": "white",
                  "showbackground": true,
                  "ticks": "",
                  "zerolinecolor": "white",
                  "gridwidth": 2
                },
                "zaxis": {
                  "backgroundcolor": "#E5ECF6",
                  "gridcolor": "white",
                  "linecolor": "white",
                  "showbackground": true,
                  "ticks": "",
                  "zerolinecolor": "white",
                  "gridwidth": 2
                }
              },
              "shapedefaults": {
                "line": {
                  "color": "#2a3f5f"
                }
              },
              "annotationdefaults": {
                "arrowcolor": "#2a3f5f",
                "arrowhead": 0,
                "arrowwidth": 1
              },
              "geo": {
                "bgcolor": "white",
                "landcolor": "#E5ECF6",
                "subunitcolor": "white",
                "showland": true,
                "showlakes": true,
                "lakecolor": "white"
              },
              "title": {
                "x": 0.05
              },
              "mapbox": {
                "style": "light"
              }
            }
          },
          "xaxis": {
            "rangeslider": {
              "visible": true
            },
            "title": {
              "text": "Date"
            }
          },
          "title": {
            "text": "Anomaly Detection (OPEN)"
          },
          "yaxis": {
            "title": {
              "text": "MSE"
            }
          },
          "hovermode": "x"
        }
      }
    }
  }
}
