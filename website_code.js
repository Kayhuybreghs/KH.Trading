import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, Quote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TradingWebsite = () => {
  // States
  const [visibleStats, setVisibleStats] = useState([]);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [showPurchaseError, setShowPurchaseError] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCoaching, setSelectedCoaching] = useState(null);

  // Data
  const stats = [
    { label: 'Win Rate', value: '38.1%', color: 'text-green-600' },
    { label: 'Break-even Rate', value: '37.1%', color: 'text-yellow-600' },
    { label: 'Loss Rate', value: '24.7%', color: 'text-red-600' }
  ];

  const coachingOptions = [
    { months: 1, price: 49.99, discount: 0 },
    { months: 2, price: 89.98, discount: 10 },
    { months: 3, price: 104.97, discount: 30 },
  ];

  const features = [
    {
      title: 'Systematic Approach',
      description: 'Clear entry and exit rules',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Risk Management',
      description: 'Protected capital growth',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Regular Updates',
      description: 'Ongoing strategy refinement',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  const [reviews, setReviews] = useState([
    {
      id: 1,
      text: "The systematic approach really helped me develop discipline in my trading. The risk management rules are clear and effective.",
      rating: 5,
      author: "Guus",
      purchaseDate: "2024-01-15"
    },
    {
      id: 2,
      text: "Good strategy overall, took some time to adapt but seeing consistent results now. Would appreciate more advanced setups.",
      rating: 4,
      author: "James",
      purchaseDate: "2024-02-01"
    },
    {
      id: 3,
      text: "Very practical approach to trading. The coaching sessions were particularly valuable for understanding market psychology.",
      rating: 4.5,
      author: "Daan",
      purchaseDate: "2024-02-15"
    }
  ]);

  useEffect(() => {
    stats.forEach((_, index) => {
      setTimeout(() => {
        setVisibleStats(prev => [...prev, index]);
      }, 1000 * (index + 1));
    });

    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures(prev => [...prev, index]);
      }, 500 * (index + 1));
    });

    const reviewInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        setIsAnimating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(reviewInterval);
  }, [reviews.length]);

  const handleStrategyPurchase = () => {
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr";
    const params = new URLSearchParams({
      cmd: "_xclick",
      business: "Kayhuybreghs@icloud.com",
      item_name: "Trading Strategy",
      amount: "250.00",
      currency_code: "EUR",
      return: window.location.href,
      cancel_return: window.location.href
    });
    window.location.href = `${baseUrl}?${params.toString()}`;
    setHasPurchased(true);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  const handleCoachingPurchase = () => {
    if (!selectedCoaching) return;
    
    const option = coachingOptions[parseInt(selectedCoaching) - 1];
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr";
    const params = new URLSearchParams({
      cmd: "_xclick-subscriptions",
      business: "Kayhuybreghs@icloud.com",
      item_name: `${option.months} Month(s) Trading Coaching`,
      a3: option.price.toFixed(2),
      p3: option.months,
      t3: "M",
      src: "1",
      currency_code: "EUR",
      return: window.location.href,
      cancel_return: window.location.href
    });
    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  const verifyPurchaseAndOpenDialog = () => {
    if (!hasPurchased) {
      setShowPurchaseError(true);
      setTimeout(() => setShowPurchaseError(false), 3000);
      return;
    }
    
    const purchaseTime = new Date(purchaseDate).getTime();
    const currentTime = new Date().getTime();
    const hoursSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60);
    
    if (hoursSincePurchase < 24) {
      alert("Please wait 24 hours after purchase before leaving a review.");
      return;
    }
    
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (newReview.trim() && selectedRating > 0) {
      const newReviewObject = {
        id: reviews.length + 1,
        text: newReview.trim(),
        rating: selectedRating,
        author: "John",
        purchaseDate: purchaseDate
      };
      
      setReviews(prev => [...prev, newReviewObject]);
      setNewReview('');
      setSelectedRating(0);
      setIsReviewDialogOpen(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="w-5 h-5 text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  KH Trading
                </h1>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
                  Master the Markets
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-t border-b border-yellow-200 px-4 py-3">
        <p className="text-center text-yellow-800 font-medium">
          Trading involves substantial risk of loss. Only trade with risk capital you can afford to lose.
        </p>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:scale-105 ${
                  visibleFeatures.includes(index) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="performance" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Performance Metrics</h2>
            <p className="mt-4">Based on real trading results from Jan 2023 - Present</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="col-span-1 bg-white shadow-xl">
                <CardContent className="p-6">
                  <div className={`text-xl font-bold ${stat.color}`}>
                    {stat.label}
                  </div>
                  <div className="text-2xl font-extrabold mt-2">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Start Trading Today
            </h2>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8 text-center">
                <h3 className="text-3xl font-bold text-gray-900">Trading Strategy</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">€250</span>
                  <span className="text-gray-500"> one-time</span>
                </div>
                <Button 
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleStrategyPurchase}
                >
                  Get Started Now
                </Button>

                <div className="mt-8 space-y-4">
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold mb-2">Personal Coaching Options</h4>
                    <Select onValueChange={setSelectedCoaching}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select coaching duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {coachingOptions.map((option, index) => (
                          <SelectItem key={index + 1} value={String(index + 1)}>
                            {option.months} Month{option.months > 1 ? 's' : ''} - €{option.price.toFixed(2)}
                            {option.discount > 0 && ` (${option.discount}% off)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      className="mt-4 w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCoachingPurchase}
                      disabled={!selectedCoaching}
                    >
                      Add Coaching
                    </Button>
                  </div>
                </div>
                
                <p className="mt-4 text-sm">*Strategy purchase required for coaching</p>
                <p className="mt-4 text-xs">No refunds available. By purchasing, you agree to our terms of service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Customer Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-600 mb-4">{review.text}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{review.author}</span>
                    <span>{review.purchaseDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with our trading system
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                onClick={() => setSelectedRating(rating)}
                className={selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}
              >
                <Star className="w-6 h-6" />
              </Button>
            ))}
          </div>
          <Textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            className="min-h-[100px] mb-4"
          />
          <Button onClick={handleSubmitReview} className="w-full">
            Submit Review
          </Button>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4">
        <Button
          onClick={verifyPurchaseAndOpenDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Leave a Review
        </Button>
      </div>

      {showPurchaseError && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Please purchase before leaving a review
        </div>
      )}
    </div>
  );
};

export default TradingWebsite;
