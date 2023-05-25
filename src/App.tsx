import { useEffect, useReducer } from "react";
import "./App.css";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { ReadyState } from "react-use-websocket";
import { IApiMarket } from "./interfaces/Markets";
import { ArrowUp, ArrowDown } from "iconsax-react";

interface IState {
  markets: IMarket[];
}

interface IMarket {
  market_id: number;
  change: number;
  created_at: number | null;
  max: string;
  min: string;
  price: string;
  image: string;
  title: string;
}

type Action =
  | { type: "INITIALIZE_MARKETS"; payload: IMarket[] }
  | { type: "UPDATE_PRICE"; payload: IMarket };

const initialState: IState = {
  markets: [],
};

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "INITIALIZE_MARKETS":
      return {
        ...state,
        markets: action.payload,
      };
    case "UPDATE_PRICE":
      return {
        ...state,
        markets: state.markets.map((market: IMarket) =>
          market.market_id === action.payload.market_id
            ? action.payload
            : market
        ),
      };
    default:
      return state;
  }
};

function App() {
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
    "wss://ws.bitpin.org"
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchInitialMarketData = async () => {
      let marketPH: Array<IMarket> = [];
      try {
        const response = await fetch("https://api.bitpin.ir/v1/mkt/markets/");
        const data = await response.json();

        if (data.results) {
          data.results.map((m: IApiMarket) => {
            marketPH.push({
              change: m.internal_price_info.change,
              created_at: m.internal_price_info.created_at,
              image: m.currency1.image,
              market_id: m.id,
              max: m.internal_price_info.max,
              min: m.internal_price_info.min,
              price: m.price,
              title: m.title,
            });
          });
        }

        dispatch({ type: "INITIALIZE_MARKETS", payload: marketPH });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchInitialMarketData();
  }, []);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        method: "sub_to_price_info",
      });
    }
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage) {
      state.markets.map((m) => {
        // @ts-ignore
        if (lastJsonMessage[m.market_id]) {
          // @ts-ignore
          m.price = lastJsonMessage[m.market_id].price;
          // @ts-ignore
          m.change = lastJsonMessage[m.market_id].change;
          dispatch({ type: "UPDATE_PRICE", payload: m });
        }
      });
    }
  }, [lastJsonMessage]);

  return (
    <>
      <div className="text-3xl font-bold">Markets list</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-8 py-10">
        {state.markets.map((m) => (
          <div key={m.market_id} className="flex-col">
            <div className="flex justify-center w-full">
              <img src={m.image} className="w-32 h-32" />
            </div>
            <div className="text-xl font-bold">{m.title}</div>
            <div
              className={`${
                m.change >= 0 ? "text-green-600" : "text-red-600"
              } text-lg font-bold flex items-center justify-center`}
            >
              {m.change >= 0 ? (
                <ArrowUp size="20" color="#16AD4A" />
              ) : (
                <ArrowDown size="20" color="#DC2626" />
              )}
              {parseFloat(m.price).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
