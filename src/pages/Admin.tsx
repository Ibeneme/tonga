import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Loader2,
  CalendarOff,
  Bike,
  DollarSign,
  Users,
  LogOut,
  Trash2,
  Plus,
} from "lucide-react";

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

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [blockReason, setBlockReason] = useState("");
  const [blockScooterType, setBlockScooterType] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin-login");
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        navigate("/admin-login");
        return;
      }

      setIsAdmin(true);
      await loadData();
      setIsLoading(false);
    };

    checkAdminAndLoadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin-login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const loadData = async () => {
    // Load bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsData) setBookings(bookingsData);

    // Load blocked dates
    const { data: blockedData } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (blockedData) setBlockedDates(blockedData);

    // Load inventory
    const { data: inventoryData } = await supabase
      .from("scooter_inventory")
      .select("*");

    if (inventoryData) setInventory(inventoryData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleBlockDate = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date to block.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("blocked_dates").insert({
      blocked_date: format(selectedDate, "yyyy-MM-dd"),
      scooter_type: blockScooterType,
      reason: blockReason || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Date blocked successfully.",
      });
      setSelectedDate(undefined);
      setBlockReason("");
      await loadData();
    }
  };

  const handleUnblockDate = async (id: string) => {
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Date unblocked successfully.",
      });
      await loadData();
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Booking status updated.",
      });
      await loadData();
    }
  };

  const handleUpdateInventory = async (type: string, count: number) => {
    const { error } = await supabase
      .from("scooter_inventory")
      .update({ total_count: count })
      .eq("scooter_type", type);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Inventory updated.",
      });
      await loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      confirmed: "default",
      active: "default",
      completed: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  // Calculate stats
  const totalBookings = bookings.length;
  const activeRentals = bookings.filter((b) => b.status === "active").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + Number(b.rental_fee), 0);
  const totalScooters = inventory.reduce((sum, i) => sum + i.total_count, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your scooter rental business
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Bookings
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {totalBookings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Bike className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Active Rentals
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {activeRentals}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Bike className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Scooters
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {totalScooters}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sunset/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-sunset" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Revenue
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {totalRevenue.toFixed(2)} TOP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="dates">Block Dates</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Scooter</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {booking.customer_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.customer_email}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.customer_phone}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">
                                {booking.scooter_type}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>
                                    {booking.pickup_date} at{" "}
                                    {booking.pickup_time}
                                  </p>
                                  <p className="text-muted-foreground">
                                    to {booking.return_date}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{booking.rental_fee} TOP</TableCell>
                              <TableCell>
                                {getStatusBadge(booking.status)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={booking.status}
                                  onValueChange={(value) =>
                                    handleUpdateBookingStatus(booking.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                      Confirmed
                                    </SelectItem>
                                    <SelectItem value="active">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
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
                      <Select
                        value={blockScooterType}
                        onValueChange={setBlockScooterType}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Scooters</SelectItem>
                          <SelectItem value="single">Single Only</SelectItem>
                          <SelectItem value="double">Double Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Reason (optional)</Label>
                      <Input
                        placeholder="e.g., Maintenance, Holiday"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleBlockDate} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Block Date
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Blocked Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blockedDates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No dates blocked.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {blockedDates.map((date) => (
                          <div
                            key={date.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{date.blocked_date}</p>
                              <p className="text-sm text-muted-foreground">
                                {date.scooter_type === "all"
                                  ? "All scooters"
                                  : `${date.scooter_type} only`}
                                {date.reason && ` • ${date.reason}`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUnblockDate(date.id)}
                            >
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
                              <h3 className="font-display font-semibold capitalize">
                                {item.scooter_type} Scooter
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.price_per_day} TOP/day
                              </p>
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
                                  const newInventory = inventory.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          total_count:
                                            parseInt(e.target.value) || 0,
                                        }
                                      : i
                                  );
                                  setInventory(newInventory);
                                }}
                              />
                              <Button
                                onClick={() =>
                                  handleUpdateInventory(
                                    item.scooter_type,
                                    item.total_count
                                  )
                                }
                              >
                                Update
                              </Button>
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
