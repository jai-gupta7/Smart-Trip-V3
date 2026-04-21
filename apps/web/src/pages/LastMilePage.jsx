
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadcrumbNav from '@/components/BreadcrumbNav';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import ActionButton from '@/components/ActionButton';
import { getAppointmentCNs, getYellowFlagCNs, getRegularCNs } from '@/lib/dummyData';
import { Calendar, AlertTriangle, Map, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LastMilePage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const appointmentCNs = getAppointmentCNs();
  const yellowFlagCNs = getYellowFlagCNs();
  const regularCNs = getRegularCNs();

  return (
    <div className="om-container py-8">
      <BreadcrumbNav />

      <div className="mb-6 flex justify-end">
        <ActionButton 
          label="Create Smart Trip" 
          icon={Map} 
          size="lg"
          onClick={() => navigate('/smart-trip-creation')}
        />
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="appointments">Appointments & Scheduled</TabsTrigger>
          <TabsTrigger value="yellow-flag">Yellow Flag CNs</TabsTrigger>
          <TabsTrigger value="regular">Regular CNs & Pickups</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment CNs</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterBar onSearch={setSearch} />
              <div className="overflow-x-auto">
                <table className="om-data-table">
                  <thead>
                    <tr>
                      <th>CN ID</th>
                      <th>Customer</th>
                      <th>Delivery Location</th>
                      <th>Time Window</th>
                      <th>Suggested Vehicle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentCNs.slice(0, 10).map(item => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.id}</td>
                        <td>{item.customer}</td>
                        <td>{item.deliveryLocation}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {item.timeWindow}
                          </div>
                        </td>
                        <td>{item.vehicleSuggestion}</td>
                        <td>
                          <ActionButton variant="outline" size="sm" label="Assign Vehicle" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yellow-flag">
          <Card className="border-warning/50">
            <CardHeader className="bg-warning/5 border-b border-warning/20">
              <CardTitle className="flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Yellow Flagged CNs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FilterBar onSearch={setSearch} />
              <div className="overflow-x-auto">
                <table className="om-data-table">
                  <thead>
                    <tr>
                      <th>CN ID</th>
                      <th>Customer</th>
                      <th>Flag Reason</th>
                      <th>Flagged By</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yellowFlagCNs.map(item => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.id}</td>
                        <td>{item.customer}</td>
                        <td className="text-destructive text-sm">{item.flagReason}</td>
                        <td>{item.flaggedBy}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>
                          <ActionButton icon={CheckCircle} variant="outline" size="sm" label="Resolve" requireConfirm />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regular">
          <Card>
            <CardHeader>
              <CardTitle>Regular CNs & Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterBar onSearch={setSearch} />
              <div className="overflow-x-auto">
                <table className="om-data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Location</th>
                      <th>Weight/Vol</th>
                      <th>Time Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularCNs.slice(0, 10).map(item => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.id}</td>
                        <td>
                          <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'CN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td>{item.customer}</td>
                        <td>{item.location}</td>
                        <td className="text-sm text-muted-foreground">{item.weight} / {item.volume}</td>
                        <td>{item.deliveryTimeWindow}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LastMilePage;
