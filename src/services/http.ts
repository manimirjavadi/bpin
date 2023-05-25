import { MarketResponse } from "../interfaces/ApiResponses";

const ENDPOINT = "https://api.bitpin.ir/v1/mkt/markets/";

export const http = {
  fetchMarkets: async (): Promise<MarketResponse> => {
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();

      if (data.results) {
        return data;
      }
    } catch (error: any) {
      //   throw new Error(error);
    }

    throw new Error("Not valid");
  },
};
