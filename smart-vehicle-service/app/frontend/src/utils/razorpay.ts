export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const payWithRazorpay = async ({
  amount,
  invoiceNumber,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
}: {
  amount: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: () => void;
}) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
    amount: Math.round(amount * 100), 
    currency: 'INR',
    name: 'AutoCare Enterprise',
    description: `Invoice Payment: ${invoiceNumber}`,
    handler: function (response: any) {
      alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      onSuccess();
    },
    prefill: {
      name: customerName || 'Valued Customer',
      email: customerEmail || 'customer@autocare.com',
      contact: customerPhone || '9999999999',
    },
    theme: {
      color: '#00F0FF',
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};