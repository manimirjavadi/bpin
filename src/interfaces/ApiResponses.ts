import { IApiMarket } from "./Markets";

export interface MarketResponse {
  ok: boolean;
  results: Array<IApiMarket>;
}
