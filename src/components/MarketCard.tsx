import { ArrowUp, ArrowDown } from "iconsax-react";

type propType = {
  change: number;
  image: string;
  price: number;
  title: string;
};

function MarketCard({ change, image, price, title }: propType) {
  return (
    <div className="flex-col">
      <div className="flex justify-center w-full">
        <img src={image} className="w-32 h-32" />
      </div>
      <div className="text-xl font-bold">{title}</div>
      <div
        className={`${
          change >= 0 ? "text-green-600" : "text-red-600"
        } text-lg font-bold flex items-center justify-center`}
      >
        {change >= 0 ? (
          <ArrowUp size="20" color="#16AD4A" />
        ) : (
          <ArrowDown size="20" color="#DC2626" />
        )}
        {price.toLocaleString()}
      </div>
    </div>
  );
}

export default MarketCard;
