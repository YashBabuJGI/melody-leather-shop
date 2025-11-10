import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, MapPin, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OrderMilestone {
  id: string;
  status: 'completed' | 'current' | 'pending';
  title: string;
  description: string;
  timestamp?: string;
  location?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: any;
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!orderId) {
      navigate('/orders');
      return;
    }

    fetchOrder();
  }, [user, orderId, navigate]);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestones = (orderStatus: string, createdAt: string): OrderMilestone[] => {
    const baseDate = new Date(createdAt);
    
    const milestones: OrderMilestone[] = [
      {
        id: '1',
        status: 'completed',
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        timestamp: baseDate.toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
        location: 'Online'
      },
      {
        id: '2',
        status: orderStatus === 'pending' ? 'current' : 'completed',
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: orderStatus !== 'pending' ? new Date(baseDate.getTime() + 2 * 60 * 60 * 1000).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : undefined,
        location: 'Warehouse - Austin, TX'
      },
      {
        id: '3',
        status: orderStatus === 'processing' ? 'current' : orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'pending',
        title: 'Shipped',
        description: 'Your order has left our facility',
        timestamp: orderStatus === 'shipped' || orderStatus === 'delivered' ? new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : undefined,
        location: 'Left Delhi Hub'
      },
      {
        id: '4',
        status: orderStatus === 'shipped' ? 'current' : orderStatus === 'delivered' ? 'completed' : 'pending',
        title: 'In Transit',
        description: 'Package is on its way to you',
        timestamp: orderStatus === 'delivered' ? new Date(baseDate.getTime() + 48 * 60 * 60 * 1000).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : undefined,
        location: 'Reached Bangalore Hub'
      },
      {
        id: '5',
        status: orderStatus === 'delivered' ? 'completed' : 'pending',
        title: 'Out for Delivery',
        description: 'Your package is out for delivery',
        timestamp: orderStatus === 'delivered' ? new Date(baseDate.getTime() + 72 * 60 * 60 * 1000).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : undefined,
        location: 'Local Delivery Partner'
      },
      {
        id: '6',
        status: orderStatus === 'delivered' ? 'completed' : 'pending',
        title: 'Delivered',
        description: 'Package delivered successfully',
        timestamp: orderStatus === 'delivered' ? new Date(baseDate.getTime() + 96 * 60 * 60 * 1000).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : undefined,
        location: 'Your Doorstep'
      }
    ];

    return milestones;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'current':
        return <Clock className="w-8 h-8 text-primary animate-pulse" />;
      default:
        return <div className="w-8 h-8 rounded-full border-2 border-muted" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">We couldn't find this order.</p>
        <Button onClick={() => navigate('/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const milestones = getMilestones(order.status, order.created_at);
  const currentMilestone = milestones.find(m => m.status === 'current');

  return (
    <div className="container mx-auto px-4 py-24">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/orders')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Track Your Order</CardTitle>
                <CardDescription>
                  Order ID: <span className="font-mono text-foreground">{order.id.slice(0, 8)}</span>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold">${order.total_amount}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Current Status Card */}
            {currentMilestone && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {currentMilestone.status === 'current' ? (
                        <Truck className="w-12 h-12 text-primary animate-pulse" />
                      ) : (
                        <Package className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{currentMilestone.title}</h3>
                      <p className="text-muted-foreground">{currentMilestone.description}</p>
                      {currentMilestone.location && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {currentMilestone.location}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator className="my-6" />

            {/* Timeline */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold mb-4">Shipping Timeline</h3>
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 relative z-10">
                    {getStatusIcon(milestone.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className={`${
                      milestone.status === 'completed' ? 'text-foreground' : 
                      milestone.status === 'current' ? 'text-primary font-semibold' : 
                      'text-muted-foreground'
                    }`}>
                      <h4 className="text-base font-medium mb-1">{milestone.title}</h4>
                      <p className="text-sm">{milestone.description}</p>
                      {milestone.timestamp && (
                        <p className="text-xs mt-2 opacity-70">{milestone.timestamp}</p>
                      )}
                      {milestone.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                          <MapPin className="w-3 h-3" />
                          {milestone.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                <p className="text-sm text-muted-foreground mt-1">{order.shipping_address.address}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">{order.shipping_address.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
