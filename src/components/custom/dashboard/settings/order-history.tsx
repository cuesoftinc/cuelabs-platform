'use client';

import React from 'react';
import Image from 'next/image';

import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import AvatarCircle from '@/images/avatar-circle.png';
import CueCurrencyIcon from '@/svgs/cue-currency-dashboard.svg';
import { useAuth } from '@/hooks/queries/useAuth';
import { useFetchUserOrders } from '@/hooks/queries/useMarketplace';
import CustomSpinner from '@/components/custom/custom-spinner';

function OrderHistory() {
  const { user } = useAuth();
  const {
    data: ordersData,
    isLoading,
    error,
  } = useFetchUserOrders(user?.id || '');

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Group orders and add expanded state
  const [expandedOrders, setExpandedOrders] = React.useState<Set<string>>(
    new Set(),
  );

  const orders = React.useMemo(() => {
    if (!ordersData?.records) return [];

    return ordersData.records
      .map((order) => ({
        id: order.id,
        orderId: order.fields.OrderId || order.id,
        totalAmount: order.fields['Total Price'] || 0,
        status: order.fields.Status || 'New',
        date: order.fields['Created At'] || order.createdTime,
        itemsCount: order.fields['Items Count'] || 0,
        orderItems: order.orderItems || [],
        marketItems: order.marketItems || [],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [ordersData]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className='mt-8'>
        <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-8 px-0'>
          <div className='flex justify-center items-center py-8'>
            <CustomSpinner />
            <span className='ml-2 text-white'>Loading order history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-8'>
        <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-8 px-0'>
          <div className='flex justify-center items-center py-8'>
            <div className='text-red-500 text-center'>
              <p>Error loading order history: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='mt-8'>
      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-8 px-0'>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-16c leading-[18px] px-8'>
            Order History ({orders.length} orders)
          </h4>
        </div>

        <Table className='text-white mt-4'>
          {/* <TableCaption>Our top contributors.</TableCaption> */}
          <TableHeader className='[&_tr]:border-b-0'>
            <TableRow className='hover:bg-transparent uppercase text-auth-text'>
              <TableHead className='px-8'>Order</TableHead>
              <TableHead className='px-8'>Amount</TableHead>
              <TableHead className='px-8'>Status</TableHead>
              <TableHead className='px-8'>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='px-8 text-center py-8'>
                  <div className='text-auth-text'>
                    <p>No orders found</p>
                    <p className='text-xs mt-1'>
                      Your order history will appear here
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, idx) => (
                <React.Fragment key={order.id}>
              <TableRow
                    className={`font-medium text-[10px] leading-14px hover:bg-[#1f1f1f]/50 cursor-pointer ${idx % 2 === 0 ? 'bg-[#0F0F0F]' : ''}`}
                    onClick={() => toggleOrderExpansion(order.id)}
              >
                <TableCell className='px-8'>
                  <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 flex items-center justify-center'>
                          <div
                            className={`w-2 h-2 border-l-2 border-b-2 border-white transform transition-transform duration-200 ${
                              expandedOrders.has(order.id)
                                ? 'rotate-45'
                                : '-rotate-45'
                            }`}
                          />
                        </div>
                        <div>
                          <span className='text-white font-medium'>
                            {order.orderId}
                          </span>
                          <p className='text-auth-text text-xs'>
                            {order.itemsCount} items
                          </p>
                        </div>
                  </div>
                </TableCell>
                <TableCell className='px-8'>
                  <div className='text-white font-medium text-sm flex items-center gap-1'>
                    <Image
                      src={CueCurrencyIcon}
                      alt='cue currency icon'
                      width={12}
                      height={12}
                    />
                        <span>{order.totalAmount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className='px-8'>
                  <div
                    className={`${
                          order.status === 'Pending'
                        ? 'inactive-status'
                            : order.status === 'Canceled'
                          ? 'canceled-status'
                              : order.status === 'Delivered'
                                ? 'active-status'
                          : 'active-status'
                    } w-fit`}
                  >
                        {order.status === 'Delivered' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
                            <span>Delivered</span>
                      </div>
                        ) : order.status === 'Pending' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#FDB52A] rounded-full inline-block' />
                        <span>Pending</span>
                      </div>
                        ) : order.status === 'Canceled' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#FF5A5F] rounded-full inline-block' />
                        <span>Canceled</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                            <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
                            <span>{order.status}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                    <TableCell className='px-8'>
                      <span>{formatDate(order.date)}</span>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Order Items */}
                  {expandedOrders.has(order.id) && (
                    <TableRow>
                      <TableCell colSpan={4} className='px-8 py-0'>
                        <div className='bg-[#1A1A1A] rounded-lg p-4 mt-2 mb-2'>
                          <h5 className='text-white font-medium text-sm mb-3'>
                            Order Items
                          </h5>
                          <div className='space-y-3'>
                            {order.orderItems.length === 0 ? (
                              <p className='text-auth-text text-sm'>
                                No items found in this order
                              </p>
                            ) : (
                              order.orderItems.map((orderItem) => {
                                const marketItemId = orderItem.fields.Item?.[0];
                                const marketItem = order.marketItems.find(
                                  (item) => item.id === marketItemId,
                                );
                                const itemName =
                                  marketItem?.fields.Name || 'Unknown Item';
                                const itemImage =
                                  marketItem?.fields.Attachments?.[0]?.url ||
                                  AvatarCircle;

                                return (
                                  <div
                                    key={orderItem.id}
                                    className='flex items-center gap-3 p-3 bg-[#0F0F0F] rounded-lg'
                                  >
                                    <Image
                                      src={itemImage}
                                      alt={`${itemName} image`}
                                      width={40}
                                      height={40}
                                      className='rounded-lg object-cover'
                                    />
                                    <div className='flex-1'>
                                      <h6 className='text-white font-medium text-sm'>
                                        {itemName}
                                      </h6>
                                      <div className='flex items-center gap-4 mt-1'>
                                        {orderItem.fields.Quantity &&
                                          orderItem.fields.Quantity > 1 && (
                                            <span className='text-auth-text text-xs'>
                                              Qty: {orderItem.fields.Quantity}
                                            </span>
                                          )}
                                        {orderItem.fields.Size && (
                                          <span className='text-auth-text text-xs'>
                                            Size: {orderItem.fields.Size}
                                          </span>
                                        )}
                                        <span className='text-auth-text text-xs'>
                                          Price:{' '}
                                          {orderItem.fields.Price?.toLocaleString()}{' '}
                                          Cues
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                </TableCell>
              </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default OrderHistory;
