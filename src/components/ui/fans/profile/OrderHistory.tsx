const ORDERS: any[] = [
  {
    id: "#12345678", date: "30/01/26", total: "$145.00",
    items: [
      { name: "Spark Tee", qty: 2, price: "$145.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop" },
      { name: "Spark Tee", qty: 2, price: "$145.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop" },
    ],
  },
  {
    id: "#12345679", date: "30/01/26", total: "$145.00",
    items: [
      { name: "Spark Tee", qty: 2, price: "$145.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop" },
      { name: "Spark Tee", qty: 2, price: "$145.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop" },
    ],
  },
]; 

export default function OrderHistory() {
  return (
    <div className="flex flex-col gap-7">
      {ORDERS.map((order) => (
        <div key={order.id}>
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-start gap-x-3 mb-3 pb-2.5">
            
            <div>
              <div className="text-gray-500 text-[11px] mb-0.5">Order Id</div>
              <div className="text-white font-bold text-sm">{order.id}</div>
            </div>

            <div>
              <div className="text-gray-500 text-[11px] mb-0.5">Items</div>
              <div className="text-white font-semibold text-sm">
                {String(order.items.length).padStart(2, "0")}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-[11px] mb-0.5">Price</div>
              <div className="text-white font-semibold text-sm">
                {order.total}
              </div>
            </div>

            <div className="text-right">
              <div className="text-gray-500 text-[11px] mb-0.5">Date</div>
              <div className="text-white font-semibold text-sm">
                {order.date}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2.5">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#1a1b2e] rounded-xl px-3.5 py-3 gap-3.5"
              >
                {/* Left */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-[68px] h-[68px] rounded-lg object-cover flex-shrink-0 bg-[#1a1b2e]"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {item.name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      x{item.qty}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-white font-bold text-sm flex-shrink-0">
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}