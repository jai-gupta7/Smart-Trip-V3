import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, IndianRupee, Package, XCircle } from 'lucide-react';

const DRSReconciliationDialog = ({ open, onOpenChange, trip, onCloseDRS }) => {
  if (!trip) return null;

  // Generate some dummy table data if actual routeItems are empty/incompatible
  const mockDeliveries = [
    { id: 1, customer: 'Flipkart', location: 'Andheri West', cnCount: 3, boxCount: 12, freight: 450, status: 'Delivered', mode: 'Online' },
    { id: 2, customer: 'Myntra', location: 'Bandra', cnCount: 1, boxCount: 2, freight: 120, status: 'Delivered', mode: 'Online' },
    { id: 3, customer: 'Snapdeal', location: 'Santacruz', cnCount: 2, boxCount: 5, freight: 300, status: 'Delivered', mode: 'Cash' },
    { id: 4, customer: 'Amazon', location: 'Juhu', cnCount: 4, boxCount: 15, freight: 600, status: 'Delivered', mode: 'Cash' },
    { id: 5, customer: 'Meesho', location: 'Vile Parle', cnCount: 1, boxCount: 1, freight: 80, status: 'Undelivered', mode: 'Online' },
  ];

  const itemsToRender = (trip.routeItems && trip.routeItems.length > 0) 
    ? trip.routeItems.map(item => ({
        id: item.id,
        customer: item.customerName || item.customer || 'Unknown Customer',
        location: typeof item.customerLocation === 'string' ? item.customerLocation : (item.customerAddress || 'N/A'),
        cnCount: 1,
        boxCount: item.expectedLoad || Math.floor(Math.random() * 5) + 1,
        freight: Math.floor(Math.random() * 500) + 100,
        status: Math.random() > 0.1 ? 'Delivered' : 'Undelivered',
        mode: Math.random() > 0.5 ? 'Online' : 'Cash',
      }))
    : mockDeliveries;

  const deliveredCount = itemsToRender.filter(i => i.status === 'Delivered').length;
  const totalCount = itemsToRender.length;
  
  const onlineFreight = itemsToRender.filter(i => i.mode === 'Online' && i.status === 'Delivered').reduce((sum, i) => sum + i.freight, 0);
  const cashFreight = itemsToRender.filter(i => i.mode === 'Cash' && i.status === 'Delivered').reduce((sum, i) => sum + i.freight, 0);
  const totalFreight = onlineFreight + cashFreight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden flex flex-col h-[85vh]">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                DRS Scanning
                <Badge variant="outline" className="ml-2 font-mono bg-background">
                  {trip.routeName || trip.id}
                </Badge>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Verify deliveries and reconcile payments before closing the trip.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Table */}
          <div className="flex-1 flex flex-col border-r bg-background">
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">CN Count</TableHead>
                    <TableHead className="text-center">Box Count</TableHead>
                    <TableHead className="text-right">Freight</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsToRender.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.customer}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate" title={item.location}>
                        {item.location}
                      </TableCell>
                      <TableCell className="text-center">{item.cnCount}</TableCell>
                      <TableCell className="text-center">{item.boxCount}</TableCell>
                      <TableCell className="text-right font-medium">₹{item.freight}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={item.mode === 'Online' ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'}>
                          {item.mode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.status === 'Delivered' ? (
                          <div className="flex items-center text-emerald-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Delivered
                          </div>
                        ) : (
                          <div className="flex items-center text-destructive text-sm font-medium">
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Undelivered
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Right Panel: Sidebar */}
          <div className="w-[340px] bg-muted/10 p-6 flex flex-col shrink-0 overflow-y-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Financial Reconciliation</h3>
            
            <div className="space-y-6 flex-1">
              <Card className="shadow-none border-border/60">
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Delivery Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivered CNs</p>
                      <p className="text-2xl font-bold text-emerald-600">{deliveredCount} <span className="text-base font-normal text-muted-foreground">/ {totalCount}</span></p>
                    </div>
                  </div>
                  {totalCount - deliveredCount > 0 && (
                    <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive font-medium flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      {totalCount - deliveredCount} CNs marked Undelivered
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-none border-border/60">
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    Freight Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Online Collected</span>
                    <span className="font-semibold">₹{onlineFreight.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cash to Deposit</span>
                    <span className="font-semibold text-emerald-600">₹{cashFreight.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-dashed pt-3 mt-1 flex items-center justify-between">
                    <span className="text-sm font-semibold">Total Freight</span>
                    <span className="text-lg font-bold">₹{totalFreight.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-6 border-t mt-6">
              <Button 
                size="lg" 
                className="w-full text-base font-medium h-12"
                onClick={() => onCloseDRS(trip.id)}
              >
                Close DRS
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DRSReconciliationDialog;
