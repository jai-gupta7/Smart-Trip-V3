import React from 'react';
import { ArrowLeft, Box, ChevronLeft, ChevronRight, Package, Phone, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const pageSizeOptions = ['10', '20', '50'];

const InfoPair = ({ label, value, icon: Icon }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
      {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
      <span>{value || '-'}</span>
    </p>
  </div>
);

const StatBlock = ({ icon: Icon, label, value, tone = 'default' }) => {
  const toneClasses =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-600'
      : tone === 'info'
        ? 'bg-blue-50 text-blue-600'
        : 'bg-muted text-muted-foreground';

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default function BayOperationalDetailsView({
  activeLoadingBay,
  paginatedRows,
  loadingBayPage,
  loadingBayPageSize,
  loadingBayTotalPages,
  onBack,
  onPageChange,
  onPageSizeChange,
  progressArtwork,
}) {
  const title = activeLoadingBay?.id ? `Loading Bay ${activeLoadingBay.id}` : 'Bay Operational Details';
  const subtitle =
    activeLoadingBay?.vehicleModel || 'Overview of current loading status for the selected bay.';

  return (
    <div className="space-y-6">
      <div className="flex">
        <Button
          variant="ghost"
          className="gap-2 px-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to loading bays
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr),420px]">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="gap-5 border-b border-border/60 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
                <CardDescription className="mt-1 text-sm">{subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            <div className="overflow-hidden rounded-xl border border-border/70">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12" />
                      <TableHead>CN Number</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Delivery Location</TableHead>
                      <TableHead>Box Count</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/20">
                        <TableCell>
                          <span className="block h-5 w-5 rounded-full border border-border" />
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="font-medium text-primary">{row.cnNumber}</p>
                            <p className="text-xs text-muted-foreground">{row.cnDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-foreground">{row.invoice}</span>
                            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              +{row.extraInvoiceCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top font-medium">{row.customer}</TableCell>
                        <TableCell className="max-w-[280px] whitespace-normal align-top text-sm text-muted-foreground">
                          {row.deliveryLocation}
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {row.boxCount}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>C/W: {row.chargeableWeight}</p>
                            <p>A/W: {row.actualWeight}</p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top text-center">
                          <button
                            type="button"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-destructive/40 text-destructive transition hover:bg-destructive/10"
                            aria-label={`Remove ${row.cnNumber}`}
                          >
                            -
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Rows per page</span>
                  <Select value={loadingBayPageSize} onValueChange={onPageSizeChange}>
                    <SelectTrigger className="h-10 w-[84px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 self-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingBayPage === 1}
                    onClick={() => onPageChange(Math.max(1, loadingBayPage - 1))}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Prev
                  </Button>
                  {Array.from({ length: loadingBayTotalPages }, (_, index) => index + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === loadingBayPage ? 'default' : 'outline'}
                      size="sm"
                      className="w-10"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingBayPage === loadingBayTotalPages}
                    onClick={() => onPageChange(Math.min(loadingBayTotalPages, loadingBayPage + 1))}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-5">
            <CardTitle className="text-xl">Bay Overview</CardTitle>
            <CardDescription>Track progress and confirm the live loading assignment.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <StatBlock
                icon={Package}
                label="Scanned CNs"
                value={activeLoadingBay?.scannedCNs || 0}
                tone="success"
              />
              <StatBlock
                icon={Box}
                label="Remaining CNs"
                value={activeLoadingBay?.remainingCNs || 0}
                tone="info"
              />
            </div>

            <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned vehicle</p>
                  <p className="mt-1 font-medium">
                    {activeLoadingBay?.vehicleModel || 'No vehicle selected'}
                  </p>
                </div>
                <div className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground">
                  {activeLoadingBay?.truckSize || 'Pending'}
                </div>
              </div>

              <div className="flex justify-center rounded-lg bg-background px-3 py-4">
                {progressArtwork || (
                  <div className="flex justify-center">
                    <img
                      src="/truck_right.png"
                      alt="Truck progress"
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{activeLoadingBay?.capacity || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={activeLoadingBay?.progress || 0} className="h-2.5 flex-1" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeLoadingBay?.progress || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 border-t border-border/60 pt-6 sm:grid-cols-2">
              <InfoPair label="Driver" value={activeLoadingBay?.driverName} />
              <InfoPair label="Driver Contact" value={activeLoadingBay?.driverContact} icon={Phone} />
              <InfoPair label="Success Rate" value={activeLoadingBay?.successRate} />
              <InfoPair label="Dock" value={activeLoadingBay?.dockName} />
              <InfoPair label="Loader" value={activeLoadingBay?.loaderName} />
              <InfoPair label="Loader Contact" value={activeLoadingBay?.loaderContact} icon={Phone} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
