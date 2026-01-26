import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerPerformance = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const data = await dashboardService.getSellerPerformance();
      setSellers(data.sellers);
      if (data.sellers.length > 0) {
        setSelectedSeller(data.sellers[0]);
        fetchSellerData(data.sellers[0].id);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerData = async (sellerId) => {
    setSellerLoading(true);
    try {
      // Fetch specific seller data using the API
      const params = { sellerId };
      const data = await dashboardService.getSellerPerformance(params);
      const seller = data.sellers.find(s => s.id === sellerId);

      // Format the data to match what the component expects
      const formattedData = {
        properties: [], // This would come from a separate endpoint in a real implementation
        monthlySales: [], // This would come from a separate endpoint in a real implementation
        performanceMetrics: {
          totalProperties: seller.totalProperties,
          totalSales: seller.soldProperties,
          totalRevenue: seller.revenue,
          avgSalePrice: seller.soldProperties > 0 ? seller.revenue / seller.soldProperties : 0,
          avgDaysToSell: 45, // Placeholder
          conversionRate: 18.5, // Placeholder
          avgRating: seller.avgRating,
          totalViews: seller.views || 0,
          totalInquiries: seller.inquiries
        }
      };

      setSellerData(formattedData);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast.error('Failed to load seller data');
    } finally {
      setSellerLoading(false);
    }
  };

  const handleSellerSelect = (seller) => {
    setSelectedSeller(seller);
    fetchSellerData(seller.id);
  };

  // Chart data for monthly sales
  const monthlySalesData = {
    labels: sellerData?.monthlySales?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Sales Count',
        data: sellerData?.monthlySales?.map(item => item.sales) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Revenue ($)',
        data: sellerData?.monthlySales?.map(item => item.revenue) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const monthlySalesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales Count'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Seller Performance Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Seller List */}
        <div className="lg:col-span-1">
          <h3 className="font-medium text-gray-700 mb-3">Sellers</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sellers.map(seller => (
              <div
                key={seller.id}
                onClick={() => handleSellerSelect(seller)}
                className={`p-3 rounded-lg cursor-pointer border ${
                  selectedSeller?.id === seller.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${(seller.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">{seller.sales} sales</p>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-gray-600">{seller.properties} properties</span>
                  <span className="text-yellow-600">★ {seller.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Details */}
        <div className="lg:col-span-3">
          {selectedSeller && (
            <div>
              <div className="flex justify-between items-start mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">{selectedSeller.name}</h3>
                  <p className="text-gray-600">{selectedSeller.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">${(selectedSeller.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-600">{selectedSeller.sales} sales • {selectedSeller.properties} properties</p>
                </div>
              </div>

              {sellerLoading ? (
                <Loader />
              ) : (
                <div>
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{sellerData?.performanceMetrics.totalSales || 0}</p>
                      <p className="text-sm text-gray-600">Total Sales</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">${(sellerData?.performanceMetrics.avgSalePrice / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-gray-600">Avg Sale Price</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{sellerData?.performanceMetrics.conversionRate || 0}%</p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{sellerData?.performanceMetrics.avgRating || 0}★</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                  </div>

                  {/* Monthly Sales Chart */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <Line data={monthlySalesData} options={monthlySalesOptions} />
                  </div>

                  {/* Properties List */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Recent Properties</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inquiries</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sellerData?.properties?.map(property => (
                            <tr key={property.id}>
                              <td className="px-4 py-2 text-sm">{property.title}</td>
                              <td className="px-4 py-2 text-sm">${property.price.toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  property.status === 'sold' ? 'bg-green-100 text-green-800' :
                                  property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {property.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm">{property.views}</td>
                              <td className="px-4 py-2 text-sm">{property.inquiries}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Performance Metrics</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Revenue:</span>
                          <span className="font-medium">${sellerData?.performanceMetrics.totalRevenue?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Days to Sell:</span>
                          <span className="font-medium">{sellerData?.performanceMetrics.avgDaysToSell || 0} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Views:</span>
                          <span className="font-medium">{sellerData?.performanceMetrics.totalViews?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Inquiries:</span>
                          <span className="font-medium">{sellerData?.performanceMetrics.totalInquiries?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Top Performing Properties</h5>
                      <div className="space-y-2 text-sm">
                        {sellerData?.properties
                          ?.filter(p => p.status === 'sold')
                          .sort((a, b) => b.price - a.price)
                          .slice(0, 3)
                          .map(property => (
                            <div key={property.id} className="flex justify-between">
                              <span className="truncate max-w-[150px]">{property.title}</span>
                              <span className="font-medium">${(property.price / 1000).toFixed(0)}K</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPerformance;