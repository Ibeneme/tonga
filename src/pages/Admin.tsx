import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Loader2, 
  CalendarOff, 
  Bike, 
  DollarSign, 
  Users, 
  LogOut,
  Trash2,
  Plus,
  Home,
  MessageSquare,
  Search,
  CalendarIcon,
  Eye,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  scooter_type: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  total_days: number;
  rental_fee: number;
  deposit_amount: number;
  remaining_balance: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
}

interface BlockedDate {
  id: string;
  blocked_date: string;
  scooter_type: string;
  reason: string | null;
}

interface Inventory {
  id: string;
  scooter_type: string;
  total_count: number;
  price_per_day: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [blockReason, setBlockReason] = useState('');
  const [blockScooterType, setBlockScooterType] = useState<string>('all');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Message detail
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin-login');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (!roles || roles.length === 0) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/admin-login');
        return;
      }

      setIsAdmin(true);
      await loadData();
      setIsLoading(false);
    };

    checkAdminAndLoadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const loadData = async () => {
    try {
      await supabase.functions.invoke('expire-bookings');
    } catch (e) {
      console.log('Auto-expire check completed');
    }

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (bookingsData) setBookings(bookingsData);

    const { data: blockedData } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true });
    
    if (blockedData) setBlockedDates(blockedData);

    const { data: inventoryData } = await supabase
      .from('scooter_inventory')
      .select('*');
    
    if (inventoryData) setInventory(inventoryData);

    const { data: messagesData } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (messagesData) setContactMessages(messagesData as ContactMessage[]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleBlockDate = async () => {
    if (!selectedDate) {
      toast({ title: 'Error', description: 'Please select a date to block.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('blocked_dates').insert({
      blocked_date: format(selectedDate, 'yyyy-MM-dd'),
      scooter_type: blockScooterType,
      reason: blockReason || null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Date blocked successfully.' });
      setSelectedDate(undefined);
      setBlockReason('');
      await loadData();
    }
  };

  const handleUnblockDate = async (id: string) => {
    const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Date unblocked successfully.' });
      await loadData();
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Booking status updated.' });
      await loadData();
    }
  };

  const handleUpdateInventory = async (type: string, count: number) => {
    const { error } = await supabase.from('scooter_inventory').update({ total_count: count }).eq('scooter_type', type);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Inventory updated.' });
      await loadData();
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    await loadData();
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Message deleted.' });
      setSelectedMessage(null);
      await loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      active: 'default',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = b.customer_name.toLowerCase().includes(q);
      const matchesEmail = b.customer_email.toLowerCase().includes(q);
      const matchesPhone = b.customer_phone.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesPhone) return false;
    }
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterDateFrom) {
      const pickupDate = new Date(b.pickup_date);
      if (pickupDate < filterDateFrom) return false;
    }
    if (filterDateTo) {
      const pickupDate = new Date(b.pickup_date);
      if (pickupDate > filterDateTo) return false;
    }
    return true;
  });

  // Stats
  const totalBookings = bookings.length;
  const activeRentals = bookings.filter(b => b.status === 'active').length;
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.rental_fee), 0);
  const totalScooters = inventory.reduce((sum, i) => sum + i.total_count, 0);
  const unreadMessages = contactMessages.filter(m => !m.is_read).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your scooter rental business</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/"><Home className="w-4 h-4 mr-2" />Home</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="shadow-card border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Bookings</p>
                    <p className="font-display text-xl font-bold">{totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Bike className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Active</p>
                    <p className="font-display text-xl font-bold">{activeRentals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Bike className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Scooters</p>
                    <p className="font-display text-xl font-bold">{totalScooters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sunset/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-sunset" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Revenue</p>
                    <p className="font-display text-xl font-bold">{totalRevenue.toFixed(0)} TOP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Messages</p>
                    <p className="font-display text-xl font-bold">
                      {unreadMessages > 0 ? <span className="text-destructive">{unreadMessages}</span> : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="dates">Block Dates</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  {/* Search & Filter Bar */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !filterDateFrom && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDateFrom ? format(filterDateFrom, "MMM dd") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filterDateFrom} onSelect={setFilterDateFrom} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !filterDateTo && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDateTo ? format(filterDateTo, "MMM dd") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filterDateTo} onSelect={setFilterDateTo} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    {(searchQuery || filterStatus !== 'all' || filterDateFrom || filterDateTo) && (
                      <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterDateFrom(undefined); setFilterDateTo(undefined); }}>
                        <X className="w-4 h-4 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your filters.'}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Scooter</TableHead>
                            <TableHead>Booking Date</TableHead>
                            <TableHead>Pickup</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Amount Paid</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <p className="font-medium">{booking.customer_name}</p>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{booking.customer_email}</p>
                                  <p className="text-muted-foreground">{booking.customer_phone}</p>
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{booking.scooter_type}</TableCell>
                              <TableCell className="text-sm">{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{booking.pickup_date} at {booking.pickup_time}</p>
                                  <p className="text-muted-foreground">to {booking.return_date} at {booking.return_time}</p>
                                </div>
                              </TableCell>
                              <TableCell>{booking.total_days}</TableCell>
                              <TableCell>{booking.rental_fee} TOP</TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                              <TableCell>
                                <Select value={booking.status} onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Contact Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactMessages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No messages yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {contactMessages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => { setSelectedMessage(msg); if (!msg.is_read) handleMarkMessageRead(msg.id); }}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors border",
                              !msg.is_read ? "bg-primary/5 border-primary/20 font-medium" : "bg-muted border-transparent",
                              selectedMessage?.id === msg.id && "ring-2 ring-primary"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{msg.name}</p>
                                <p className="text-xs text-muted-foreground">{msg.subject}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Message Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">From</Label>
                          <p className="font-medium">{selectedMessage.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                          {selectedMessage.phone && <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>}
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Subject</Label>
                          <p className="font-medium">{selectedMessage.subject}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Message</Label>
                          <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">{selectedMessage.message}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Received: {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                              Reply via Email
                            </a>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Select a message to view details.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Block Dates Tab */}
            <TabsContent value="dates">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarOff className="w-5 h-5" />
                      Block a Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border pointer-events-auto"
                    />
                    
                    <div className="space-y-2">
                      <Label>Scooter Type</Label>
                      <Select value={blockScooterType} onValueChange={setBlockScooterType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Scooters</SelectItem>
                          <SelectItem value="single">Single Only</SelectItem>
                          <SelectItem value="double">Double Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Reason (optional)</Label>
                      <Input placeholder="e.g., Maintenance, Holiday" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} />
                    </div>

                    <Button onClick={handleBlockDate} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />Block Date
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Blocked Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blockedDates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No dates blocked.</p>
                    ) : (
                      <div className="space-y-2">
                        {blockedDates.map((date) => (
                          <div key={date.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{date.blocked_date}</p>
                              <p className="text-sm text-muted-foreground">
                                {date.scooter_type === 'all' ? 'All scooters' : `${date.scooter_type} only`}
                                {date.reason && ` • ${date.reason}`}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleUnblockDate(date.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Scooter Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inventory.map((item) => (
                      <Card key={item.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center">
                              <Bike className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-display font-semibold capitalize">{item.scooter_type} Scooter</h3>
                              <p className="text-sm text-muted-foreground">{item.price_per_day} TOP/day</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Total Available</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min="0"
                                value={item.total_count}
                                onChange={(e) => {
                                  const newInventory = inventory.map(i =>
                                    i.id === item.id ? { ...i, total_count: parseInt(e.target.value) || 0 } : i
                                  );
                                  setInventory(newInventory);
                                }}
                              />
                              <Button onClick={() => handleUpdateInventory(item.scooter_type, item.total_count)}>Update</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
