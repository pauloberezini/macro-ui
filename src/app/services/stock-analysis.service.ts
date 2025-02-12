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

  analyzeStock(ticker: string): Observable<StockAnalysisModel> {
    return this.http.get<StockAnalysisModel>(`${this.apiUrl}?ticker=${ticker}`);
  }
  // analyzeStock(ticker: string): any{
  //   return {"ticker":"SLV","anomaly_count":0,"anomaly_dates":[],"graph_data":{"data":[{"mode":"lines","name":"Test MSE","x":["2025-02-11T14:48:00-05:00","2025-02-11T14:49:00-05:00","2025-02-11T14:50:00-05:00","2025-02-11T14:51:00-05:00","2025-02-11T14:52:00-05:00","2025-02-11T14:53:00-05:00","2025-02-11T14:54:00-05:00","2025-02-11T14:55:00-05:00","2025-02-11T14:56:00-05:00","2025-02-11T14:57:00-05:00","2025-02-11T14:58:00-05:00","2025-02-11T14:59:00-05:00","2025-02-11T15:00:00-05:00","2025-02-11T15:01:00-05:00","2025-02-11T15:02:00-05:00","2025-02-11T15:03:00-05:00","2025-02-11T15:04:00-05:00","2025-02-11T15:05:00-05:00","2025-02-11T15:06:00-05:00","2025-02-11T15:07:00-05:00","2025-02-11T15:08:00-05:00","2025-02-11T15:09:00-05:00","2025-02-11T15:10:00-05:00","2025-02-11T15:11:00-05:00","2025-02-11T15:12:00-05:00","2025-02-11T15:13:00-05:00","2025-02-11T15:14:00-05:00","2025-02-11T15:15:00-05:00","2025-02-11T15:16:00-05:00","2025-02-11T15:17:00-05:00","2025-02-11T15:18:00-05:00","2025-02-11T15:19:00-05:00","2025-02-11T15:20:00-05:00","2025-02-11T15:21:00-05:00","2025-02-11T15:22:00-05:00","2025-02-11T15:23:00-05:00","2025-02-11T15:24:00-05:00","2025-02-11T15:25:00-05:00","2025-02-11T15:26:00-05:00","2025-02-11T15:27:00-05:00","2025-02-11T15:28:00-05:00","2025-02-11T15:29:00-05:00","2025-02-11T15:30:00-05:00","2025-02-11T15:31:00-05:00","2025-02-11T15:32:00-05:00","2025-02-11T15:33:00-05:00","2025-02-11T15:34:00-05:00","2025-02-11T15:35:00-05:00","2025-02-11T15:36:00-05:00","2025-02-11T15:37:00-05:00","2025-02-11T15:38:00-05:00","2025-02-11T15:39:00-05:00","2025-02-11T15:40:00-05:00","2025-02-11T15:41:00-05:00","2025-02-11T15:42:00-05:00","2025-02-11T15:43:00-05:00","2025-02-11T15:44:00-05:00","2025-02-11T15:45:00-05:00","2025-02-11T15:46:00-05:00","2025-02-11T15:47:00-05:00","2025-02-11T15:48:00-05:00","2025-02-11T15:49:00-05:00","2025-02-11T15:50:00-05:00","2025-02-11T15:51:00-05:00","2025-02-11T15:52:00-05:00","2025-02-11T15:53:00-05:00","2025-02-11T15:54:00-05:00","2025-02-11T15:55:00-05:00","2025-02-11T15:56:00-05:00","2025-02-11T15:57:00-05:00","2025-02-11T15:58:00-05:00","2025-02-11T15:59:00-05:00"],"y":[0.6162712576716054,0.601934977614982,0.5766692455103055,0.5647386635323782,0.49186327535558727,0.4735057017405974,0.46241979779427084,0.4542907569742095,0.43319239095067996,0.41410719064812523,0.39492007285348324,0.37361039508961896,0.36701591181255966,0.3640020605838901,0.34790802001196575,0.33998751406113864,0.3345370729235413,0.2812081142867705,0.28101992169996637,0.29414811106227057,0.29504734853204717,0.2775613030389895,0.27417320796587263,0.26385983412279224,0.2666303882059845,0.2669809413460943,0.2790933633841666,0.2791534169823396,0.28274314683885293,0.288309468427642,1.634455510185397,1.4954087723205687,1.498064074039859,1.4965053198416007,1.5106122107907838,1.5210245036480614,1.5251060203810503,1.5939721540967462,1.5964697272943706,1.5948630635233738,1.6190144318332147,1.6087552132972498,1.6275771876024476,1.6292217881143949,1.6267671225195517,1.6252574405040918,1.6640964721706881,1.6589027489612245,1.6440513791850957,1.6531941103494914,1.6515764639391008,1.640411686600079,1.6384163845355422,1.673091891597245,1.6620206384725853,1.6556687871034101,1.6459660348810905,1.6423310383148741,1.6595971649053947,1.6657828823628642,0.4586703332405394,0.4599333405540839,0.4552634146739574,0.4752452166960038,0.4742795858375057,0.44555950455597876,0.46169639770339516,0.460696768620721,0.7413107118511193,0.6745760902047869,0.739422918264165,0.8788661935586135],"type":"scatter"},{"line":{"color":"red","dash":"dash"},"mode":"lines","name":"Threshold","x":["2025-02-11T14:48:00-05:00","2025-02-11T15:59:00-05:00"],"y":[1.9052940944402232,1.9052940944402232],"type":"scatter"}],"layout":{"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermap":[{"type":"scattermap","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"rangeslider":{"visible":true},"title":{"text":"Date"}},"title":{"text":"Anomaly Detection (SLV)"},"yaxis":{"title":{"text":"MSE"}},"hovermode":"x"}}}
  // }
}
