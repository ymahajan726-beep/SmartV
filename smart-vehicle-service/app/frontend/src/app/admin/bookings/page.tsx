"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";
import { payWithRazorpay } from "@/src/utils/razorpay";

export default function AdminBookingsPage() {
  const { isLightMode } = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [inventoryParts, setInventoryParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State for Spare Parts Assignment
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // Invoice Modal State
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  // Manual Charges & Discount States
  const [manualLabor, setManualLabor] = useState("0");
  const [discountVal, setDiscountVal] = useState("0");

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, invData] = await Promise.all([
        apiRequest("/admin/bookings", "GET").catch(() => []),
        apiRequest("/admin/inventory", "GET").catch(() => []),
      ]);
      setBookings(Array.isArray(bData) ? bData : []);
      setInventoryParts(Array.isArray(invData) ? invData : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await apiRequest(`/admin/bookings/${bookingId}/status`, "PATCH", { status: newStatus });
      triggerToast("Booking status updated successfully!", "success");
      fetchData();
    } catch (err: any) {
      triggerToast("Failed to update status: " + err.message, "error");
    }
  };

  const handleAddPartToBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !selectedPartId) return;

    try {
      setSubmitting(true);
      await apiRequest(`/admin/bookings/${selectedBookingId}/spare-parts`, "POST", {
        inventoryPartId: selectedPartId,
        quantity: Number(quantity),
      });
      triggerToast("Spare part added & stock deducted successfully!", "success");
      setSelectedBookingId(null);
      setSelectedPartId("");
      setQuantity("1");
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to add spare part.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch and View Bill Modal (Only allowed if status is COMPLETED or READY_FOR_DELIVERY)
  const handleViewBill = async (b: any) => {
    if (b.status !== 'COMPLETED' && b.status !== 'READY_FOR_DELIVERY') {
      triggerToast("Invoice can only be generated when service status is Ready for Delivery or Completed.", "error");
      return;
    }

    try {
      setInvoiceLoading(true);
      const data = await apiRequest(`/invoices/booking/${b.id}`, "GET");
      setViewingInvoice(data);
      setManualLabor(data.manualLabor ? data.manualLabor.toString() : "0");
      setDiscountVal(data.discount ? data.discount.toString() : "0");
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load tax invoice.", "error");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleUpdateManualCharges = async () => {
    if (!viewingInvoice) return;
    try {
      const updated = await apiRequest(`/invoices/${viewingInvoice.id}/charges`, "PATCH", {
        manualLabor: Number(manualLabor),
        discount: Number(discountVal),
      });
      setViewingInvoice(updated);
      triggerToast("Bill calculations updated successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to update extra charges.", "error");
    }
  };

  // Cash Payment Handler (Instant Paid & Auto Close)
  const handleCashPayment = async () => {
    if (!viewingInvoice) return;
    try {
      setUpdatingPayment(true);
      const updated = await apiRequest(`/invoices/${viewingInvoice.id}/payment`, "PATCH", { paymentMethod: 'CASH' });
      setViewingInvoice(updated);
      triggerToast("Cash payment recorded! Booking archived & reminder triggered.", "success");
      fetchData();
      setTimeout(() => {
        setViewingInvoice(null);
      }, 1200);
    } catch (err: any) {
      triggerToast("Failed to process cash payment.", "error");
    } finally {
      setUpdatingPayment(false);
    }
  };

  // Online Razorpay Payment Handler (Verified via Gateway & Auto Close)
  const handleOnlinePayment = async () => {
    if (!viewingInvoice) return;
    payWithRazorpay({
      amount: viewingInvoice.totalAmount,
      invoiceNumber: viewingInvoice.invoiceNumber,
      customerName: viewingInvoice.customer?.name || viewingInvoice.booking?.customer?.name || "Customer",
      customerPhone: viewingInvoice.customer?.phone || viewingInvoice.booking?.customer?.phone,
      onSuccess: async () => {
        try {
          setUpdatingPayment(true);
          const updated = await apiRequest(`/invoices/${viewingInvoice.id}/payment`, "PATCH", { paymentMethod: 'ONLINE' });
          setViewingInvoice(updated);
          triggerToast("Online payment verified successfully! Booking archived.", "success");
          fetchData();
          setTimeout(() => {
            setViewingInvoice(null);
          }, 1200);
        } catch (err: any) {
          triggerToast("Payment verified by gateway, but backend sync failed.", "error");
        } finally {
          setUpdatingPayment(false);
        }
      }
    });
  };

  // Filter Bookings based on Search and Status Filter
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ FLEET BOOKINGS ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Customer Service Bookings</h1>
        </div>
        <button onClick={fetchData} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh
        </button>
      </header>

      {/* SEARCH AND STATUS FILTER CONTROLS */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        <input
          type="text"
          placeholder="Search by Booking No, Customer or Vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full xl:w-96 px-4 py-3 rounded-2xl border text-xs font-mono outline-none ${isLightMode ? "bg-white border-gray-300 text-slate-900" : "bg-[#141418] border-white/20 text-white focus:border-[#00F0FF]"}`}
        />

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {["ALL", "BOOKED", "IN_PROGRESS", "QUALITY_CHECK", "READY_FOR_DELIVERY", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl border uppercase tracking-wider cursor-pointer transition-all ${
                statusFilter === st 
                  ? "bg-[#00F0FF] text-slate-950 font-bold border-[#00F0FF]" 
                  : isLightMode 
                    ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-100" 
                    : "bg-[#141418] border-white/10 text-neutral-400 hover:border-white/30"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[1100px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Ref / Vehicle</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Service & Parts Used</th>
                <th className="p-4">Service Center</th>
                <th className="p-4">Schedule & Bill</th>
                <th className="p-4 text-right">Pipeline & Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading bookings telemetry...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No matching service bookings found.</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4">
                      <strong className="text-[#00F0FF]">{b.bookingNumber}</strong>
                      <div className="font-bold">{b.vehicle?.make} {b.vehicle?.model}</div>
                      <div className="text-[10px] text-neutral-400">({b.vehicle?.registrationNumber})</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{b.customer?.name || "Customer"}</div>
                      <div className="text-[10px] text-neutral-400">{b.customer?.phone || "No Phone"}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[180px]">{b.customer?.address || "No Address"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-cyan-400">{b.service?.name || "General Inspection"}</div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {b.spareParts && b.spareParts.length > 0 ? (
                          <span className="text-amber-400 font-bold">
                            Parts: {b.spareParts.map((sp: any) => `${sp.quantity}x ${sp.partName}`).join(", ")}
                          </span>
                        ) : (
                          "No spare parts added"
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{b.serviceCenter?.name || "Main Garage"}</div>
                      <div className="text-[10px] text-neutral-400">{b.serviceCenter?.location || "Central Facility"}</div>
                    </td>
                    <td className="p-4">
                      <div>{new Date(b.bookingDate).toLocaleDateString()} ({b.bookingTime || "10:00 AM"})</div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-1">
                        Total Bill: ₹{b.finalAmount || b.estimatedAmount || "0"}
                      </div>
                    </td>
                    <td className="p-4 text-right space-y-2">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => handleViewBill(b)}
                          disabled={invoiceLoading}
                          className="px-3 py-1.5 rounded-xl border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/10 font-bold text-[10px] uppercase cursor-pointer"
                        >
                          📄 Bill
                        </button>
                        <button
                          onClick={() => setSelectedBookingId(b.id)}
                          className="px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          ⚙️ Add Parts
                        </button>
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase cursor-pointer outline-none ${isLightMode ? "bg-slate-100 border-slate-300" : "bg-black/80 border-white/20 text-[#00F0FF]"}`}
                        >
                          <option value="BOOKED">BOOKED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                          <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spare Part Assignment Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white text-slate-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-4">
              Add Spare Part to Booking
            </h3>
            <p className="text-[11px] text-neutral-400 mb-6 font-mono">
              Selecting a part will automatically deduct the quantity from inventory stock and add its price to the final service bill.
            </p>

            <form onSubmit={handleAddPartToBooking} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Select Spare Part</label>
                <select
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">-- Choose from Inventory Stock --</option>
                  {inventoryParts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.partName} - ₹{p.unitPrice} ({p.stockQty} left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Confirm & Deduct Stock"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookingId(null)}
                  className="px-6 py-3.5 rounded-2xl border border-white/20 text-neutral-300 uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Invoice & Billing Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl p-8 rounded-[32px] shadow-2xl relative space-y-6 font-mono text-xs my-8">
            <button
              onClick={() => setViewingInvoice(null)}
              className="absolute top-6 right-6 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs cursor-pointer"
            >
              [CLOSE]
            </button>

            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black uppercase">Tax Invoice: {viewingInvoice.invoiceNumber}</h2>
                <p className="text-[10px] text-slate-500">AutoCare Authorized Service Center | GSTIN: 27AAAAA0000A1Z5</p>
              </div>
              <span className={`px-3 py-1 rounded font-bold ${viewingInvoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {viewingInvoice.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Customer Details</span>
                  <strong className="text-sm">
                    {viewingInvoice.customer?.name || viewingInvoice.booking?.customer?.name || "Customer Name"}
                  </strong>
                  <div className="text-[11px] text-slate-600">
                    {viewingInvoice.customer?.phone || viewingInvoice.booking?.customer?.phone || "No Phone"}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Vehicle Details</span>
                  <strong className="text-sm">
                    {viewingInvoice.booking?.vehicle?.make} {viewingInvoice.booking?.vehicle?.model}
                  </strong>
                  <div className="text-[11px] text-slate-600">
                    Reg: {viewingInvoice.booking?.vehicle?.registrationNumber || "N/A"}
                  </div>
                </div>
              </div>

              {/* Items & Manual Charges Section */}
              <div className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between font-bold border-b pb-2 text-slate-500 uppercase text-[10px]">
                  <span>Item Description</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Service Package: {viewingInvoice.booking?.service?.name || "General Inspection Service"}</span>
                  <span>₹{Number(viewingInvoice.booking?.service?.price || viewingInvoice.booking?.estimatedAmount || 1500).toFixed(2)}</span>
                </div>
                {viewingInvoice.booking?.spareParts?.map((sp: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-600 py-1">
                    <span>Spare Part: {sp.partName} ({sp.quantity}x)</span>
                    <span>₹{Number(sp.price * sp.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {/* Manual Labor / Extra Charges Input Row */}
                {viewingInvoice.status !== 'PAID' && (
                  <div className="pt-3 border-t grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">Manual Extra Charges / Labor (₹)</label>
                      <input
                        type="number"
                        value={manualLabor}
                        onChange={(e) => setManualLabor(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">Discount (₹)</label>
                      <input
                        type="number"
                        value={discountVal}
                        onChange={(e) => setDiscountVal(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs"
                      />
                    </div>
                    <button
                      onClick={handleUpdateManualCharges}
                      className="col-span-2 py-2 bg-slate-900 text-white rounded-lg text-[10px] uppercase font-bold cursor-pointer"
                    >
                      Update Bill Calculations
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(viewingInvoice.subTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span>₹{Number(viewingInvoice.taxAmount || 0).toFixed(2)}</span>
                </div>
                {viewingInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Applied:</span>
                    <span>-₹{Number(viewingInvoice.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span>Final Total:</span>
                  <span className="text-emerald-600">₹{Number(viewingInvoice.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                onClick={() => window.print()}
                className="px-6 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-100"
              >
                🖨️ Print Invoice
              </button>

              {viewingInvoice.status === 'PAID' ? (
                <div className="flex-1 py-3.5 text-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                  ✓ Paid & Locked (Permanently)
                </div>
              ) : (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={handleCashPayment}
                    disabled={updatingPayment}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 hover:bg-emerald-700"
                  >
                    {updatingPayment ? "Processing..." : "💵 Pay Cash (Instant)"}
                  </button>
                  <button
                    onClick={handleOnlinePayment}
                    disabled={updatingPayment}
                    className="flex-1 py-3.5 rounded-2xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 hover:bg-cyan-400"
                  >
                    {updatingPayment ? "Processing..." : "💳 Pay Online (Razorpay)"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}