import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, LockIcon, Shield, CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';

const PaymentPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Secure Payment | UPLIFT Technologies';
  }, []);
  
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    amount: '',
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would integrate with Stripe or another payment processor
    console.log(formData);
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };
  
  return (
    <div className="pt-32 pb-20">
      <Section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              Secure <span className="gradient-text">Payment</span> Portal
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Make a secure payment for UPLIFT Technologies services. All transactions are protected with industry-standard encryption.
            </p>
          </motion.div>
        </div>
        
        <div className="glass-card p-8 md:p-10">
          {paymentComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-success-500/20 p-4 rounded-full">
                  <CheckCircle size={60} className="text-success-500" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Payment Successful!</h2>
              <p className="text-white/80 mb-6">
                Thank you for your payment. A receipt has been sent to your email address.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Return to Homepage
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-700 pb-4 mb-6">
                  <h2 className="text-xl font-medium flex items-center">
                    <CreditCard size={24} className="mr-2 text-electric-violet" />
                    Payment Details
                  </h2>
                  <div className="flex items-center text-white/60 text-sm">
                    <LockIcon size={16} className="mr-2" />
                    Secure Payment
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="invoiceNumber" className="block text-sm font-medium text-white/80 mb-2">
                      Invoice Number*
                    </label>
                    <input
                      type="text"
                      id="invoiceNumber"
                      name="invoiceNumber"
                      required
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                      placeholder="INV-XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-2">
                      Payment Amount (USD)*
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      required
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="border-t border-neutral-700 pt-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-neutral-700 pt-6">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-white/80 mb-2">
                      Card Number*
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-white/80 mb-2">
                        Expiry Date*
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-white/80 mb-2">
                        CVV*
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-violet focus:border-transparent text-white"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center bg-deep-purple/10 border border-electric-violet/30 rounded-md p-4 text-sm mt-6">
                  <Shield size={20} className="text-electric-violet mr-3 flex-shrink-0" />
                  <p className="text-white/80">
                    Your payment information is secure. We use industry-standard encryption to protect your data.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Make Payment
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default PaymentPage;