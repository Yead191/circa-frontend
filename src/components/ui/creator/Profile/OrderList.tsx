import { ChevronRight, X, Package, MapPin, CreditCard, User, MoreHorizontal, ShoppingCart, Info, CheckCircle2, Clock, Ban } from "lucide-react";
import { useState } from "react";
import { Order } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";

function OrderStatusBadge({ status }: { status: string }) {
  const isPending = status?.toLowerCase() === "pending";
  const isPaid = status?.toLowerCase() === "paid" || status?.toLowerCase() === "success";

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isPaid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
      isPending ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
        'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
      {isPaid ? <CheckCircle2 size={10} /> : isPending ? <Clock size={10} /> : <Ban size={10} />}
      {status}
    </span>
  );
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { address_breakdown, price_breakdown, user, items } = order;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto selection:bg-indigo-500/30">
      <div className="bg-[#0d0d12] border border-[#2a2a35] w-full max-w-2xl rounded-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2a2a35] flex items-center justify-between sticky top-0 bg-[#0d0d12] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">Order #{order.order_id}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction: {order.transaction_id || 'N/A'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">

          {/* Customer & Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1"><User size={11} className="text-indigo-400" /> Customer Info</label>
              <div className="flex items-center gap-3 p-4 bg-[#16161e] border border-white/5 rounded-2xl">
                <img src={getImageUrl(user?.image) || "https://i.ibb.co/z5YHLV9/profile.png"} className="w-11 h-11 rounded-xl object-cover border border-white/10" alt={user?.name} />
                <div className="overflow-hidden">
                  <p className="text-white text-sm font-black uppercase truncate leading-tight">{user?.name}</p>
                  <p className="text-gray-500 text-[10px] font-bold truncate tracking-tight">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1"><Info size={11} className="text-indigo-400" /> Current Status</label>
              <div className="flex items-center justify-between p-4 bg-[#16161e] border border-white/5 rounded-2xl h-[78px]">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Fulfillment</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Payment</p>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1"><MapPin size={11} className="text-indigo-400" /> Destination Details</label>
            <div className="p-5 bg-[#16161e] border border-white/5 rounded-3xl space-y-3">
              <p className="text-white text-sm leading-relaxed">{order.formatted_address}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Country</p>
                  <p className="text-xs text-gray-300 font-bold">{address_breakdown.country}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">City</p>
                  <p className="text-xs text-gray-300 font-bold">{address_breakdown.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Contact</p>
                  <p className="text-xs text-gray-300 font-bold">{address_breakdown.contact_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1"><ShoppingCart size={11} className="text-indigo-400" /> Order Contents</label>
            <div className="bg-[#16161e] border border-white/5 rounded-3xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {items?.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between group hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0d0d12] border border-white/5 overflow-hidden">
                        <img src={getImageUrl(item?.image)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-black uppercase leading-none mb-1">{item.name}</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Qty: {item.quantity} • Unit: ${item.unit_price}</p>
                      </div>
                    </div>
                    <p className="text-white font-black text-sm">${item.total_price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1"><CreditCard size={11} className="text-emerald-400" /> Financial Summary</label>
            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Products Total</span>
                  <span className="text-white">${price_breakdown.products_price}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Delivery Charge</span>
                  <span className="text-white">${price_breakdown.delivery_charge}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-500">Service Fee & Tax</span>
                  <span className="text-white">${price_breakdown.serviceFee + price_breakdown.tax}</span>
                </div>
                {price_breakdown.discount_amount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <span>Total Discount</span>
                    <span>-${price_breakdown.discount_amount}</span>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Total Paid</span>
                <span className="text-2xl font-black text-indigo-400 font-mono tracking-tighter">${price_breakdown.total_price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a38; }
      `}</style>
    </div>
  );
}

export default function OrderList({ orderList }: { orderList: Order[] }) {
  const [selected, setSelected] = useState<Order | null>(null);

  if (!orderList || orderList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6 border border-white/5 animate-pulse">
          <Package size={32} />
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">No Orders Found</h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest max-w-[240px]">You don't have any incoming orders yet. Your shop sales will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {orderList.map((order) => (
          <button
            key={order._id}
            onClick={() => setSelected(order)}
            className="w-full flex items-center justify-between bg-[#111118] hover:bg-[#16161e] border border-white/5 hover:border-indigo-500/30 rounded-3xl px-5 py-4 transition-all duration-300 group shadow-xl hover:-translate-y-0.5 active:scale-[0.99] relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-all duration-300" />

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#0d0d12] border border-white/5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img src={getImageUrl(order?.items[0]?.image)} alt={order?.items[0]?.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-black uppercase tracking-tight leading-none truncate max-w-[150px] sm:max-w-xs">{order?.items[0]?.name}</p>
                  {order?.items.length > 1 && (
                    <span className="text-[9px] font-bold bg-white/5 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-widest whitespace-nowrap">+{order.items.length - 1} more</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-indigo-400 text-xs font-black font-mono tracking-tight">${order.price_breakdown.total_price}</p>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest truncate">Order #{order.order_id}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden sm:block text-right">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Action Required</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <ChevronRight size={18} strokeWidth={3} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </>
  );
}